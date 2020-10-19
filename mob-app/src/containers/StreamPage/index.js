import React, { Component } from 'react';
import {mediaDevices, RTCPeerConnection } from "react-native-webrtc";

import StreamPageView from '../../components/StreamPageView';
import { socketEvents } from "../../socket";

class StreamPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            localStream: null, // used to hold local stream object to avoid recreating the stream everytime a new offer comes
            remoteStream: null, // used to hold remote stream object that is displayed in the main screen

            remoteStreams: [], // holds all Video Streams (all remote streams)
            peerConnections: {}, // holds all Peer Connections
            selectedVideo: null,

            status: 'Please wait...',

            pc_config: {
                iceServers: [
                    {
                        url: 'stun:stun.l.google.com:19302',
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
            camera: true,
            mic: true,
            isYourSelfVideoShown: false
        };

        this.socket = props.socket;
        this.socketEvents = socketEvents.bind(this)
    }

    componentDidMount() {
        this.socketEvents();
    }

    getLocalStream = () => {
        const success = (stream) => {
            console.log('localStream... ', stream.toURL());
            this.setState({
                localStream: stream,
            });

            this.whoIsOnline();
        };

        const failure = (e) => {
            console.log('getUserMedia Error: ', e);
        };

        let isFront = true;
        mediaDevices.enumerateDevices().then((sourceInfos) => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (
                    sourceInfo.kind === 'videoinput' &&
                    sourceInfo.facing === (isFront ? 'front' : 'environment')
                ) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }

            const constraints = {
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 30,
                    },
                    facingMode: isFront ? 'user' : 'environment',
                    optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
                },
            };

            mediaDevices.getUserMedia(constraints).then(success).catch(failure);
        });
    };

    whoIsOnline = () => {
        // let all peers know I am joining
        this.sendToPeer('onlinePeers', null, {local: this.socket.id});
    };

    sendToPeer = (messageType, payload, socketID) => {
        this.socket.emit(messageType, {
            socketID,
            payload,
        });
    };

    createPeerConnection = (socketID, callback) => {
        try {
            let pc = new RTCPeerConnection(this.state.pc_config);

            // add pc to peerConnections object
            const peerConnections = {...this.state.peerConnections, [socketID]: pc};
            this.setState({
                peerConnections,
            });

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    this.sendToPeer('candidate', e.candidate, {
                        local: this.socket.id,
                        remote: socketID,
                    });
                }
            };

            pc.oniceconnectionstatechange = (e) => {
            };

            pc.onaddstream = (e) => {
                let remoteStreams = this.state.remoteStreams;
                let remoteVideo = {};

                // 1. check if stream already exists in remoteStreams

                remoteVideo = {
                    id: socketID,
                    name: socketID,
                    stream: e.stream,
                };
                remoteStreams = [...this.state.remoteStreams, remoteVideo];

                // 2. if it does exist then add track

                this.setState((prevState) => {
                    // If we already have a stream in display let it stay the same, otherwise use the latest stream
                    const remoteStream =
                        prevState.remoteStreams.length > 0 ? {} : {remoteStream: e.stream};

                    // get currently selected video
                    let selectedVideo = prevState.remoteStreams.filter(
                        (stream) => stream.id === prevState.selectedVideo.id,
                    );
                    // if the video is still in the list, then do nothing, otherwise set to new video stream
                    selectedVideo = selectedVideo.length
                        ? {}
                        : {selectedVideo: remoteVideo};

                    return {
                        ...selectedVideo,
                        ...remoteStream,
                        remoteStreams,
                    };
                });
            };

            pc.close = () => {
            };

            if (this.state.localStream) {
                pc.addStream(this.state.localStream);
            }
            // return pc
            callback(pc);
        } catch (e) {
            console.log('Something went wrong! pc not created!!', e);
            // return;
            callback(null);
        }
    };

    componentWillUnmount() {
        if (this.socket) this.socket.close();
        if (this.state.localStream) this.stopTracks(this.state.localStream);
        // stop all remote audio & video tracks
        if (this.state.remoteStreams)
            this.state.remoteStreams.forEach((rVideo) =>
                this.stopTracks(rVideo.stream),
            );
        // stop all remote peer connections
        if (this.state.remoteStreams)
            this.state.peerConnections &&
            Object.values(this.state.peerConnections).forEach((pc) => pc.close());
    }

    switchVideo = (_video) => this.setState({ selectedVideo: _video });

    stopTracks = (stream) => {
        stream.getTracks().forEach((track) => track.stop());
    };

    handleDisconnect = () => {
        const {
            localStream,
            remoteStreams,
            peerConnections,
        } = this.state;
        const { setConnect } = this.props;
        // disconnect socket
        this.socket.close();
        if (localStream) this.stopTracks(localStream);
        // stop all remote audio & video tracks
        remoteStreams.forEach((rVideo) => this.stopTracks(rVideo.stream));
        // stop all remote peer connections
        peerConnections &&
        Object.values(peerConnections).forEach((pc) => pc.close());
        this.setState({
            peerConnections: {},
            remoteStreams: [],
            localStream: null,
            remoteStream: null,
            selectedVideo: null,
        }, setConnect);
    };

    handleCamera = () => {
        const { localStream } = this.state;

        const videoTrack = localStream
            .getTracks()
            .find((track) => track.kind === 'video');

        if (!videoTrack) return;

        videoTrack.enabled = !videoTrack.enabled;
        this.setState({ camera: videoTrack.enabled });
    };

    handleSound = () => {
        const { localStream } = this.state;

        const audioTrack = localStream
            .getTracks()
            .find((track) => track.kind === 'audio');

        if (!audioTrack) return;

        audioTrack.enabled = !audioTrack.enabled;
        this.setState({ mic: audioTrack.enabled });
    };

    setYourSelfVideoShown = () => this.setState((prevState) => ({isYourSelfVideoShown: !prevState.isYourSelfVideoShown}));

    render() {
        const {
            localStream,
            remoteStreams,
            peerConnections,
            selectedVideo,
            camera,
            mic,
            isYourSelfVideoShown
        } = this.state;

        return (
            <StreamPageView
                camera={camera}
                mic={mic}
                localStream={localStream}
                isYourSelfVideoShown={isYourSelfVideoShown}
                remoteStreams={remoteStreams}
                peerConnections={peerConnections}
                selectedVideo={selectedVideo}
                socket={this.socket}
                switchVideo={this.switchVideo}
                handleDisconnect={this.handleDisconnect}
                handleCamera={this.handleCamera}
                handleSound={this.handleSound}
                sendToPeer={this.sendToPeer}
                setYourSelfVideoShown={this.setYourSelfVideoShown}
            />
        )
    }
}

StreamPage.defaultProps = {
    roomId: '',
};

export default StreamPage;
