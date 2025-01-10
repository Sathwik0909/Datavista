import  { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
const AIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulated AI response
    setTimeout(() => {
      const aiMessage = { text: `AI response to: ${input}`, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 1000);
  };

  return (
    <div className="ai-chat">
      <div className="ai-chat-header">
        <h2>AI Assistant</h2>
        <button onClick={onClose} className="close-button">
          <FaTimes />
        </button>
      </div>
      <div className="ai-chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="ai-chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default AIChat;

