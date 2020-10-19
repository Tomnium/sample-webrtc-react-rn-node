import React, { Component } from 'react';

import Video from './parts/Video';
import Videos from './parts/Videos';
import Chat from './parts/Chat';
import Draggable from './parts/Draggable';

class HomeView extends Component {
    render() {
        const {
            status,
            messages,
            localStream,
            remoteStreams,
            sendToPeer,
            updateState,
            socket,
            switchVideo,
            sendChannels,
        } = this.props;

        return (
            <div>
                <Draggable>
                    <Video
                        videoType="localVideo"
                        videoStyles={{
                            // zIndex:2,
                            // position: 'absolute',
                            // right:0,
                            width: 200,
                            // height: 200,
                            // margin: 5,
                            // backgroundColor: 'black'
                        }}
                        frameStyle={{
                            width: 200,
                            margin: 5,
                            borderRadius: 5,
                            backgroundColor: "black",
                        }}
                        showMuteControls={true}
                        videoStream={localStream}
                        autoPlay
                        muted
                    />
                </Draggable>
                <br/>
                <div
                    style={{
                        zIndex: 3,
                        position: "absolute",
                        // margin: 10,
                        // backgroundColor: '#cdc4ff4f',
                        // padding: 10,
                        // borderRadius: 5,
                    }}
                >
                    <i
                        onClick={(e) => {
                            updateState({disconnected: true});
                        }}
                        style={{cursor: "pointer", paddingLeft: 15, color: "red"}}
                        className="material-icons"
                    >
                        highlight_off
                    </i>
                    <div
                        style={{
                            margin: 10,
                            backgroundColor: "#cdc4ff4f",
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >
                        <div style={{color: "yellow", padding: 5}}>{status}</div>
                    </div>
                </div>
                <div>
                    <Videos
                        switchVideo={switchVideo}
                        remoteStreams={remoteStreams}
                    />
                </div>
                <br/>

                <Chat
                    user={{
                        uid: (socket && socket.id) || "",
                    }}
                    messages={messages}
                    sendMessage={(message) => {
                        updateState((prevState) => {
                            return {messages: [...prevState.messages, message]};
                        });
                        sendChannels.map((sendChannel) => {
                            sendChannel.readyState === "open" &&
                            sendChannel.send(JSON.stringify(message));
                        });
                        sendToPeer("new-message", JSON.stringify(message), {
                            local: socket.id,
                        });
                    }}
                />
            </div>
        );
    }
}

export default HomeView;
