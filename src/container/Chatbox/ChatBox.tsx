import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import { Socket } from 'socket.io-client';

interface ChatBoxProps {
  onClose: () => void;
  socket: Socket;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose, socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; type: 'sender' | 'receiver' }[]>([]);

  const handleClick = () => {
    if (message.trim()) {
      socket.emit('chat-message', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, type: 'sender' }
      ]);
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  useEffect(() => {
    socket.on('chat-message', (msg: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, type: 'receiver' }
      ]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        Chat
        <button className="chatbox-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleChange}
        />
        <button type="button" onClick={handleClick}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

