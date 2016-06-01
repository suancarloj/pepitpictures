'use strict';
let uploader = new Set();

const screensMap = {};

module.exports = function (io) {
    return function (client) {
        console.log("Socket connected: " + client.id);
        client.on('action', (action) => {
            if (action.type === 'server/identify') {
                console.log('identifing: ', action.data);

                if (action.data.type === 'VIEWER') {
                    screensMap[action.data.id] = client.id;
                    [...uploader].forEach(u => {
                        io.sockets.connected[u] && io.sockets.connected[u].emit('action', { type: 'NEW_VIEWER', payload: Object.keys(screensMap )} )
                    })
                } else if (action.data.type === 'UPLOADER') {
                    uploader.add(client.id);
                    client.emit('action', { type: 'NEW_VIEWER', payload: Object.keys(screensMap) } )
                }
            }

            if (action.type === 'server/hello') {
                console.log('Got hello data!', action.data);
                socket.emit('action', {type:'message', data:'good day!'});
            }

            if (action.type === 'server/uploader') {
                uploader = client.id
                client.emit('action', { type: 'CLIENT_LIST', data: screensMap })
            }

            if (action.type === 'server/display-new-picture-set') {
                console.log(action.data)
            }
        });

        client.on('disconnect', function(){
            console.log('user disconnected');
        });
    }
};