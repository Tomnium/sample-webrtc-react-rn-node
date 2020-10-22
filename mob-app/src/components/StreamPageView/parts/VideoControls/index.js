import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from "react-native";

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
                <TouchableOpacity
                    onPress={handleCamera}
                    style={[styles.controlButton, {backgroundColor: `${camera ? '#09B0F0' : 'red'}`}]}>
                    <Text style={styles.controlText}>{`camera ${camera ? '(on)' : '(off)'}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSound}
                    style={[styles.controlButton, {backgroundColor: `${mic ? '#09B0F0' : 'red'}`}]}>
                    <Text style={styles.controlText}>{`mic ${mic ? '(on)' : '(off)'}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleDisconnect}
                    style={styles.disconnectButton}>
                    <Text style={styles.controlText}>X Disconnect</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default VideoControls;
