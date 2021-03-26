import React, {Component} from 'react';
import {Text, View} from "react-native";
import Video from '../../../common/Video';
import styles from './styles';

class MainVideo extends Component {
    render() {
        const {selectedVideo} = this.props;
        return (
            <View
                style={styles.mainVideoWrapper}>
                {
                    selectedVideo
                        ? (
                            <Video
                                mirror={true}
                                style={styles.video}
                                objectFit="cover"
                                streamURL={selectedVideo.stream}
                                type="remote"
                            />
                        )
                        : (
                            <View style={{padding: 15}}>
                                <Text style={styles.waitingText}>
                                    Waiting for Peer connection ...
                                </Text>
                            </View>
                        )
                }
            </View>
        )
    }
}

export default MainVideo;
