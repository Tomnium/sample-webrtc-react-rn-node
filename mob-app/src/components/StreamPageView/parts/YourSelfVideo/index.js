import React, { Component } from 'react';
import { TouchableOpacity, View } from "react-native";
import Video from '../../../common/Video';
import styles from './styles';

class YourSelfVideo extends Component {
    render() {
        const { localStream } = this.props;
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => localStream._tracks[1]._switchCamera()}>
                    <Video
                        objectFit="cover"
                        style={styles.rtcView}
                        streamURL={localStream}
                        type="local"
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export default YourSelfVideo;
