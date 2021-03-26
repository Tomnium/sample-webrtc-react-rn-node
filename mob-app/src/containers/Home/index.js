import React, {Component} from 'react';
import HomeView from '../../components/HomeView';
import {initSocket} from "../../socket";

class Home extends Component {
    handleJoin = async () => {
        const {roomId, setLoading, setSocket, setConnect} = this.props;
        setLoading(true);
        const socket = await initSocket(roomId);
        if (socket) {
            setSocket(socket);
            setConnect();
        }
        setLoading(false);
    };

    render() {
        const {setRoomId, roomId} = this.props;

        return (
            <HomeView
                roomId={roomId}
                setRoomId={setRoomId}
                handleJoin={this.handleJoin}
            />
        );
    }
}

export default Home;
