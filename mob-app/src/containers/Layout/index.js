import React, {Component} from 'react';
import Home from '../Home';
import StreamPage from '../StreamPage';
import OverlayLoader from '../../components/common/OverlayLoader';

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomId: '',
            connect: false,
            isLoading: false,
        };

        this.socket = null;
    }

    setConnect = (connect) => this.setState({connect});

    setRoomId = (roomId) => this.setState({roomId});

    setLoading = (isLoading) => this.setState({isLoading});

    setSocket = (socket) => this.socket = socket;

    renderPage = () => {
        const {connect, roomId} = this.state;

        if (connect) {
            return (
                <StreamPage
                    socket={this.socket}
                    roomId={roomId}
                    setConnect={() => this.setConnect(false)}
                />
            )
        }

        return (
            <Home
                roomId={roomId}
                setSocket={this.setSocket}
                setRoomId={this.setRoomId}
                setLoading={this.setLoading}
                setConnect={() => this.setConnect(true)}
            />
        );
    };

    render() {
        const {isLoading} = this.state;
        return (
            <>
                {isLoading && <OverlayLoader/>}
                {this.renderPage()}
            </>
        )
    }
}

export default Layout;
