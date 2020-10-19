import React, { Component } from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Video from '../../../common/Video';
import styles from './styles';

class StreamsRow extends Component {
    render() {
        const { remoteStreams, switchVideo } = this.props;
        return (
            <ScrollView
                horizontal={true}
                style={styles.scrollView}
            >
                {
                    remoteStreams.map((rStream, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => switchVideo(rStream)}>
                            <View
                                style={styles.videoWrapper}>
                                <Video
                                    mirror={true}
                                    style={styles.rtcViewRemote}
                                    objectFit="contain"
                                    streamURL={rStream.stream}
                                    type="remote"
                                />
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
        )
    }
}

export default StreamsRow;
