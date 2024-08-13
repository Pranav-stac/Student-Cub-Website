import React, { useState } from 'react';
import './Forum.css';
import Sidebar from './Sidebar';
const Forum = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, timestamp: new Date() }]);
      setInput('');
    }
  };

  return (
    <div className="forum-container">
     
      <h1>Forum</h1>
      <div className="chatroom">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">{message.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Forum;