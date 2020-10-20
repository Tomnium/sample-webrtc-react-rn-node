import React, {Component} from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from "react-native";
import MainVideo from './parts/MainVideo';
import VideoControls from './parts/VideoControls';
import YourSelfVideo from './parts/YourSelfVideo';
import SteamsRow from './parts/SteamsRow';
import styles from './styles';

class StreamPageView extends Component {
    render() {
        const {
            localStream,
            remoteStreams,
            selectedVideo,
            switchVideo,
            socket,
            handleDisconnect,
            handleCamera,
            handleSound,
            setYourSelfVideoShown,
            camera,
            mic,
            isYourSelfVideoShown
        } = this.props;

        if (!socket) return <Text>Loading...</Text>;

        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar backgroundColor="teal" barStyle={'dark-content'}/>
                <VideoControls
                    camera={camera}
                    mic={mic}
                    handleDisconnect={handleDisconnect}
                    handleCamera={handleCamera}
                    handleSound={handleSound}
                />
                <View style={styles.videosContainer}>
                    {isYourSelfVideoShown &&
                    <YourSelfVideo
                        localStream={localStream}
                        camera={camera}
                        mic={mic}
                    />
                    }
                    <MainVideo
                        selectedVideo={selectedVideo}
                    />
                    <SteamsRow
                        camera={camera}
                        mic={mic}
                        switchVideo={switchVideo}
                        remoteStreams={remoteStreams}
                        localStream={localStream}
                        setYourSelfVideoShown={setYourSelfVideoShown}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default StreamPageView;
