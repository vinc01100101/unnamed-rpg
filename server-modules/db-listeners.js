module.exports = (mongoose, colors) => {
  mongoose.connection.on("connecting", () => {
    console.log(colors.yellow("Connecting to DB.."));
  });
  mongoose.connection.on("connected", () => {
    console.log(colors.cyan.bold.underline("DB connected."));
  });
  mongoose.connection.on("disconnecting", () => {
    console.log("Disconnecing to DB..");
  });
  mongoose.connection.on("disconnected", () => {
    console.log(colors.red.bold("Lost connection to DB network."));
  });
  mongoose.connection.on("close", () => {
    console.log("DB closed.");
  });
  mongoose.connection.on("reconnected", () => {
    console.log("DB reconnected.");
  });

  process.on("SIGINT", function() {
    mongoose.connection.close(function() {
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });
};
