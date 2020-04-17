const bcrypt = require("bcryptjs");
const registrationPromise = require("./registration-promise");

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
      const reg = /^\w+$/;

      attempt.username = attempt.username.toLowerCase();

      if (!reg.test(attempt.username) || !reg.test(attempt.password)) {
        console.log(
          "Blank username or password, client might be editing the client code."
        );
        done({
          type: "error",
          message: "Invalid username.",
        });
      } else {
        let retries = 0;

        callThisToAttemptSave();
        function callThisToAttemptSave() {
          registrationPromise({
            Model: AccountModel,
            ref: "usernames",
            value: attempt.username,
          })
            .then(() => {
              // const newDoc = new AccountModel({
              //   username: attempt.username,
              //   password: bcrypt.hashSync(attempt.password, 12),
              //   characters: { "": "" },
              //   sharedStash: { "": "" },
              // });

              //TEST
              const newDoc = new AccountModel({
                username: attempt.username,
                password: bcrypt.hashSync(attempt.password, 12),
                characters: {
                  "Character Name": {
                    class: "f_ninja",
                    head: "f_head0",
                    map: "Starting Zone",
                    x: 32,
                    y: 20,
                    z: 5,
                    zeny: 1240107,
                    currHp: 800,
                    currMp: 450,
                    stats: {
                      str: 20,
                      agi: 10,
                      int: 9,
                    },
                    //for items and skills we use ID//
                    skills: ["1124", "1032"],
                    inventory: ["0201", "1031", "0401", "1209"],
                    equipment: {
                      head: "0001",
                      armor: "0002",
                      weapon: "0003",
                      accessory: "1214",
                    },
                    quickSlots: ["0201", "0401", "1124", "1032"],
                  },
                },
                sharedStash: { zeny: "100000", items: ["0201", "0201"] },
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
    });
    //disconnected
    socket.on("disconnect", () => {});
  });
};

/*sample character object format:
  characters: {
    "Character Name":{
      map: "Starting Zone",
      x: 32,
      y: 20,
      z: 5,
      zeny: 1240107,  
      currHp: 800,
      currMp: 450,
      stats: {
        str: 20,
        agi: 10,
        int: 9
      }
    },
    //for items and skills we use ID//
    skills:['1124','1032'],
    inventory:['0201','1031','0401','1209'],
    equipment:{
      head: '0001',
      armor: '0002',
      weapon: '0003'
    },
    quickSlots:['0201','0401','1124','1032']
}
*/
