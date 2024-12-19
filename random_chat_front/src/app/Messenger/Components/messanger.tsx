/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useRef, memo } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button, Avatar, Link } from "@nextui-org/react";
import { Socket } from "socket.io-client";
import { User_info } from '../Profile/[id]/page';

interface MessagesProps {
  socket: typeof Socket;
  roomId: string;
  user_guest: string;
  id: number;
  isRandomChat: boolean;  // New prop to control size

}

interface IMsgDataTypes {
  sender: string | number;
  receiver_id: number;
  content: string;
  roomId: string;
  date_created: Date;
}

interface friendship {
  friendship: boolean;
}
interface notification_friendship {
  message: string;
}
interface notification {
  message: string;
}
interface User_typing {
  user_guest: number;
  typing: boolean;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function verifyUserToken(token:string) {
  const response = await fetch(`${API_BASE_URL}auth/verify`, {
      method: 'POST', // Use the appropriate HTTP method
      headers: {
          'Content-Type': 'application/json', // Specify JSON content
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
      body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
      console.error('Token verification failed:', data.error);
  } else {
      console.log('Token verified successfully:', data);
  }
}
const DiscussionComponent: React.FC<MessagesProps> = memo((props) => {
  const token = localStorage.getItem('access_token');
  const { socket, roomId, user_guest, id, isRandomChat } = props;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMsgDataTypes[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [send_request, setSendRequest] = useState<string>("");
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [send_invite, setSendInvite] = useState<boolean>(false);
  const [guest_info, setGuestInfo] = useState<User_info | null>(null);
  const [user_typing, setUserTyping] = useState<User_typing | null>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
      if (!id || !token) return;
  
      fetch(`${API_BASE_URL}user/GetUserInfos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setGuestInfo(data);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }, [id, token]);
  useEffect(() => {
    
    socket.on('send_user_typing', (data: User_typing) => {
      console.log(data);
      setUserTyping(data);
    });
    return () => {
      socket.off('typing');
    };
  }, [socket]);
  const fetch_messages = async () =>  {
    verifyUserToken(localStorage.getItem('access_token') || '');
    
    const response = await fetch(`/api/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roomId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data;

  }

useEffect(() => {
    fetch_messages().then(data => {
      setMessages(data);
    });

}, []);
 
  useEffect(() => {
  const eventName = `send_message`;

  socket.on(eventName, (data: IMsgDataTypes) => {
    setMessages((prevMessages) => [...prevMessages, data]);
    socket.emit('typing',{user_guest:id,typing:false});
  });

  return () => {
    socket.off(eventName);
  };
}, [socket, roomId]);


  useEffect(() => {
    socket.on('notification',(data:notification) => {
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
      
      if (!token) return;
      fetch(`${API_BASE_URL}chats/getClients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setActive(data)
        })
        .catch(error => {
          console.log(error)
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);
  useEffect(() => {
    socket.on('notification_friendship', (data:notification_friendship) => {
      setSendRequest(data.message);
    });
    return () => {
      socket.off('receive_message');
    };
  },[socket]);
  

  const userEmail = localStorage.getItem('user_email');

  return (
    <Card style={{
      width: '600px',  // Larger for random chat
      position: 'relative',
      left: '-15px',
      height: '85vh',  // Adjust height
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      <CardHeader className="bg-slate-700 text-white flex items-center px-4 py-3 rounded-t-md shadow-md">
  {/* Avatar */}
  <Avatar
    isBordered
    color="secondary"
    size="sm"
    src={guest_info?.profile_picture_url}
    className="border-2 border-gray-500"
  />

  {/* User Info */}
  <div className="ml-4">
    <p className="text-lg font-semibold">{user_guest || "Guest User"}</p>
  </div>

  {/* Profile Link */}
  <Link
    href={`Messenger/Profile/${encodeURIComponent(id || "")}`}
    className="ml-4 flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md shadow hover:bg-gray-300 transition duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 mr-2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
    Go to Profile {guest_info?.name}
  </Link>

  {/* Add/Accept Friend Button */}
  <div className="ml-auto flex items-center">
    {!isAccepted && (
      send_request !== "accept" ? (
        <Button
          color="secondary"
          className={`mr-2 px-4 py-2 rounded-md text-white font-medium ${
            send_invite === true ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() => {
            setSendInvite(true);
            socket.emit("add_friend", id);
          }}
        >
          {send_invite === true ? "Request Sent" : "Add Friend"}
        </Button>
      ) : (
        <Button
          color="primary"
          className="mr-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
          onClick={() => {
            socket.emit("accept_friend", id);
          }}
        >
          Accept
        </Button>
      )
    )}
  </div>

  {/* Active Status Indicator */}
  <div
    className={`w-3 h-3 rounded-full ml-4 ${
      active ? "bg-lime-400" : "bg-gray-400"
    }`}
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
                    {new Date(msg.date_created).toLocaleString()}
                  </span>
                </div>
              </li>
            );
          })}
          <div ref={messagesEndRef} />
          {user_typing && user_typing.typing && user_typing.user_guest === id ? (
          <div className="ml-2 flex items-center space-x-1 text-sm text-gray-500">
          <span>{user_guest} is typing</span>
          <div className="flex space-x-1">
          <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
          <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
           <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
           </div>
          </div>
          ) : null}

        </ul>
      </CardBody>
      <CardFooter style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (message.trim() && isRandomChat) {
            socket.emit('send_message', { content: message, roomId,receiver_id:id, date_created: new Date() });
            setMessage("");
          }else{

            socket.emit("send_message_to_user",{message:message,receiver_id:id,roomId,date_created:new Date()});
            setMessage("");
          }
        }} style={{ display: 'flex', width: '100%' }}>
          <Input
            isClearable
            fullWidth
            color="primary"
            placeholder="Type a message"
            value={message}
            onChange={(e) => {
            setMessage(e.target.value)
            socket.emit('typing',{user_guest:id,typing:true});
            
            }}
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
});

DiscussionComponent.displayName = "DiscussionComponent";

export default DiscussionComponent;


