import React, {Component} from 'react';
import {Button, View} from "react-native";

import styles from './styles';

class VideoControls extends Component {
    render() {
        const {
            handleCamera,
            handleSound,
            handleDisconnect,
            mic,
            camera,
        } = this.props;

        return (
            <View style={styles.controlWrapper}>
                <Button
                    onPress={handleCamera}
                    title={`camera ${camera ? '(on)' : '(off)'}`}
                    color={`${camera ? 'black' : 'red'}`}
                />
                <Button
                    onPress={handleSound}
                    title={`mic ${mic ? '(on)' : '(off)'}`}
                    color={`${mic ? 'black' : 'red'}`}
                />
                <Button
                    onPress={handleDisconnect}
                    title="X DISCONNECT"
                    color="red"
                />
            </View>
        )
    }
}

export default VideoControls;
