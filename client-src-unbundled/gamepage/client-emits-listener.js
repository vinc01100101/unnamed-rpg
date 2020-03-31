module.exports = socket => {
  socket.on("connect", () => {
    console.log("We are connected.");
  });
};
