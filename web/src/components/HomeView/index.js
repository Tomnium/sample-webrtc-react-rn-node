import React, { Component } from 'react';
import styles from './styles';

class HomeView extends Component {
    render() {
        const { setRoomId, roomId, handleJoin } = this.props;
        return (
            <div
                style={styles.container}>
                <div style={styles.caption}><p style={{fontSize: 24}}>Video calling app</p></div>
                <div>
                    <input
                        type='text'
                        placeholder="e.g. room1"
                        style={styles.input}
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                    />
                    <button
                        onClick={handleJoin}
                        style={styles.btn}>
                        Join Room
                    </button>
                </div>
            </div>
        );
    }
}

export default HomeView;
