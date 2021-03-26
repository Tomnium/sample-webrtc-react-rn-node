import React, {Component} from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

class HomeView extends Component {
    focusedInput = () => {
        this.textInput.setNativeProps({
            style: { borderColor: '#09B0F0' }
        })
    }

    blurredInput = () => {
        this.textInput.setNativeProps({
            style: { borderColor: 'white' }
        })
    }
    render() {
        const {setRoomId, handleJoin, roomId} = this.props;

        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar backgroundColor="teal" barStyle={'dark-content'}/>
                <LinearGradient colors={['rgba(101,200,208,.63)', 'rgba(188,237,255,.63)']}
                                style={styles.container}>
                    <View style={styles.caption}><Text style={{fontSize: 30, fontFamily: "Barlow-SemiBold",}}>Video calling app</Text></View>
                    <View style={styles.buttonsContainer}>
                        <TextInput
                            maxLength={10}
                            ref={c => { this.textInput = c}}
                            onFocus={this.focusedInput}
                            onBlur={this.blurredInput}
                            placeholderTextColor="#7CB7CB"
                            placeholder="e.g. room1"
                            style={styles.input}
                            value={roomId}
                            onChangeText={setRoomId}
                        />
                        <TouchableOpacity
                            onPress={handleJoin}
                            style={styles.btn}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'FuturaNewDemi-Reg',
                                fontSize: 18
                            }}>Join Room</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

HomeView.defaultProps = {
    setRoomId: () => {
    },
    handleJoin: () => {
    },
    roomId: null,
};

export default HomeView;
