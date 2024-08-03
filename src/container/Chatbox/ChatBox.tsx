import React from 'react';
import './ChatBox.css'; // Assuming CSS is in the same folder

interface ChatBoxProps {
  onClose: () => void;  // Type the onClose function prop correctly
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        Chat
        <button className="chatbox-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chatbox-messages">
        {/* Render messages here */}
      </div>
      <div className="chatbox-input">
        <input type="text" placeholder="Type a message" />
        <button>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;

