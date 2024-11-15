// contexts/SocketContext.ts
'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

// Define the context type as Socket or null
type SocketContextType = typeof Socket | null;

// Create the context with the correct type
const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  useEffect(() => {
    // Ensure this code only runs in the browser
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    

    // Initialize the socket connection with token if available
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      query: { token }
    });
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (socket === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

