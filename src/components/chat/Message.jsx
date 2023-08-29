import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';

function Message({ text, isBot }) {
    const avatar = isBot ? <FaRobot /> : <FaUser />;
    const messageClass = isBot ? 'bot-message' : 'user-message';

    return (
        <div className={`message ${messageClass}`}>
            <div className="avatar">{avatar}</div>
            <p>{text}</p>
        </div>
    );
}

export default Message;