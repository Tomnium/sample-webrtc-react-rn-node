import {StyleSheet} from "react-native";

export default styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        width: 100,
        height: 150,
        right: 0,
        zIndex: 99999999999999,
        top: 25,
        // backgroundColor: 'red'
    },
    rtcView: {
        width: 100, //dimensions.width,
        height: 150, //dimensions.height / 2,
        backgroundColor: 'black',
        borderRadius: 5,
    }
});
