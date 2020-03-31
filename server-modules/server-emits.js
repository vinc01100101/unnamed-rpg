module.exports = (io, cb) => {
  io.on("connection", socket => {
    cb(socket);
    console.log(
      "User " +
        socket.request.user.username +
        " connected with ID: " +
        socket.id
    );

    socket.on("try emit", data => {
      console.log("Emit from " + socket.request.user.username + " " + data);
    });

    socket.on("disconnect", () => {
      console.log("User " + socket.request.user.username + " disconnected.");
    });
  });
};
