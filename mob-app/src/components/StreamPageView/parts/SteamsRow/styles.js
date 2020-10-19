import {StyleSheet} from "react-native";

export default styles = StyleSheet.create({
    scrollView: {
        position: 'absolute',
        zIndex: 0,
        bottom: 10,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    videoWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    placeHolder: {
        width: 105,
        height: 82,
        backgroundColor: 'gray'
    },
    rtcViewLocal: {
        width: 105,
        height: 82,
    },
    rtcViewRemote: {
        width: 110,
        height: 110,
    },
});
