'use client';
import React, { useEffect, useState } from 'react';
import Logout from './Components/logout';
import io from 'socket.io-client';
import Messages from './Components/messanger';
import "./Components/message.css";

interface InitialsMessage {
  message: string;
  user_id: string;
  roomId: string;
}

export default function MessageApp() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState<InitialsMessage | null>(null);

  useEffect(() => {
    // Initialize socket only if access token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      const newSocket = io("http://localhost:3001", {
        transports: ["websocket"],
        query: { token }
      });
      setSocket(newSocket);

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    // Listen for incoming greeting message
    if (socket) {
      socket.on('find_random_chat', (data: InitialsMessage) => setGreetingMessage(data));
    }
    return () => {
      socket?.off('find_random_chat');
    };
  }, [socket]);

  const handleStartChat = () => {
    socket?.emit('find_random_chat');
    setShowChat(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav">
          <Logout />
        </nav>
      </header>

      <main className="main-content">
        {!showChat ? (
          <button className="start-button" onClick={handleStartChat}>
            Start talking with Random People
          </button>
        ) : (
          greetingMessage?.user_id && (
            <section className="greeting-section">
              <GreetingHeader greetingMessage={greetingMessage} />
              {socket && greetingMessage.roomId && (
                <Messages socket={socket} roomId={greetingMessage.roomId} />
              )}
            </section>
          )
        )}
      </main>
    </div>
  );
}

// Greeting Header Component
const GreetingHeader: React.FC<{ greetingMessage: InitialsMessage }> = ({ greetingMessage }) => (
  <div className="greeting-header" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '20px',
  }}>
    {/* Hidden Room ID */}
    <h1 className="room-id" style={{ display: 'none' }}>
      Room ID: {greetingMessage.roomId}
    </h1>

    {/* User ID Display */}
    <div className="user-id" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#d9534f',
      borderRadius: '50%',
      width: '70px',
      height: '70px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.2em',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s ease-in-out',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    title="User ID">
      {greetingMessage.user_id.substring(0, 5)}
    </div>
  </div>
);
