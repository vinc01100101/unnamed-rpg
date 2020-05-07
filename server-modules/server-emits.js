const bcrypt = require("bcryptjs");
const registrationPromise = require("./registration-promise");

module.exports = (io, AccountModel, MapStashModel) => {
  //as soon as logged in
  let connectedUsers = {};
  //as soon as loadmap or selected a character
  let usersInMap = {};

  io.on("connection", (socket) => {
    //LOAD MAP
    socket.on("loadmap", (stashName, mapName, cb) => {
      MapStashModel.findOne({ mapStashName: stashName }, (err, doc) => {
        if (err) return cb({ type: "error", message: err });
        if (!doc)
          return cb({
            type: "error",
            message: "Stash name doesn't exist",
          });

        cb({
          type: "success",
          message: { mapStashName: doc.mapStashName, map: doc.maps[mapName] },
        });
      });
    });

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
          //check if the same account has already logged in
          if (connectedUsers[doc.username]) {
            console.log(
              "user is already logged in, forcing to leave active user.."
            );
            //if yes, force leave that socket to prevent same account login
            io.to(connectedUsers[doc.username].id).emit(
              "forceleave",
              "Someone has logged on this account"
            );
          }
          //log
          console.log(doc.username + " has connected");
          //broadcast new user
          io.emit("newuser", doc.username);
          //now enter the new socket to connectedUsers object
          connectedUsers[doc.username] = socket;
          //attach doc to socket.__user
          socket.__user = doc;
          console.log(connectedUsers);
          done({ type: "success", message: doc.characters });
        }
      });
    });

    //LOGOUT
    socket.on("logout", (cb) => {
      if (socket.__user) {
        console.log("User " + socket.__user.username + " logged out");
        delete connectedUsers[socket.__user.username];
        delete socket.__user;
      }

      cb();
    });

    //DISCONNECTED
    socket.on("disconnect", () => {
      socket.__user && delete connectedUsers[socket.__user.username];
      socket.__user && console.log(socket.__user.username + " disconnected");
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
                  "Test Character 1": {
                    class: "fNinja",
                    lv: 20,
                    head: "fHead18",
                    map: "r.Prontera",
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
                  "Test Character 2": {
                    class: "fAlchemist",
                    lv: 42,
                    head: "fHead23",
                    map: "Aldebaran",
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
                  "Test Character 3": {
                    class: "fRebellion",
                    lv: 82,
                    head: "fHead28",
                    map: "Glastheim Underground 1F",
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
                  "Test Character 4": {
                    class: "fRoyalGuard",
                    lv: 97,
                    head: "fHead20",
                    map: "Prontera",
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
