const PicturesService = require('./services/picturesService');
module.exports = function(socket) {
  let { room } = socket.handshake.query;
  console.log('join:', room)
  socket.join(room);
  socket.on('show-email-popup', (data) => {
    console.log('show-email-popup:', data)
    socket.to(room).emit('show-email-popup', data)
  });
  socket.on('live-email-change', (data) => {
    console.log('live-email-change:', data)
    PicturesService.updateEmail(data.pictureSetId, data.email)
      .then(set => {
        socket.to(room).emit('live-email-change', data.email)
      });
  });
};
