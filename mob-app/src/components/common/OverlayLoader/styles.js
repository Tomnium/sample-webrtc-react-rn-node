import {Dimensions, StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
    container: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        top: 0,
        left: 0,
        backgroundColor: '#444',
        opacity: 0.6,
        zIndex: 999
    },
    text: {
        color: '#fff'
    }
})
