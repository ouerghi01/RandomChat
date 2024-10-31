'use client'
import React, { useEffect, useState } from 'react';
import Logout from './Components/logout';
import io from 'socket.io-client';
import Messages from './Components/messanger';
export default function MessageApp() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Initialize the socket only on the client side
    const token = localStorage.getItem('access_token');

    if (token) {
      const newSocket = io("http://localhost:3001", {
        transports: ["websocket"], // Ensures WebSocket transport
        query: {
          token: token
        }
      });

      setSocket(newSocket);

      // Clean up the socket connection on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  const handleStartChat = () => {
    if (socket) {
      socket.emit('find_random_chat', () => {
        console.log("Started random chat");
      });
      setShow(true);
    }
  };

  return (
    <div className="container">
      <header>
        <nav>
          <Logout />
        </nav>
      </header>

      <main className="main-content">
        {!show ? (
          <button className="start-button" onClick={handleStartChat}>
            Start talking with Random People
          </button>) : (socket && <Messages socket={socket} />)
        }
      </main>

      {/* Inline styles in JSX */}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: Arial, sans-serif;
        }

        header {
          width: 100%;
          padding: 10px 20px;
          background-color: #f5f5f5;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: flex-end;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          padding: 20px;
          width: 100%;
          height: 100%;
          text-align: center;
        }

        .start-button {
          background-color: #4285f4;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .start-button:hover {
          background-color: #357ae8;
          transform: scale(1.05);
        }

        .start-button:active {
          background-color: #2a65c8;
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

