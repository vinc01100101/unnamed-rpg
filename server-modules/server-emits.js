module.exports = io => {
  io.on("connection", socket => {
    console.log("User connected with ID: " + socket.id);

    socket.on("login", data => {
      console.log(data);
    });
  });
};
