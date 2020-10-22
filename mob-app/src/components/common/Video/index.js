import React, {Component} from 'react';
import {View} from 'react-native';

import {RTCView} from 'react-native-webrtc';

class Video extends Component {

    render() {
        const {key, zOrder, objectFit, style, streamURL} = this.props;

        const _streamURL = streamURL && streamURL.toURL();

        return (
            <View>
                <RTCView
                    key={key}
                    zOrder={zOrder}
                    objectFit={objectFit}
                    style={{...style}}
                    streamURL={_streamURL}
                />
            </View>
        );
    }
}

export default Video;
