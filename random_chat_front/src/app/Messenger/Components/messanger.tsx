'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button, Avatar } from "@nextui-org/react";
import { Socket } from "socket.io-client";

interface MessagesProps {
  socket: typeof Socket;
  roomId: string;
  user_guest: string;
  id: number;
  isRandomChat: boolean;  // New prop to control size

}

interface IMsgDataTypes {
  sender: string | number;
  socket_id: string;
  content: string;
}
interface IMsgDataTypes {
  message: string;
}
interface friendship {
  friendship: boolean;
}

const Messages: React.FC<MessagesProps> = ({ socket, roomId, user_guest, id ,isRandomChat}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMsgDataTypes[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [send_request, setSendRequest] = useState<string>("");
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  useEffect(() => {
    socket.on('send_message', (data: IMsgDataTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off('send_message');
    };
  }, [socket]);
  useEffect(() => {
    socket.on('notification',(data:IMsgDataTypes) => {
      alert(data.message);

    })
    
  }, [socket]);
  useEffect(()=> {
   socket.emit('check_friendship',id);
   socket.on('check_friendship', (data:friendship) => {
     
     if (data.friendship){
       setIsAccepted(true);
     }
     else {
       setIsAccepted(false);
     }
   })
  },[socket,id])
  useEffect(() => {
    socket.on('accepted_friend', (data:IMsgDataTypes) => {
      if (data !=null){
        setIsAccepted(true);
      }
      else {
        setIsAccepted(false);
      }
    
  })},[socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      fetch(`http://localhost:3006/chats/getClients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setActive(data)
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);
  useEffect(() => {
    socket.on('notification_friendship', (data:IMsgDataTypes) => {
      setSendRequest(data.message);
    });
    return () => {
      socket.off('receive_message');
    };
  },[socket]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const userEmail = localStorage.getItem('user_email');

  return (
    <Card style={{
      width: isRandomChat ? '1200px' : '500px',  // Larger for random chat
      maxWidth: isRandomChat ? '800px' : '500px',  // Conditional size
      height: isRandomChat ? '85vh' : '70vh',  // Adjust height
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      <CardHeader style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#075E54', color: 'white' }}>
        <Avatar
          isBordered
          color="secondary"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <div style={{ marginLeft: '10px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{user_guest || "Guest User"}</p>
        </div>
        <div>
            {
            !isAccepted && (
              send_request !== 'accept' ? 
              <Button color="primary" type="submit" style={{ marginLeft: '50px' }}
                onClick={() => {
                socket.emit('add_friend', id);
                }}>Add Friend</Button>
              : 
              <Button onClick={() => {
                socket.emit('accept_friend', id);
              }}>Accept</Button>
            )
            }
        </div>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: active ? 'limegreen' : 'gray',
            marginLeft: 'auto'
          }}
        ></div>
      </CardHeader>
      <Divider />
      <CardBody style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#e5ddd5' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {messages.map((msg, index) => {
            const isSender = msg.sender === userEmail;
            return (
              <li key={index} style={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', margin: '5px 0' }}>
                <div style={{
                  maxWidth: '75%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: isSender ? '#dcf8c6' : '#ffffff',
                  color: isSender ? '#000' : '#000',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  fontSize: '0.9rem',
                  wordBreak: 'break-word',
                }}>
                  <span style={{ display: 'block', marginBottom: '4px', fontSize: '0.8em', color: '#888' }}>
                    {isSender ? 'You' : `User ${msg.sender}`}
                  </span>
                  <span>{msg.content}</span>
                  <span style={{
                    display: 'block',
                    fontSize: '0.75em',
                    color: '#999',
                    marginTop: '5px',
                    textAlign: 'right'
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
      <CardFooter style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
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
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              marginRight: '10px'
            }}
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


