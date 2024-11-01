'use client';
import React, { useEffect, useState } from 'react';
import Logout from './Components/logout';
import io from 'socket.io-client';
import Messages from './Components/messanger';
import "./Components/message.css"

interface Initials_Message {
  message: string;
  user_id: string;
  roomId: string;
}

export default function MessageApp() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [show, setShow] = useState(false);
  const [greetingMessage, SetgreetingMessage] = useState<Initials_Message | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const newSocket = io("http://localhost:3001", {
        transports: ["websocket"],
        query: { token: token }
      });
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    socket?.on('find_random_chat', (data: Initials_Message) => SetgreetingMessage(data));
    return () => {
      socket?.off('find_random_chat');
    };
  }, [socket]);

  const handleStartChat = () => {
    socket?.emit('find_random_chat');
    setShow(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav">
          <Logout />
        </nav>
      </header>

      <main className="main-content">
        {!show && (
          <button className="start-button" onClick={handleStartChat}>
            Start talking with Random People
          </button>
        )}

        {greetingMessage && (
          <section className="greeting-section">
            <div className="greeting-header">
              <h1 className="room-id">Room ID: {greetingMessage.roomId}</h1>
              <h2 className="user-id">User: {greetingMessage.user_id}</h2>
            </div>
            <div className="greeting-content">
              <p>{greetingMessage.message}</p>
            </div>
          </section>
        )}

        {greetingMessage?.roomId && socket && (
          <Messages socket={socket} roomId={greetingMessage.roomId} />
        )}
      </main>
    </div>
  );
}
