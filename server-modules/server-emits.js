const bcrypt = require("bcryptjs");
const registrationPromise = require("./registration-promise");
const sortedClass = require("./sortedClass").sortedClass;

module.exports = (io, AccountModel, MapStashModel) => {
  //GLOBAL HASH TABLES
  //as soon as logged in
  let connectedUsers = {};
  //as soon as loadmap or selected a character
  let usersInMap = {};

  //global loadmap function
  function _loadMap(stashName, mapName, cb) {
    console.log("Loading map..");
    MapStashModel.findOne({ mapStashName: stashName }, (err, doc) => {
      console.log("Map search complete");
      //err
      if (err) return cb({ type: "error", message: err });
      //err no result
      if (!doc)
        return cb({
          type: "error",
          message: "Stash name doesn't exist",
        });
      //err no map exist
      if (!doc.maps[mapName])
        return cb({
          type: "error",
          message: "Map doesn't exist",
        });
      cb({
        type: "success",
        message: { mapStashName: doc.mapStashName, map: doc.maps[mapName] },
      });
    });
  }
  //reference for encrypting data to 8bit integer
  const encryptReference = {
    type: ["player", "monster", "npc"],
    body: sortedClass,
    bodyFacing: ["f", "fl", "l", "bl", "b", "br", "r", "fr"],
    act: [
      "idle",
      "walk",
      "sit",
      "pick",
      "standby",
      "attack1",
      "damaged",
      "freeze1",
      "dead",
      "freeze2",
      "attack2",
      "attack3",
      "cast",
    ],
  };
  //from JSON to UINT8
  function encryptData(data) {
    const int8 = new Uint8Array(8);
    //index 0 reserved for indicesByte
    int8[0] = 255; //or 0b11111111 / marked all as changed
    //type
    int8[1] = encryptReference.type.indexOf(data.type);
    //head
    int8[2] = parseInt(data.head.replace(/head/, ""));
    //body
    int8[3] = encryptReference.body.indexOf(data.body);
    //bodyFacing
    int8[4] = encryptReference.bodyFacing.indexOf(data.bodyFacing);
    //action
    int8[5] = encryptReference.act.indexOf(data.act);
    //fps
    int8[6] = data.fps;
    //selfCounter for idle act's headFacing
    int8[7] = data.selfCounter;

    //return the 8bit integer array
    return int8;
  }
  //ON CONNECTION DETECTED
  io.on("connection", (socket) => {
    // AHAAAAAAA!!!! ALL VARIABLES INSIDE THIS SCOPE "CONNECTION" IS UNIQUE TO THIS SOCKET!!

    //AREA_UNITS = all visible units specific to this user :D
    //USER_TIMER = where we will assign setInterval for this user that ticks 60 per second
    //USER_MAP = current map of the user
    let AREA_UNITS = {},
      USER_TIMER,
      USER_MAP,
      //move spd value to add to USER_CHAR_LIVE coords
      USER_MOVING = [0, 0],
      //act value to change to USER_CHAR_LIVE
      USER_ACT = "idle",
      //bodyFacing value to change to USER_CHAR_LIVE
      USER_BODYFACING = "f",
      //main reference data
      USER_CHAR = {},
      //live reference
      USER_CHAR_LIVE = {};

    function _startPPS() {
      //clear interval first
      clearInterval(USER_TIMER);
      const USER_CHAR_LIVE = {
        type: "player",
        head: USER_CHAR.data.head,
        body: USER_CHAR.data.body,
        bodyFacing: "f",
        act: "walk",
        fps: 10,
        //change this value when entering new map, refer to the new map instead of USER_CHAR
        mapCoords: USER_CHAR.data.mapCoords,
        selfCounter: 0,
      };
      if (!usersInMap[USER_MAP]) {
        usersInMap[USER_MAP] = {};
      }

      // PUT INTO UNITS-IN-MAP REFERENCE
      // SO THAT CHANGING USER_CHAR_LIVE WILL ALSO CHANGE ON THAT UNITS-IN-MAP
      usersInMap[USER_MAP][USER_CHAR.name] = USER_CHAR_LIVE;

      USER_TIMER = setInterval(() => {
        //array packet to send
        //filter the usersInMap[mapOfTheUser] to get the units within scope of the user
        let packet = {};
        //packet structure
        // {
        //   charname1: [[mapCoordsX,Y,Z],[int8,...]]
        // }

        //update live value based on user input
        USER_CHAR_LIVE.mapCoords[0] += USER_MOVING[0];
        USER_CHAR_LIVE.mapCoords[1] += USER_MOVING[1];
        USER_CHAR_LIVE.act = USER_ACT;
        USER_CHAR_LIVE.bodyFacing = USER_BODYFACING;

        Object.entries(usersInMap[USER_MAP]).map((x) => {
          //the entry or unit in this specific map, can be the main char
          const entryMapCoords = x[1].mapCoords;
          //the main character
          const mainMapCoords = USER_CHAR_LIVE.mapCoords;
          //area of scope based on the main character
          if (
            entryMapCoords[0] >= mainMapCoords[0] - 7 &&
            entryMapCoords[0] <= mainMapCoords[0] + 7 &&
            entryMapCoords[1] >= mainMapCoords[1] - 7 &&
            entryMapCoords[1] <= mainMapCoords[1] + 7
          ) {
            //this will return an array of unsigned 8bit integer from this value
            const enc = encryptData(x[1]);
            //if not yet included in the area of view
            //send the whole data in Uint8Array, use the encrypt object
            if (!AREA_UNITS[x[0]]) {
              packet[x[0]] = [entryMapCoords, enc.buffer];
              AREA_UNITS[x[0]] = {};
              AREA_UNITS[x[0]].mapCoords = entryMapCoords.concat();
              AREA_UNITS[x[0]].data = enc;
            } else {
              //else if the unit is already registered in the area from the previous tick
              //map through values to know when there are some changes
              //when there are changes, include the changes in the packet to be sent

              //-----------------------------------------------------
              //bits to store the indices using bitwise operator |,
              //which then will be included in the packet
              //0b00000000
              let indicesByte = 0;

              //array to store the value changes
              let arrChanges = [];

              //short loop, start to 1, excluding the indicesByte
              for (let i = 1; i < AREA_UNITS[x[0]].data.length; i++) {
                //if this value has changed on this tick
                if (AREA_UNITS[x[0]].data[i] != enc[i]) {
                  //store the index to indicesByte using bitwise OR
                  indicesByte = indicesByte | (2 ** i);
                  arrChanges.push(enc[i]);
                  //update the area of sight
                  AREA_UNITS[x[0]].data[i] = enc[i];
                } //else do nothing
              }
              //-----------------------------------------------------

              //compare coordinates to know if this user moved
              if (
                JSON.stringify(AREA_UNITS[x[0]].mapCoords) !=
                JSON.stringify(entryMapCoords)
              ) {
                // console.log("USER IS MOVING...");
                packet[x[0]] = [entryMapCoords];
                //update the area of sight
                AREA_UNITS[x[0]].mapCoords = entryMapCoords.concat();
              }
              //-----------------------------------------------------

              //if there are changes in some values,
              //and the changes count is less than or equal to 8
              if (arrChanges.length > 0 && arrChanges.length <= 8) {
                //indicesByte on the first index
                const changesByte = new Uint8Array(
                  [indicesByte].concat(arrChanges)
                );
                //if object is already created from coordinates check
                if (packet[x[0]]) {
                  packet[x[0]][1] = changesByte.buffer;
                } else {
                  packet[x[0]] = [0, changesByte.buffer];
                }
              } else if (arrChanges.length > 8) {
                //else if changes count is > 8,
                //send the entire data because its length exceeds the
                //indicesByte length which has only 8bits or 1byte

                //if object is already created from coordinates check
                if (packet[x[0]]) {
                  packet[x[0]][1] = enc.buffer;
                } else {
                  packet[x[0]] = [0, enc.buffer];
                }
              }
            }

            //mark this as included (or detected in the area of visibility)
            //then delete the excluded later
            AREA_UNITS[x[0]].isIncluded = true;
          }
        });
        //delete the units that disappear from area of sight
        for (const [key, val] of Object.entries(AREA_UNITS)) {
          if (val.isIncluded) {
            //switch back to false
            AREA_UNITS[key].isIncluded = false;
          } else {
            //mark this as 0 to allow client to delete this as well
            packet[key] = 0;
            //delete if not included
            delete AREA_UNITS[key];
          }
        }

        //psps=packets per second LOL
        //send that array packet to client
        if (Object.keys(packet).length > 0) {
          //if there is update, send the packet,
          //else, don't emit anything to save bandwidth

          socket.emit("psps", packet);
        }
      }, 1000 / 30);
    }

    function _endPPS() {
      USER_CHAR.name && delete usersInMap[USER_MAP][USER_CHAR.name];
      clearInterval(USER_TIMER);
    }
    //CHARACTER SELECTED
    socket.on("selectedcharacter", (name, cb) => {
      USER_CHAR.data = socket.__user.characters[name];
      USER_CHAR.name = name;
      if (USER_CHAR.data) {
        USER_MAP = USER_CHAR.data.map.split(".")[1];
        cb({ type: "success" });
      } else {
        cb({
          type: "error",
          message: "Character does not exist",
        });
      }
    });

    //LOAD MAP
    socket.on("loadmap", (stashName, mapName, cb) => {
      _loadMap(stashName, mapName, (result) => {
        if (result.type == "success") {
          console.log("Loaded map: " + result);
          _startPPS();
        }
        cb(result);
      });
    });

    //CLIENT INPUT
    socket.on("clientinput", (p) => {
      const p8 = new Uint8Array(p);
      USER_MOVING =
        p8[0] == 0b1000
          ? [0, -0.03125]
          : p8[0] == 0b0100
          ? [0.03125, 0]
          : p8[0] == 0b0010
          ? [0, 0.03125]
          : p8[0] == 0b0001
          ? [-0.03125, 0]
          : //diagonal directions c^2 = a^2 + b^2 //0.02209708691207961
          //up right
          p8[0] == 0b1100
          ? [0.02209708691207961, -0.02209708691207961]
          : //down right
          p8[0] == 0b0110
          ? [0.02209708691207961, 0.02209708691207961]
          : //down left
          p8[0] == 0b0011
          ? [-0.02209708691207961, 0.02209708691207961]
          : //up left
          p8[0] == 0b1001
          ? [-0.02209708691207961, -0.02209708691207961]
          : [0, 0];

      USER_BODYFACING =
        p8[0] == 0b1000
          ? "b"
          : p8[0] == 0b0100
          ? "r"
          : p8[0] == 0b0010
          ? "f"
          : p8[0] == 0b0001
          ? "l"
          : //diagonal directions
          //up right
          p8[0] == 0b1100
          ? "br"
          : //down right
          p8[0] == 0b0110
          ? "fr"
          : //down left
          p8[0] == 0b0011
          ? "fl"
          : //up left
          p8[0] == 0b1001
          ? "bl"
          : USER_BODYFACING;

      USER_ACT = USER_MOVING.toString() != "0,0" ? "walk" : "idle";
    });
    //LOGIN
    socket.on("login", (attempt, done) => {
      attempt.username = attempt.username.toLowerCase();
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
      _endPPS();
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
                    body: "fNinja",
                    lv: 20,
                    head: "head18",
                    map: "r.Prontera",
                    mapCoords: [4, 4],
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
                    body: "fAlchemist",
                    lv: 42,
                    head: "head23",
                    map: "r.Prontera",
                    mapCoords: [4, 5],
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
                    body: "fRebellion",
                    lv: 82,
                    head: "head28",
                    map: "r.Prontera",
                    mapCoords: [5, 4],
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
                    body: "fRoyalGuard",
                    lv: 97,
                    head: "head20",
                    map: "r.Prontera",
                    mapCoords: [5, 5],
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
