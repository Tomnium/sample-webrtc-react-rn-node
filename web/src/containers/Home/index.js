import React, { Component } from 'react';
import { initSocket, socketEvents } from '../../socket';

import HomeView from '../../components/HomeView';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            localStream: null, // used to hold local stream object to avoid recreating the stream everytime a new offer comes
            remoteStream: null, // used to hold remote stream object that is displayed in the main screen

            remoteStreams: [], // holds all Video Streams (all remote streams)
            peerConnections: {}, // holds all Peer Connections
            selectedVideo: null,

            status: "Please wait...",

            pc_config: {
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302",
                    },
                ],
            },

            sdpConstraints: {
                mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true,
                },
            },

            messages: [],
            sendChannels: [],
            disconnected: false,
        };

        this.socket = null;
        this.socketEvents = socketEvents.bind(this)
    }

    async componentDidMount() {
        this.socket = await initSocket();
        this.socketEvents();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.disconnected && this.state.disconnected) {
            this.handleDisconnect();
        }
    }

    sendToPeer = (messageType, payload, socketID) => {
        this.socket.emit(messageType, {
            socketID,
            payload,
        });
    };

    whoIsOnline = () => {
        // let all peers know I am joining
        this.sendToPeer("onlinePeers", null, { local: this.socket.id });
    };

    getLocalStream = () => {
        const success = (stream) => {
            window.localStream = stream;
            this.setState({localStream: stream});
            this.whoIsOnline();
        };

        const failure = (e) => {
            console.log("getUserMedia Error: ", e);
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        // see the above link for more constraint options
        const constraints = {
            audio: true,
            video: true,
            // video: {
            //   width: 1280,
            //   height: 720
            // },
            // video: {
            //   width: { min: 1280 },
            // }
            options: {
                mirror: true,
            },
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(success)
            .catch(failure);
    };

    createPeerConnection = (socketID, callback) => {
        try {
            let pc = new RTCPeerConnection(this.state.pc_config);

            // add pc to peerConnections object
            const peerConnections = { ...this.state.peerConnections, [socketID]: pc };
            this.setState({
                peerConnections,
            });

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    this.sendToPeer("candidate", e.candidate, {
                        local: this.socket.id,
                        remote: socketID,
                    });
                }
            };

            pc.ontrack = (e) => {
                let _remoteStream = null;
                let remoteStreams = this.state.remoteStreams;
                let remoteVideo = {};

                // 1. check if stream already exists in remoteStreams
                const rVideos = this.state.remoteStreams.filter(
                    (stream) => stream.id === socketID
                );

                // 2. if it does exist then add track
                if (rVideos.length) {
                    _remoteStream = rVideos[0].stream;
                    _remoteStream.addTrack(e.track, _remoteStream);

                    remoteVideo = {
                        ...rVideos[0],
                        stream: _remoteStream,
                    };
                    remoteStreams = this.state.remoteStreams.map((_remoteVideo) => {
                        return (
                            (_remoteVideo.id === remoteVideo.id && remoteVideo) ||
                            _remoteVideo
                        );
                    });
                } else {
                    // 3. if not, then create new stream and add track
                    _remoteStream = new MediaStream();
                    _remoteStream.addTrack(e.track, _remoteStream);

                    remoteVideo = {
                        id: socketID,
                        name: socketID,
                        stream: _remoteStream,
                    };
                    remoteStreams = [...this.state.remoteStreams, remoteVideo];
                }

                // const remoteVideo = {
                //   id: socketID,
                //   name: socketID,
                //   stream: e.streams[0]
                // }

                this.setState((prevState) => {
                    // If we already have a stream in display let it stay the same, otherwise use the latest stream
                    // const remoteStream = prevState.remoteStreams.length > 0 ? {} : { remoteStream: e.streams[0] }
                    const remoteStream =
                        prevState.remoteStreams.length > 0
                            ? {}
                            : { remoteStream: _remoteStream };

                    // get currently selected video
                    let selectedVideo = prevState.remoteStreams.filter(
                        (stream) => stream.id === prevState.selectedVideo.id
                    );
                    // if the video is still in the list, then do nothing, otherwise set to new video stream
                    selectedVideo = selectedVideo.length
                        ? {}
                        : { selectedVideo: remoteVideo };

                    return {
                        // selectedVideo: remoteVideo,
                        ...selectedVideo,
                        // remoteStream: e.streams[0],
                        ...remoteStream,
                        remoteStreams, //: [...prevState.remoteStreams, remoteVideo]
                    };
                });
            };

            pc.close = () => {
                // alert('GONE')
                console.log("pc closed");
            };

            if (this.state.localStream)
            // pc.addStream(this.state.localStream)

                this.state.localStream.getTracks().forEach((track) => {
                    pc.addTrack(track, this.state.localStream);
                });

            // return pc
            callback(pc);
        } catch (e) {
            console.log("Something went wrong! pc not created!!", e);
            // return;
            callback(null);
        }
    };

    switchVideo = (_video) => this.setState({selectedVideo: _video});

    updateState = (data) => this.setState(data);

    handleDisconnect = () => {
        const {
            localStream,
            peerConnections,
            remoteStreams,
        } = this.state;
        // disconnect socket
        this.socket.close();
        // stop local audio & video tracks
        this.stopTracks(localStream);

        // stop all remote audio & video tracks
        remoteStreams.forEach((rVideo) => this.stopTracks(rVideo.stream));

        // stop all remote peerconnections
        peerConnections &&
        Object.values(peerConnections).forEach((pc) => pc.close());
    };

    // ************************************* //
    // ************************************* //
    stopTracks = (stream) => stream.getTracks().forEach((track) => track.stop());

    render() {
        const {
            status,
            messages,
            disconnected,
            localStream,
            peerConnections,
            remoteStreams,
            sendChannels,
        } = this.state;

        if (!this.socket) return <div>Loading...</div>;
        if (disconnected) return <div>You have successfully Disconnected</div>;

        return (
            <HomeView
                status={status}
                messages={messages}
                localStream={localStream}
                peerConnections={peerConnections}
                remoteStreams={remoteStreams}
                sendChannels={sendChannels}

                socket={this.socket}

                switchVideo={this.switchVideo}
                sendToPeer={this.sendToPeer}
                updateState={this.updateState}
            />
        )
    }
}

export default Home
