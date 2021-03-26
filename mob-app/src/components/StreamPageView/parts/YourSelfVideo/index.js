import React, {Component} from 'react';
import {TouchableOpacity, View} from "react-native";
import Video from '../../../common/Video';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class YourSelfVideo extends Component {
    render() {
        const {localStream, camera, mic} = this.props;
        return (
            <View style={styles.wrapper}>
                <View style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    zIndex: 99999
                }}>
                    <Icon name={mic ? `microphone` : `microphone-off`} size={20} color={mic ? "white" : 'red'}/>
                </View>
                <View style={{
                    position: 'absolute',
                    left: 20,
                    bottom: 0,
                    zIndex: 99999
                }}>
                    <Icon name={camera ? `camera` : `camera-off`} size={20} color={camera ? "white" : 'red'}/>
                </View>
                <View style={styles.placeHolder}>
                    {camera &&
                    <TouchableOpacity onPress={() => localStream._tracks[1]._switchCamera()}>
                        <Video
                            objectFit="cover"
                            style={styles.rtcView}
                            streamURL={localStream}
                            type="local"
                        />
                    </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

export default YourSelfVideo;
