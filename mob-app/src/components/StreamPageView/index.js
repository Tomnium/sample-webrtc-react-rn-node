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
import LinearGradient from "react-native-linear-gradient";

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
                <LinearGradient colors={['rgba(101,200,208,.63)', 'rgba(188,237,255,.63)']} style={{flex: 1}}>
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
                </LinearGradient>
            </SafeAreaView>

        );
    }
}

export default StreamPageView;
