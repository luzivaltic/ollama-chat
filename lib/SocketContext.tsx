'use client'; // This is required for Client Components in Next.js 14

import React, { createContext, useEffect, useState } from 'react';
import socket from './socket';
import { Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};