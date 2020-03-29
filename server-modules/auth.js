const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sessionStore = new session.MemoryStore();
const cookieParser = require("cookie-parser");
const passportSocketio = require("passport.socketio");

module.exports = (app, passport, dbModel, io) => {
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      key: "express.sid",
      store: sessionStore
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  io.use(
    passportSocketio.authorize({
      cookieParser: cookieParser,
      key: "express.sid",
      secret: process.env.SESSION_SECRET,
      store: sessionStore
    })
  );
  passport.serializeUser((user, done) => {
    console.log("SERIALIZING: " + JSON.stringify(user));
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    console.log("DESERIALIZING: " + id);
    dbModel.findById(id, (err, doc) => {
      if (err) throw err;
      if (!doc) {
        console.log("Deserialize failed, no ID found: " + id);
        done(null, false);
      } else {
        console.log("User " + doc.name + " deserialized");
        done(null, doc);
      }
    });
  });
  passport.use(
    new LocalStrategy((username, password, done) => {
      console.log("LOCAL STRATEGY");
      try {
        dbModel.findOne({ username }, (err, doc) => {
          if (err) throw err;
          if (!doc) {
            console.log("Username does not exist");
            done(null, false, { message: "Username does not exist" });
          } else if (!bcrypt.compareSync(password, doc.password)) {
            console.log("Wrong password");
            done(null, false, { message: "Incorrect password" });
          } else {
            console.log("User " + doc.name + " is authenticated");
            done(null, doc);
          }
        });
      } catch (e) {
        console.log("Local Strategy Error: " + e);
      }
    })
  );
};
