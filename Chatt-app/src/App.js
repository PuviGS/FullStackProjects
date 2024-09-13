import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // For styling

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // State for password
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen for new messages from the server
    socket.on('message', (data) => {
      console.log('Message received from server:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for the list of online users
    socket.on('onlineUsers', (users) => {
      console.log('Online users received from server:', users);
      setOnlineUsers(users);
    });

    // Cleanup
    return () => {
      socket.off('message');
      socket.off('onlineUsers');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const data = { username, message };
      console.log('Sending message:', data);
      socket.emit('message', data);
      setMessage('');
    }
  };

  const handleLogin = () => {
    if (username.trim() !== '' && password === 'PH@1314') {
      socket.emit('join', username);
      setIsLoggedIn(true);
    } else {
      alert('Invalid username or password.');
    }
  };

  return (
    <div className="chat-container">
      {!isLoggedIn ? (
        <div className="login-form">
          <h2>Enter your name and password to join the chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Join Chat</button>
        </div>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Group Chat</h3>
            <div>
              <h4>Online Users:</h4>
              <ul>
                {onlineUsers.map((user) => (
                  <li key={user.id}>{user.username}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="message">
                  <strong>{msg.username}:</strong> {msg.message}
                </div>
              ))
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
