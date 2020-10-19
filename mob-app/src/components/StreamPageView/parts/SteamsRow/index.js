import React, { Component } from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Video from '../../../common/Video';
import styles from './styles';

class StreamsRow extends Component {
    render() {
        const { remoteStreams, switchVideo, localStream, setYourSelfVideoShown, camera } = this.props;
        return (
            <ScrollView
                horizontal={true}
                style={styles.scrollView}
            >
                <TouchableOpacity
                    onPress={() => setYourSelfVideoShown()}
                    >
                    <View style={styles.videoWrapper}>
                        <View style={styles.placeHolder}>
                        {camera &&
                        <Video
                            style={styles.rtcViewLocal}
                            objectFit="cover"
                            streamURL={localStream}
                        />
                        }
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    remoteStreams.map((rStream, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => switchVideo(rStream)}>
                            <View
                                style={styles.videoWrapper}>
                                <Video
                                    style={styles.rtcViewRemote}
                                    objectFit="contain"
                                    streamURL={rStream.stream}
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
