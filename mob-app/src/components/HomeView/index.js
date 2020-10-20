import React, {Component} from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import styles from './styles';

class HomeView extends Component {
    render() {
        const {setRoomId, handleJoin, roomId} = this.props;

        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar backgroundColor="teal" barStyle={'dark-content'}/>
                <View
                    style={styles.container}>
                    <View style={styles.caption}><Text style={{fontSize: 24}}>Video calling app</Text></View>
                    <View style={styles.buttonsContainer}>
                        <TextInput
                            maxLength={10}
                            slectionColor={'green'}
                            placeholderTextColor="lightgrey"
                            placeholder="e.g. room1"
                            style={styles.input}
                            value={roomId}
                            onChangeText={setRoomId}
                        />
                        <TouchableOpacity
                            onPress={handleJoin}
                            style={styles.btn}>
                            <Text style={{color: 'white'}}>Join Room</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
