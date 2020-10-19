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
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    rtcViewRemote: {
        width: 110, //dimensions.width,
        height: 110, //dimensions.height / 2,
        // backgroundColor: 'black',
        borderRadius: 5,
    },
});
