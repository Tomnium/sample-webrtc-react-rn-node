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
            camera,
            mic,
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
                    <YourSelfVideo
                        localStream={localStream}
                        camera={camera}
                        mic={mic}
                    />
                    <MainVideo
                        selectedVideo={selectedVideo}
                    />
                    <SteamsRow
                        switchVideo={switchVideo}
                        remoteStreams={remoteStreams}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default StreamPageView;
