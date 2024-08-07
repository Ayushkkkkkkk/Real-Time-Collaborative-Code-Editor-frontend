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
  const [userId] = useState(() => socket.id);

  const handleClick = () => {
    if (message.trim()) {
      const data = { text: message, senderId: userId };
      socket.emit('chat-message', data);
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
    const handleIncomingMessage = (data: { text: string; senderId: string }) => {
      if (data.senderId !== userId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.text, type: 'receiver' }
        ]);
      }
    };

    socket.on('chat-message', handleIncomingMessage);

    return () => {
      socket.off('chat-message', handleIncomingMessage);
    };
  }, [socket, userId]);

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

