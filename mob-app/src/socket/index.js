import io from 'socket.io-client';
import config from '../../config';
import {RTCIceCandidate, RTCSessionDescription} from "react-native-webrtc";

export const initSocket = (roomId) => new Promise((res, rej) => {
    const socket = io.connect(config.serviceIP, {
        path: "/io/webrtc",
        query: {
            room: `/${roomId}`,
        },
    });
    if (socket) res(socket);
});

export function socketEvents() {
    if (!this.socket) return;

    this.socket.on('connection-success', (data) => {
        this.getLocalStream();

        console.log(data.success);
        const status =
            data.peerCount > 1
                ? `Total Connected Peers to room ${this.state.room}: ${data.peerCount}`
                : this.state.status;

        this.setState({
            status,
            messages: data.messages,
        });
    });

    this.socket.on('joined-peers', (data) => {
        this.setState({
            status:
                data.peerCount > 1
                    ? `Total Connected Peers to room ${this.state.room}: ${data.peerCount}`
                    : 'Waiting for other peers to connect',
        });
    });

    this.socket.on('peer-disconnected', (data) => {
        console.log('peer-disconnected', data);

        const remoteStreams = this.state.remoteStreams.filter(
            (stream) => stream.id !== data.socketID,
        );

        this.setState((prevState) => {
            console.log(prevState.selectedVideo);
            // check if disconnected peer is the selected video and if there still connected peers, then select the first
            const selectedVideo =
                prevState.selectedVideo &&
                prevState.selectedVideo.id === data.socketID &&
                remoteStreams.length &&
                data.peerCount > 1
                    ? {selectedVideo: remoteStreams[0]}
                    : null;
            return {
                remoteStreams,
                selectedVideo: selectedVideo,
                status:
                    data.peerCount > 1
                        ? `Total Connected Peers to room ${this.state.room}: ${data.peerCount}`
                        : 'Waiting for other peers to connect',
            };
        });
    });

    this.socket.on('online-peer', (socketID) => {
        console.log('connected peers ...', socketID);

        // create and send offer to the peer (data.socketID)
        // 1. Create new pc
        this.createPeerConnection(socketID, (pc) => {
            // 2. Create Offer
            if (pc) {
                // Send Channel
                const handleSendChannelStatusChange = (event) => {
                    console.log(
                        'send channel status: ' + this.state.sendChannels[0].readyState,
                    );
                };

                const sendChannel = pc.createDataChannel('sendChannel');
                sendChannel.onopen = handleSendChannelStatusChange;
                sendChannel.onclose = handleSendChannelStatusChange;

                this.setState((prevState) => {
                    return {
                        sendChannels: [...prevState.sendChannels, sendChannel],
                    };
                });

                // Receive Channels
                const handleReceiveMessage = (event) => {
                    const message = JSON.parse(event.data);
                    console.log(message);
                    this.setState((prevState) => {
                        return {
                            messages: [...prevState.messages, message],
                        };
                    });
                };

                const handleReceiveChannelStatusChange = (event) => {
                    if (this.receiveChannel) {
                        console.log(
                            "receive channel's status has changed to " +
                            this.receiveChannel.readyState,
                        );
                    }
                };

                const receiveChannelCallback = (event) => {
                    const receiveChannel = event.channel;
                    receiveChannel.onmessage = handleReceiveMessage;
                    receiveChannel.onopen = handleReceiveChannelStatusChange;
                    receiveChannel.onclose = handleReceiveChannelStatusChange;
                };

                pc.ondatachannel = receiveChannelCallback;

                pc.createOffer(this.state.sdpConstraints).then((sdp) => {
                    pc.setLocalDescription(sdp);

                    this.sendToPeer('offer', sdp, {
                        local: this.socket.id,
                        remote: socketID,
                    });
                });
            }
        });
    });

    this.socket.on('offer', (data) => {
        this.createPeerConnection(data.socketID, (pc) => {
            pc.addStream(this.state.localStream);

            // Send Channel
            const handleSendChannelStatusChange = (event) => {
                console.log(
                    'send channel status: ' + this.state.sendChannels[0].readyState,
                );
            };

            const sendChannel = pc.createDataChannel('sendChannel');
            sendChannel.onopen = handleSendChannelStatusChange;
            sendChannel.onclose = handleSendChannelStatusChange;

            this.setState((prevState) => {
                return {
                    sendChannels: [...prevState.sendChannels, sendChannel],
                };
            });

            // Receive Channels
            const handleReceiveMessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message);
                this.setState((prevState) => {
                    return {
                        messages: [...prevState.messages, message],
                    };
                });
            };

            const handleReceiveChannelStatusChange = (event) => {
                if (this.receiveChannel) {
                    console.log(
                        "receive channel's status has changed to " +
                        this.receiveChannel.readyState,
                    );
                }
            };

            const receiveChannelCallback = (event) => {
                const receiveChannel = event.channel;
                receiveChannel.onmessage = handleReceiveMessage;
                receiveChannel.onopen = handleReceiveChannelStatusChange;
                receiveChannel.onclose = handleReceiveChannelStatusChange;
            };

            pc.ondatachannel = receiveChannelCallback;

            pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
                () => {
                    // 2. Create Answer
                    pc.createAnswer(this.state.sdpConstraints).then((sdp) => {
                        pc.setLocalDescription(sdp);

                        this.sendToPeer('answer', sdp, {
                            local: this.socket.id,
                            remote: data.socketID,
                        });
                    });
                },
            );
        });
    });

    this.socket.on('answer', (data) => {
        // get remote's peerConnection
        const pc = this.state.peerConnections[data.socketID];
        pc.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
        ).then(() => {});
    });

    this.socket.on('candidate', (data) => {
        // get remote's peerConnection
        const pc = this.state.peerConnections[data.socketID];

        if (pc) pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
}
