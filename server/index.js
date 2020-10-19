const express = require('express');
const io = require('socket.io')({ path: '/io/webrtc' });
const config = require('./config');
const cors = require('cors')
const { getRoutes } = require('./app');


const app = express();
const port = config.port;


const rooms = {};
const messages = {};


const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(getRoutes());

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});

io.listen(server);

// default namespace
io.on('connection', socket => {
    console.log('connected')
});

// https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm
const peers = io.of('/webrtcPeer');

// keep a reference of all socket connections
// let connectedPeers = new Map()

peers.on('connection', socket => {
    const room = socket.handshake.query.room;

    rooms[room] = rooms[room] && rooms[room].set(socket.id, socket) || (new Map()).set(socket.id, socket);
    messages[room] = messages[room] || [];

    // connectedPeers.set(socket.id, socket)

    socket.emit('connection-success', {
        success: socket.id,
        peerCount: rooms[room].size,
        messages: messages[room],
    });

    // const broadcast = () => socket.broadcast.emit('joined-peers', {
    //   peerCount: connectedPeers.size,
    // })
    const broadcast = () => {
        const _connectedPeers = rooms[room];

        for (const [socketID, _socket] of _connectedPeers.entries()) {
            // if (socketID !== socket.id) {
            _socket.emit('joined-peers', {
                peerCount: rooms[room].size, //connectedPeers.size,
            })
            // }
        }
    };
    broadcast();

    // const disconnectedPeer = (socketID) => socket.broadcast.emit('peer-disconnected', {
    //   peerCount: connectedPeers.size,
    //   socketID: socketID
    // })
    const disconnectedPeer = (socketID) => {
        const _connectedPeers = rooms[room];
        for (const [_socketID, _socket] of _connectedPeers.entries()) {
            _socket.emit('peer-disconnected', {
                peerCount: rooms[room].size,
                socketID
            })
        }
    };

    socket.on('new-message', (data) => {
        messages[room] = [...messages[room], JSON.parse(data.payload)]
    });

    socket.on('disconnect', () => {
        // connectedPeers.delete(socket.id)
        rooms[room].delete(socket.id);
        messages[room] = rooms[room].size === 0 ? null : messages[room];
        disconnectedPeer(socket.id)
    });

    // ************************************* //
    // NOT REQUIRED
    // ************************************* //
    socket.on('socket-to-disconnect', (socketIDToDisconnect) => {
        // connectedPeers.delete(socket.id)
        rooms[room].delete(socketIDToDisconnect);
        messages[room] = rooms[room].size === 0 ? null : messages[room];
        disconnectedPeer(socketIDToDisconnect)
    });

    socket.on('onlinePeers', (data) => {
        const _connectedPeers = rooms[room];
        for (const [socketID, _socket] of _connectedPeers.entries()) {
            // don't send to self
            if (socketID !== data.socketID.local) {
                socket.emit('online-peer', socketID)
            }
        }
    });

    socket.on('offer', data => {
        const _connectedPeers = rooms[room];
        for (const [socketID, socket] of _connectedPeers.entries()) {
            // don't send to self
            if (socketID === data.socketID.remote) {
                socket.emit('offer', {
                        sdp: data.payload,
                        socketID: data.socketID.local
                    }
                )
            }
        }
    });

    socket.on('answer', (data) => {
        const _connectedPeers = rooms[room];
        for (const [socketID, socket] of _connectedPeers.entries()) {
            if (socketID === data.socketID.remote) {
                socket.emit('answer', {
                        sdp: data.payload,
                        socketID: data.socketID.local
                    }
                )
            }
        }
    });

    // socket.on('offerOrAnswer', (data) => {
    //   // send to the other peer(s) if any
    //   for (const [socketID, socket] of connectedPeers.entries()) {
    //     // don't send to self
    //     if (socketID !== data.socketID) {
    //       socket.emit('offerOrAnswer', data.payload)
    //     }
    //   }
    // })

    socket.on('candidate', (data) => {
        const _connectedPeers = rooms[room];
        // send candidate to the other peer(s) if any
        for (const [socketID, socket] of _connectedPeers.entries()) {
            if (socketID === data.socketID.remote) {
                socket.emit('candidate', {
                    candidate: data.payload,
                    socketID: data.socketID.local
                })
            }
        }
    })
});
