import { MessageInput, MessageList } from '@chatscope/chat-ui-kit-react';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaRobot, FaUser } from 'react-icons/fa';
import config from '../../../config'
const systemMessage = {
    "role": "system", "content": "in this case you are a chatbot that manages shifts within a Spanish platform."
}

const Chat = () => {
    const [turnosDisponibles, setTurnosDisponibles] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Hola, soy tu asistente virtual! :)",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);

    useEffect(() => {
        fetchTurnosDisponibles();
    }, []);


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
        const apiMessages = chatMessages.map((messageObject) => {
            const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
            return { role: role, content: messageObject.message };
        });

        const turnosDisponibles = await fetchTurnosDisponibles();
        console.log(turnosDisponibles);

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        };

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + config.REACT_APP_OPENAI_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            });

            const data = await response.json();
            console.log(data);

            let chatbotResponse = data.choices[0].message.content;

            if (turnosDisponibles.length > 0) {
                chatbotResponse += `\n\n¡Tenemos ${turnosDisponibles.length} turnos disponibles!`;
            } else {
                chatbotResponse += "\n\nLo siento, no hay turnos disponibles en este momento.";
            }

            setMessages([...chatMessages, {
                message: chatbotResponse,
                sender: "ChatGPT"
            }]);

            setIsTyping(false);
        } catch (error) {
            console.error("Error al procesar el mensaje con ChatGPT:", error);
        }
    }

    const fetchTurnosDisponibles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/turnos');
            setTurnosDisponibles(response.data);
        } catch (error) {
            console.error('Error al obtener los turnos:', error);
        }
    };



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