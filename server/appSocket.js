module.exports = function (socket) {
  let { room } = socket.handshake.query;
  socket.join(room);
  socket.on('show-email-popup', function (data) {
    socket.to(room).emit('show-email-popup', data)
  });
};