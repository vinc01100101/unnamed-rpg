const bcrypt = require("bcryptjs");
const registrationPromise = require("./registration-promise");

module.exports = (io, AccountModel) => {
  //as soon as entered a channel
  let playerCountOnChannel = {
    ch1: 0,
    ch2: 0,
  };
  //as soon as logged in
  let connectedUsers = {};

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
            leaveRooms(connectedUsers[doc.username]);
          }
          console.log("my ID is " + socket.id);

          //broadcast new user
          io.emit("newuser", doc.username);
          //now enter the new socket to connectedUsers object
          connectedUsers[doc.username] = socket;
          //attach doc to socket.__user
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
                  "Test Character 1": {
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
                  "Test Character 2": {
                    class: "f_alchemist",
                    head: "f_head1",
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
                  "Test Character 3": {
                    class: "f_monk",
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

    //ON ENTER CHANNEL-----------------
    socket.on("enterchannel", (channelSelected, cb) => {
      //check if room is valid
      const availableRooms = Object.keys(playerCountOnChannel);
      if (availableRooms.indexOf(channelSelected) != -1) {
        socket.join(channelSelected);
        playerCountOnChannel[channelSelected]++;
        cb({ type: "success" });
        console.log(socket.__user.username + " has joined " + channelSelected);
      } else {
        cb({ type: "error", message: "Invalid room" });
      }
    });

    //ON SELECT CHANNEL SCREEN-----------------
    socket.on("channelscreen", (cb) => {
      leaveRooms(socket);
      cb(playerCountOnChannel);
    });

    //ON SELECT CHARACTER SCREEN
    socket.on("characterscreen", (cb) => {
      cb(socket.__user.characters);
    });
    //DISCONNECTED
    socket.on("disconnect", () => {
      leaveRooms(socket);
      socket.__user && console.log(socket.__user.username + " disconnected");
    });

    function leaveRooms(s) {
      //check if has existing room
      const rooms = Object.keys(s.rooms);
      //leave all
      if (rooms.length > 1) {
        rooms.map((room) => {
          if (room in playerCountOnChannel) {
            s.leave(room);
            playerCountOnChannel[room] && playerCountOnChannel[room]--;
          }
        });
      }
    }
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
