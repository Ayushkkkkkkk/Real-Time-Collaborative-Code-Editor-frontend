import React from 'react';
import './ChatBox.css';

const ChatBox = () => {
  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Chat</h2>
      </div>
      <div className="chatbox-messages">
        {/* Example messages */}
        <div className="message received">Hello! How can I help you today?</div>
        <div className="message sent">Hi! I have a question about my order.</div>
      </div>
      <div className="chatbox-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

