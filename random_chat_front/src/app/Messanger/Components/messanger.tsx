'use client'
import React, { useState, useEffect, useRef } from 'react';

interface MessagesProps {
  socket: SocketIOClient.Socket;
  roomId: string;
}
interface IMsgDataTypes {
  sender: string | number;
  socket_id: string;
  content: string;
}

export default function Messages({ socket, roomId }: MessagesProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMsgDataTypes[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scrolling

  useEffect(() => {
    socket.on('send_message', (data: IMsgDataTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off('send_message'); // Clean up listener on component unmount
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll to the latest message
  }, [messages]);

  const userEmail = localStorage.getItem('user_email');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height:'450px',
      backgroundColor: '#e5ddd5',
    }}>
      <ul style={{
        flex: 1,
        padding: '10px',
        margin: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {messages.map((msg, index) => {
          const isSender = msg.sender === userEmail;
          return (
            <li key={index} style={{
              display: 'flex',
              justifyContent: isSender ? 'flex-end' : 'flex-start',
              padding: '5px 10px',
              
            }}>
              <div style={{
                width: '40%',
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: isSender ? '#dcf8c6' : '#fff',
                color: '#333',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
                wordWrap: 'break-word',
              }}>
                <strong style={{
                  color: isSender ? '#34b7f1' : '#333',
                  fontSize: '0.85em',
                  marginBottom: '5px',
                  display: 'block',
                }}>
                  {isSender ? 'You' : `User ${msg.sender}`}
                </strong>
                <span>{msg.content}</span>
                <span style={{
                  fontSize: '0.75em',
                  color: '#888',
                  position: 'absolute',
                  bottom: '-15px',
                  right: '10px',
                }}>
                  {/* Placeholder for timestamp; integrate real timestamps as needed */}
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </li>
          );
        })}
        <div ref={messagesEndRef} /> {/* Auto-scroll target */}
      </ul>

      <footer style={{
        padding: '10px',
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
      }}>
        <form style={{ flex: 1, display: 'flex' }} onSubmit={(e) => {
          e.preventDefault();
          if (message.trim()) {
            socket.emit('send_message', { content: message, roomId });
            setMessage(""); // Clear input after sending
          }
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              outline: 'none',
              marginRight: '10px',
              fontSize: '1em',
            }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            backgroundColor: '#34b7f1',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '1em',
          }}>
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
