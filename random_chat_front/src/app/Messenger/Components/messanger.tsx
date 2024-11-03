'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button, Avatar } from "@nextui-org/react";
import { Socket } from "socket.io-client";

interface MessagesProps {
  socket: typeof Socket;
  roomId: string;
  user_guest:string;
}

interface IMsgDataTypes {
  sender: string | number;
  socket_id: string;
  content: string;
}

const Messages: React.FC<MessagesProps> = ({ socket, roomId,user_guest }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMsgDataTypes[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on('send_message', (data: IMsgDataTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off('send_message');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const userEmail = localStorage.getItem('user_email');

  return (
    <Card style={{ width: '100%', maxWidth: '600px', height: '450px' }} >
      <CardHeader className="flex gap-3">
        <Avatar
          isBordered
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <div className="flex flex-col">
          <p className="text-md">{user_guest || "Guest User"}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody style={{ flex: 1, padding: '10px', overflowY: 'auto', backgroundColor: '#e5ddd5' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, padding: 0 }}>
          {messages.map((msg, index) => {
            const isSender = msg.sender === userEmail;
            return (
              <li key={index} style={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  width: '60%',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: isSender ? '#dcf8c6' : '#fff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  position: 'relative',
                  wordWrap: 'break-word',
                }}>
                  <strong style={{ color: isSender ? '#34b7f1' : '#333', fontSize: '0.85em', marginBottom: '5px', display: 'block' }}>
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
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </li>
            );
          })}
          <div ref={messagesEndRef} />
        </ul>
      </CardBody>
      <CardFooter>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (message.trim()) {
            socket.emit('send_message', { content: message, roomId });
            setMessage("");
          }
        }} style={{ display: 'flex', width: '100%' }}>
          <Input
            isClearable
            fullWidth
            color="primary"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button color="primary" type="submit">
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Messages;

