'use client';

import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../lib/SocketContext';
import { Socket } from 'socket.io-client';

const ChatPage: React.FC = () => {
  const { socket, isConnected } = useContext(SocketContext) as { socket: Socket; isConnected: boolean };
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('newMessage', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('sendMessage', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage} disabled={!isConnected}>
        Send
      </button>
    </div>
  );
};

export default ChatPage;
  // prompt: "Translate 'sky' to vietnamese. With no furthur explaination",