module.exports = (io, cb) => {
  io.on("connection", socket => {
    cb(socket); //will use this soon
    console.log(
      "User " +
        socket.request.user.username +
        " connected with ID: " +
        socket.id
    );

    socket.on("disconnect", () => {
      console.log("User " + socket.request.user.username + " disconnected.");
    });
  });
};
