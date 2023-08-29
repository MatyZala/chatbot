import { MessageInput, MessageList } from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react'
import { FaRobot, FaUser } from 'react-icons/fa';
const API_KEY = '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';
const systemMessage = {
    "role": "system", "content": "in this case you are a chatbot that manages shifts within a Spanish platform."
}

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            message: "Hola, soy tu asistente virtual! :)",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };
    async function processMessageToChatGPT(chatMessages) {

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setIsTyping(false);
            });
    }


    return (
        <div className="chat-container">
            <div className="chat-messages">
                <MessageList
                    typingIndicator={isTyping ? <span>Espere un momento...</span> : null}
                    className="message-list"
                >
                    {messages.map((message, i) => {
                        const role = message.sender === 'ChatGPT' ? 'assistant' : 'user';
                        const avatar = role === 'assistant' ? <FaRobot /> : <FaUser />;
                        return (
                            <div className={`message ${role}`} key={i}>
                                <div className="avatar">{avatar}</div>
                                <span className="content">{message.message}</span>
                            </div>
                        );
                    })}
                </MessageList>
            </div>
            <div className="chat-input">
                <MessageInput
                    placeholder="Type message here"
                    onSend={handleSend}
                    attachButton={false}
                    inputClass="message-input"
                />
            </div>
        </div>
    )
}

export default Chat