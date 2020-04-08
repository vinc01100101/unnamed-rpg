const bcrypt = require("bcryptjs");

module.exports = (io, AccountModel) => {
  io.on("connection", (socket) => {
    //LOGIN
    socket.on("login", (attempt, done) => {
      console.log("SOCKET STRATEGY OYEA!!");
      attempt.username = attempt.username.toLowerCase();
      console.log(attempt.username);
      AccountModel.findOne({ username: attempt.username }, (err, doc) => {
        if (err) throw err;
        if (!doc) {
          console.log("Username does not exist");
          done({ type: "error", message: "Username does not exist" });
        } else if (!bcrypt.compareSync(attempt.password, doc.password)) {
          console.log("Wrong password");
          done({ type: "error", message: "Incorrect password" });
        } else {
          console.log("User " + doc.username + " is authenticated");
          socket.__user = doc;
          done({ type: "success", message: "" });
        }
      });
    });

    //LOGOUT
    socket.on("logout", (cb) => {
      console.log("User " + socket.__user.username + " logged out");
      delete socket.__user;
      cb();
    });

    //REGISTER
    socket.on("register", (attempt, done) => {
      let retries = 0;
      const reg = /^\w+$/;

      attempt.username = attempt.username.toLowerCase();
      console.log(attempt.username);
      if (!reg.test(attempt.username) || !reg.test(attempt.password)) {
        console.log(
          "Blank username or password, client might be editing the client code."
        );
        done({
          type: "error",
          message: "Invalid username.",
        });
      } else {
        callThisToAttemptSave();
        function callThisToAttemptSave() {
          attemptSave()
            .then(() => {
              const newDoc = new AccountModel({
                username: attempt.username,
                password: bcrypt.hashSync(attempt.password, 12),
                characters: { "": "" },
                sharedStash: { "": "" },
              });
              //usernames only used for set reference entry
              newDoc.usernames = undefined;
              newDoc.save((e, save) => {
                if (e) {
                  done({
                    type: "error",
                    message:
                      "Error during saving data USER LEVEL, please try again. Error message: " +
                      e,
                  });
                } else if (!save) {
                  done({
                    type: "error",
                    message: "Failed to save data, please try again.",
                  });
                } else {
                  done({
                    type: "success",
                    message: "Registration successful. Retries: " + retries,
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
                  done({
                    type: "error",
                    message:
                      "Server busy, please try again. Retries: " + retries,
                  });
                }
              } else {
                done(data);
              }
            });
        }
      }
      function attemptSave() {
        return new Promise((resolved, reject) => {
          AccountModel.findOne({ set: "usernames" }, (err, doc) => {
            if (err) {
              return reject({
                type: "error",
                message: "DOC level: error finding data: " + err,
              });
            } else if (!doc) {
              return reject({
                type: "error",
                message: "DOC level: set: username ref. not yet created",
              });
            } else {
              for (const prop of doc.usernames) {
                if (prop == attempt.username) {
                  return reject({
                    type: "error",
                    message: `Username ${attempt.username} already exist. Retries: ${retries}`,
                  });
                  break;
                }
              }
              doc.usernames.unshift(attempt.username);
              doc.markModified("usernames");
              doc.save((er, saved) => {
                if (er) {
                  //possible Version Control error here
                  return reject({
                    type: "error",
                    message: "DOC level: error saving data: " + er,
                  });
                } else if (!saved) {
                  return reject({
                    type: "error",
                    message: "DOC level: no returned saved data",
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
    //disconnected
    socket.on("disconnect", () => {});
  });
};
