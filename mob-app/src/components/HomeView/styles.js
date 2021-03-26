import {StyleSheet} from "react-native";

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'white',
},
    caption: {
        fontFamily: "Barlow-SemiBold",
        padding: 15,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    input: {
        width: 200,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginRight: 20,
        fontFamily: 'FuturaNewDemi-Reg',
        fontSize: 24,
        borderRadius: 30,
        opacity: 0.8,
        color: '#1f2845',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 3
    },
    btn: {
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: '#09B0F0'
    }
});
