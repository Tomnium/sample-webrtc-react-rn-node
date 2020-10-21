import React, {Component} from 'react';

import Video from './parts/Video';
import Videos from './parts/Videos';
import Chat from './parts/Chat';
import Draggable from './parts/Draggable';
import './styles.scss';

class StreamPage extends Component {
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
            <div className='stream-wrapper'>
                <Draggable>
                    <Video
                        videoType="localVideo"
                        frameStyle='local-video-wrapper'
                        videoStyles='local-video'
                        showMuteControls={true}
                        videoStream={localStream}
                        autoPlay
                        muted
                    />
                </Draggable>
                <div>
                    <i
                        onClick={() => {updateState({disconnected: true});}}
                        className="material-icons disconnect-button"
                    >
                        highlight_off
                    </i>
                    <div className='info-wrapper'>
                        <div className='info-text'>{status}</div>
                    </div>
                </div>
                    <Videos
                        switchVideo={switchVideo}
                        remoteStreams={remoteStreams}
                    />
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

export default StreamPage;
