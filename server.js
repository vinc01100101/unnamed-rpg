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
const { v4: uuidv4 } = require("uuid");

var useragent = require("express-useragent");

app.use(useragent.express());

//server middlewares
const logger = require("./server-middlewares/logger");
app.use("/", logger);
app.use(express.static(__dirname + "/dist", { index: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.text());

//view engine
app.set("view engine", "pug");

//server modules
const registrationPromise = require("./server-modules/registration-promise");
require("./server-modules/db-listeners")(mongoose, colors);
const emits = require("./server-modules/server-emits");

//SET ACCOUNT SCHEMA
const account = new mongoose.Schema({
  set: String,
  usernames: [],
  username: {
    type: String,
    lowercase: true,
  },
  password: { type: String },
  characters: {},
  sharedStash: {},
});
account.pre("save", () => console.log("Hello from account pre save"));
account.post("save", () => console.log("Hello from account post save"));

account.plugin(uniqueValidator);
const AccountModel = mongoose.model("unnamedrpg_useraccount", account);

//SET MAP STASH SCHEMA
const mapstash = new mongoose.Schema({
  set: String,
  mapStashNames: [],
  mapStashName: {
    type: String,
    lowercase: true,
  },
  key: { type: String },
  maps: {},
});
mapstash.pre("save", () => console.log("Hello from mapStash pre save"));
mapstash.post("save", () => console.log("Hello from mapStash post save"));

mapstash.plugin(uniqueValidator);
const MapStashModel = mongoose.model("unnamedrpg_mapstash", mapstash);

//database
const dbUri = process.env.DB;
mongoose.connect(
  dbUri,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, db) => {
    if (err) return console.log("Error connecting to DB: " + err);

    function createDataIfNotExistingYet(data) {
      //create sets of data set references if not existing yet

      data.Model.findOne({ set: data.ref }, (err, doc) => {
        if (err)
          return console.log("Error creating " + data.ref + " ref. " + err);
        if (!doc) {
          const newDoc = new data.Model({
            set: data.ref,
            [data.ref]: { "": "" },
          });

          newDoc.save((er, saved) => {
            if (er)
              return console.log(
                "Error while saving " + data.ref + " ref. " + er
              );
            if (saved) {
              console.log("Set: " + data.ref + " ref. successfully created.");
            } else {
              console.log("Set: " + data.ref + " ref. creation failed.");
            }
          });
        }
      });
    }

    [
      { Model: AccountModel, ref: "usernames" },
      { Model: MapStashModel, ref: "mapStashNames" },
    ].map((x) => {
      createDataIfNotExistingYet(x);
    });
    //routes
    emits(io, AccountModel);
    app.get("/", (req, res) => {
      if (req.useragent.isFirefox && req.useragent.isDesktop) {
        res.send(
          `<h3>Sorry, our app doesn't run on Firefox.</h3>
          <p>Because Firefox doesn't support canvas transferring which our app is using,
          consider downloading other browser which supports it instead?</p>
          <ul>
          <li>Recommended: <a href='https://www.google.com/chrome/?brand=CHBD&gclid=CjwKCAjwnIr1BRAWEiwA6GpwNW3mAOe44k8Gt7bs_R45kW3AwTYZxt3FOD3wFnutclgrv5Rcn4XlghoCc4sQAvD_BwE&gclsrc=aw.ds'>Chrome</a></li>
          <li>Recommended: <a href='https://brave.com/?ref=cra598'>Brave</a></li>
          <li><a href='https://www.opera.com/'>Opera</a></li>
          </ul>`
        );
      } else {
        res.render(__dirname + "/dist/index.pug", {
          page: "MainPage",
          isDesktop: req.useragent.isDesktop,
          // userAgent: JSON.stringify(req.useragent),
        });
      }
    });

    //CLIENT REQUEST FOR MAP MAKER PAGE
    app.get("/mapmaker", (req, res) => {
      if (!req.useragent.isDesktop) {
        res.send(`<head><meta name="viewport", content="width=device-width, initial-scale=1.0, maximum-scale = 1.0, user-scalable=no"></head>
          <h3>Sorry! Our mapMaker is not yet compatible with mobile.. :(</h3>
          <a href='/'>Back to game page</a>
          `);
      } else if (req.useragent.isFirefox) {
        res.send(
          `<h3>Sorry, our app doesn't run well on Firefox.</h3>
          <p>Because Firefox doesn't support canvas transferring and webm which our app is using,
          consider downloading other browser which supports it instead?</p>
          <ul>
          <li>Recommended: <a href='https://www.google.com/chrome/?brand=CHBD&gclid=CjwKCAjwnIr1BRAWEiwA6GpwNW3mAOe44k8Gt7bs_R45kW3AwTYZxt3FOD3wFnutclgrv5Rcn4XlghoCc4sQAvD_BwE&gclsrc=aw.ds'>Chrome</a></li>
          <li>Recommended: <a href='https://brave.com/?ref=cra598'>Brave</a></li>
          <li><a href='https://www.opera.com/'>Opera</a></li>
          </ul>`
        );
      } else {
        res.render(__dirname + "/dist/index.pug", {
          page: "MapMaker",
          isDesktop: req.useragent.isDesktop,
        });
      }
    });

    //CREATE STASH
    app.post("/mapmaker/createstash", (req, res) => {
      let retries = 0;

      const mapstashname = req.body.toLowerCase();

      callThisToAttemptSave();
      function callThisToAttemptSave() {
        registrationPromise({
          Model: MapStashModel,
          ref: "mapStashNames",
          value: mapstashname,
        })
          .then(() => {
            const uuid = uuidv4();
            const newDoc = new MapStashModel({
              mapStashName: mapstashname,
              key: uuid,
              maps: { "": "" },
            });

            //mapStashNames only used for set reference entry
            newDoc.mapStashNames = undefined;
            newDoc.save((e, save) => {
              if (e) {
                res.json({
                  type: "error",
                  message:
                    "Error during saving data USER LEVEL, please try again. Error message: " +
                    e,
                });
              } else if (!save) {
                res.json({
                  type: "error",
                  message: "Failed to save data, please try again.",
                });
              } else {
                res.json({
                  type: "success",
                  message: `New stash "${mapstashname}" created.
                  Please save this KEY:`,
                  val: uuid,
                });
              }
            });
          })
          .catch((data) => {
            console.log(data.message);
            const reg = /VersionError/g;
            if (reg.test(data.message)) {
              if (retries <= 7) {
                retries++;
                callThisToAttemptSave();
              } else {
                res.json({
                  type: "error",
                  message: "Server busy, please try again. Retries: " + retries,
                });
              }
            } else {
              res.json(data);
            }
          });
      }
    });

    //OPEN STASH
    app.post("/mapmaker/openstash", (req, res) => {
      const mapstashname = req.body.stashName.toLowerCase();
      const mapstashkey = req.body.stashKey;

      MapStashModel.findOne({ mapStashName: mapstashname }, (err, doc) => {
        if (err) return res.json({ type: "error", message: err });
        if (!doc)
          return res.json({
            type: "error",
            message: "Stash name doesn't exist",
          });

        if (doc.key != mapstashkey)
          return res.json({ type: "error", message: "Invalid key" });

        res.json({
          type: "success",
          message: { mapStashName: doc.mapStashName, maps: doc.maps },
        });
      });
    });

    //SAVE STASH
    app.post("/mapmaker/savestash", (req, res) => {
      MapStashModel.findOne(
        { mapStashName: req.body.mapStashName },
        (err, doc) => {
          if (err) return res.json({ type: "error", message: err });
          if (!doc)
            return res.json({
              type: "error",
              message: "Stash name doesn't exist",
            });

          doc.maps[req.body.mapName] = req.body.mapData;
          doc.markModified("maps");
          doc.save((err) => {
            if (err) return res.json({ type: "error", message: err });
            res.json({
              type: "success",
              message: { mapStashName: doc.mapStashName, maps: doc.maps },
            });
          });
        }
      );
    });

    //CLIENT REQUEST FOR SPR MAKER PAGE
    app.get("/spr", (req, res) => {
      res.sendFile(__dirname + "/dist/sprGenerator/index.html");
    });

    const port = process.env.PORT || 8080;
    http.listen(port, () => {
      console.log("Listening to port: " + port);
    });
  }
);
