//server
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//auth
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const passport = require("passport");

//misc
require("dotenv").config();
const colors = require("colors");
const bcrypt = require("bcryptjs");

//server middlewares
const logger = require("./server-middlewares/logger");
const ROUTER_register = require("./server-middlewares/ROUTE_register");
app.use("/", logger);
app.use(express.static(__dirname + "/dist", { index: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//view engine
app.set("view engine", "pug");

//server modules
require("./server-modules/db-listeners")(mongoose, colors);
const emits = require("./server-modules/server-emits");
const auth = require("./server-modules/auth");

//SET SCHEMA
const adventurerSchema = new mongoose.Schema({
  set: String,
  usernames: [],
  username: {
    type: String,
    // unique: true,
    lowercase: true
  },
  password: { type: String },
  characters: {},
  sharedStash: {}
});
adventurerSchema.pre("save", () => console.log("Hello from pre save"));
adventurerSchema.post("save", () => console.log("Hello from post save"));

adventurerSchema.plugin(uniqueValidator);
const dbModel = mongoose.model("adventurer", adventurerSchema);

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
app.use(
  "/register",
  (req, res, next) => {
    req._dbModel = dbModel;
    next();
  },
  ROUTER_register
);

//database
const dbUri = process.env.DB;
mongoose.connect(
  dbUri,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, db) => {
    if (err) return console.log("Error connecting to DB: " + err);

    //create sets of usernames reference if not existing yet
    dbModel.findOne({ set: "usernames" }, (err, doc) => {
      if (err) return console.log("Error creating usernames ref. " + err);
      if (!doc) {
        const newDoc = new dbModel({
          set: "usernames",
          usernames: { "": "" }
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
    auth(app, passport, dbModel, io);
    let users = {};
    emits(io, socket => {
      users[socket.request.user._id] = socket;
    });
    app.get("/", (req, res) => {
      console.log(JSON.stringify(users));
      res.render(__dirname + "/dist/index.pug", { page: "GamePage" });
    });

    app.post("/login", (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err)
          return res.json({
            type: "error",
            message: "Error while logging in."
          });
        if (!user) {
          return res.json({
            type: "error",
            message: info.message
          });
        } else {
          req.login(user, err => {
            if (err)
              return res.json({
                type: "error",
                message: "failed to login req.login :" + err
              });
            return res.json({
              type: "success",
              message: "Authenticated."
            });
          });
        }
      })(req, res, next);
    });

    app.get("/logout", (req, res) => {
      console.log("User " + req.user.username + " logged out.");

      users[req.user._id].disconnect();
      req.logout();
      res.json({ type: "success", message: "" });
    });
    app.get("/img/:num", (req, res) => {
      res.sendFile(
        __dirname + "/server-img-src/titles/" + req.params.num + ".png"
      );
    });
    const port = process.env.PORT || 8080;
    http.listen(port, () => {
      console.log("Listening to port: " + port);
    });
  }
);
