import React, {Component} from 'react';
import './styles.scss';

class HomeView extends Component {
    render() {
        const {setRoomId, roomId, handleJoin} = this.props;
        return (
            <div
                className='container'>
                <div className='caption'><h2>Video calling app</h2></div>
                <div className='buttonsContainer'>
                    <input
                        type='text'
                        placeholder="e.g. room1"
                        className='room-input'
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                    />
                    <button
                        onClick={handleJoin}
                        className='btn'>
                        Join Room
                    </button>
                </div>
            </div>
        );
    }
}

export default HomeView;
