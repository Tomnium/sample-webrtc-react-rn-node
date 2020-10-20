import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Video from '../../../common/Video';
import styles from './styles';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class StreamsRow extends Component {
    render() {
        const {remoteStreams, switchVideo, localStream, setYourSelfVideoShown, camera, mic} = this.props;
        return (
            <ScrollView
                horizontal={true}
                style={styles.scrollView}
            >
                <TouchableOpacity
                    onPress={() => setYourSelfVideoShown()}
                >
                    <View style={styles.videoWrapper}>
                        <View style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 15,
                            zIndex: 99999
                        }}>
                            <Icon name={mic ? `microphone` : `microphone-off`} size={15} color="white"/>
                        </View>
                        <View style={{
                            position: 'absolute',
                            left: 15,
                            bottom: 15,
                            zIndex: 99999
                        }}>
                            <Icon name={camera ? `camera` : `camera-off`} size={15} color="white"/>
                        </View>
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
