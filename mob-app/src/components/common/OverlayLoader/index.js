import React, {Component} from 'react'
import {View, Text} from 'react-native'
import styles from './styles'

export default class OverlayLoader extends Component {
    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }
}
