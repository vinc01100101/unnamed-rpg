module.exports = io => {
  io.on("connection", socket => {
    console.log(
      "User " +
        socket.request.user.username +
        " connected with ID: " +
        socket.id
    );
    socket.on("logout", () => {
      socket.disconnect();
    });
    socket.on("disconnect", () => {
      console.log("User " + socket.request.user.username + " disconnected.");
    });
  });
};
