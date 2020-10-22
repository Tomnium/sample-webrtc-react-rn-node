import React, {useState, useEffect} from 'react'

import './styles.scss'

const Chat = props => {
    const [message, setMessage] = useState('');
    const [user, setUser] = useState({uid: 0,});

    const scrollToBottom = () => {
        const chat = document.getElementById("chatList");
        chat.scrollTop = chat.scrollHeight
    };

    useEffect(() => {
        scrollToBottom();
        setUser({uid: props.user.uid,})
    }, [props]);

    const sendMessage = (msg) => {
        props.sendMessage(msg);
        scrollToBottom()
    };

    const handleSubmit = event => {
        if (message === '') return;
        event.preventDefault();
        sendMessage({
            type: 'text',
            message: {
                id: user.uid,
                sender: {uid: user.uid,},
                data: {text: message}
            }
        });
        setMessage('')
    };

    const handleChange = event => {
        setMessage(event.target.value)
    };

    const renderMessage = (userType, data) => {
        const message = data.message;

        const msgDiv = data.type === 'text'
            ? (
                <div className="msg">
                    <p>{message.sender.uid}</p>
                    <div className="message"> {message.data.text}</div>
                </div>
            )
            : (
                <div className="msg">
                    <p>{message.sender.uid}</p>
                </div>
            );

        return (<li className={userType}>{msgDiv}</li>)
    };

    return (
        <div>
            <div className="chatWindow">
                <ul className="chat" id="chatList">
                    {props.messages.map(data => (
                        <div key={data.id}>
                            {
                                user.uid === data.message.sender.uid
                                    ? renderMessage('self', data)
                                    : (renderMessage('other', data))
                            }
                        </div>
                    ))}
                </ul>
                <form onSubmit={handleSubmit}>
                    <input
                        className="textarea input"
                        type="text"
                        placeholder="Enter your message..."
                        onChange={handleChange}
                        value={message}
                    />
                </form>
            </div>
        </div>
    )
};

export default Chat
