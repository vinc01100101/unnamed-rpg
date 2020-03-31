const router = require("express").Router();
const express = require("express");
const bcrypt = require("bcryptjs");

router.use(express.urlencoded({ extended: false }));
router.post("/", (req, res) => {
  let retries = 0;
  const reg = /^\w+$/;
  if (!reg.test(req.body.username) || !reg.test(req.body.password)) {
    console.log(
      "Blank username or password, client might be editing the client code."
    );
    res.json({
      type: "error",
      message: "Invalid username."
    });
  } else {
    callThisToAttemptSave();
    function callThisToAttemptSave() {
      attemptSave()
        .then(() => {
          const newDoc = new req._dbModel({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 12),
            characters: { "": "" },
            sharedStash: { "": "" }
          });
          newDoc.save((e, save) => {
            if (e) {
              res.json({
                type: "error",
                message:
                  "Error during saving data USER LEVEL, please try again. Error message: " +
                  e
              });
            } else if (!save) {
              res.json({
                type: "error",
                message: "Failed to save data, please try again."
              });
            } else {
              res.json({
                type: "success",
                message: "Registration successful. Retries: " + retries
              });
            }
          });
        })
        .catch(data => {
          console.log(data.message);
          const reg = /VersionError/g;
          if (reg.test(data.message)) {
            if (retries <= 7) {
              retries++;
              callThisToAttemptSave();
            } else {
              res.json({
                type: "error",
                message: "Server busy, please try again. Retries: " + retries
              });
            }
          } else {
            res.json(data);
          }
        });
    }
  }
  function attemptSave() {
    return new Promise((resolved, reject) => {
      req._dbModel.findOne({ set: "usernames" }, (err, doc) => {
        if (err) {
          return reject({
            type: "error",
            message: "DOC level: error finding data: " + err
          });
        } else if (!doc) {
          return reject({
            type: "error",
            message: "DOC level: set: username ref. not yet created"
          });
        } else {
          for (const prop of doc.usernames) {
            if (prop == req.body.username) {
              return reject({
                type: "error",
                message: `Username ${req.body.username} already exist. Retries: ${retries}`
              });
              break;
            }
          }
          doc.usernames.unshift(req.body.username);
          doc.markModified("usernames");
          doc.save((er, saved) => {
            if (er) {
              //possible Version Control error here
              return reject({
                type: "error",
                message: "DOC level: error saving data: " + er
              });
            } else if (!saved) {
              return reject({
                type: "error",
                message: "DOC level: no returned saved data"
              });
            } else {
              resolved();
            }
          });
        }
      });
    });
  }
});

module.exports = router;
