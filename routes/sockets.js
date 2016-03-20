module.exports = function (client) {
    client.on('action', (action) => {
        if(action.type === 'server/hello'){
            console.log('Got hello data!', action.data);
            socket.emit('action', {type:'message', data:'good day!'});
        }
    })
}