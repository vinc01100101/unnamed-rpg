//Odin

//GLOBAL variables
const GLOBALS = require("./GLOBALS");

//server
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//authp
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//misc
require("dotenv").config();
const colors = require("colors");
const bcrypt = require("bcryptjs");

var useragent = require("express-useragent");

app.use(useragent.express());

//server middlewares
const logger = require("./server-middlewares/logger");
app.use("/", logger);
app.use(express.static(__dirname + "/dist", { index: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//view engine
app.set("view engine", "pug");

//server modules
require("./server-modules/db-listeners")(mongoose, colors);
const emits = require("./server-modules/server-emits");

//SET SCHEMA
const account = new mongoose.Schema({
  set: String,
  usernames: [],
  username: {
    type: String,
    // unique: true,
    lowercase: true,
  },
  password: { type: String },
  characters: {},
  sharedStash: {},
});
account.pre("save", () => console.log("Hello from pre save"));
account.post("save", () => console.log("Hello from post save"));

account.plugin(uniqueValidator);
const AccountModel = mongoose.model("adventurer", account);

/*sample character object format:
  characters: {
    name: "Character Name",
    map: "Starting Zone",
    zeny: 1240107,  
    currHp: 800,
    currMp: 450,
    stats: {
      str: 20,
      agi: 10,
      int: 9
    },
    //for items and skills we use ID//
    skills:[1124,1032],
    inventory:[0201,1031,0401,1209],
    equipment:{
      head: 0001,
      armor: 0002,
      weapon: 0003
    },
    quickSlots:[0201,0401,1124,1032]
}*/

//database
const dbUri = process.env.DB;
mongoose.connect(
  dbUri,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, db) => {
    if (err) return console.log("Error connecting to DB: " + err);

    //create sets of usernames reference if not existing yet
    AccountModel.findOne({ set: "usernames" }, (err, doc) => {
      if (err) return console.log("Error creating usernames ref. " + err);
      if (!doc) {
        const newDoc = new AccountModel({
          set: "usernames",
          usernames: { "": "" },
        });

        newDoc.save((er, saved) => {
          if (er) return console.log("Error while saving usernames ref. " + er);
          if (saved) {
            console.log("Set: usernames ref. successfully created.");
          } else {
            console.log("Set: usernames ref. creation failed.");
          }
        });
      }
    });

    //routes
    emits(io, AccountModel);
    app.get("/", (req, res) => {
      res.render(__dirname + "/dist/index.pug", {
        page: "GamePage",
        isDesktop: req.useragent.isDesktop,
      });
    });

    const port = process.env.PORT || 8080;
    http.listen(port, () => {
      console.log("Listening to port: " + port);
    });
  }
);
