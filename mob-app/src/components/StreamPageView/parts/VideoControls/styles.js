import {StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
    controlWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        margin: 15,
    },

    controlButton: {
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderRadius: 30,
    },

    controlText: {
        fontFamily: 'FuturaNewDemi-Reg',
        fontSize: 18
    },

    disconnectButton: {
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: 'red',
    }
})
