//Odin

//GLOBAL variables
const GLOBALS = require("./GLOBALS");

//server
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//auth
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
        page: "MainPage",
        isDesktop: req.useragent.isDesktop,
      });
    });

    app.get("/mapmaker", (req, res) => {
      res.sendFile(__dirname + "/dist/mapMaker/mapMaker.html");
    });

    app.get("/spr", (req, res) => {
      res.sendFile(__dirname + "/dist/sprGenerator/index.html");
    });

    const port = process.env.PORT || 8080;
    http.listen(port, () => {
      console.log("Listening to port: " + port);
    });
  }
);
