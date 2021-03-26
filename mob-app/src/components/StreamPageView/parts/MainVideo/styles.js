import {Dimensions, StyleSheet} from 'react-native';

const dimensions = Dimensions.get('window');


export default styles = StyleSheet.create({
    mainVideoWrapper: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: dimensions.width,
        height: dimensions.height / 2
    },
    waitingText: {
        fontSize: 22,
        textAlign: 'center',
        color: 'white'
    }
});
