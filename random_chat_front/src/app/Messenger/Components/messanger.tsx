/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect, useRef, memo } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button, Avatar, Link } from "@nextui-org/react";
import { Socket } from "socket.io-client";
import { User_info } from '../Profile/[id]/page';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
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
  sentiment_label?: string;
  sentiment_score?: number;
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
    fetch_messages().then(async (data:IMsgDataTypes[])  => {
      const  messages_analytics:IMsgDataTypes[] = [];
      for (const message of data) {
        if(message.content) {
          const sentiment = await analyzeSentiment(message.content) ;
          if (sentiment) {
            messages_analytics.push({
             ...message,
              sentiment_label: sentiment.sentiment_label,
              sentiment_score: sentiment.sentiment_score,
            });
          }
  
        }
      }
      setMessages(messages_analytics);
    });

}, []);
 
  useEffect(() => {
  const eventName = `send_message`;

  // Example usage in a socket listener
  socket.on(eventName, async (data: IMsgDataTypes) => {
  if (data.content) {
    const sentiment = await analyzeSentiment(data.content);
    if (sentiment) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...data,
          sentiment_label: sentiment.sentiment_label,
          sentiment_score: sentiment.sentiment_score,
        },
      ]);
    }
  }
  socket.emit('typing', { user_guest: id, typing: false });
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
      width: '550px',  // Larger for random chat
      position: 'relative',
      left: '-15px',
      height: '85vh',  // Adjust height
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      overflow: 'hidden'
        }}
        className='border border-slate-500 hover:border-slate-400'
        >
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
      <CardBody className="flex-1 p-4 overflow-y-auto bg-gray-100">
  <ul className="list-none p-0 m-0">
    {messages.map((msg, index) => {
      const isSender = msg.sender === userEmail;
      const sentimentClass = msg.sentiment_label ? getSentimentClass(msg.sentiment_label) : null;

      return (
        <li key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'} my-2`}>
          <div
            className={`max-w-3/4 p-3 rounded-xl shadow-md text-sm break-words ${
              isSender ? 'bg-green-100 text-black' : 'bg-white text-black'
            }`}
          >
            <span className="block mb-1 text-xs text-gray-500">{isSender ? 'You' : `User ${msg.sender}`}</span>
            <span>{msg.content}</span>
            {msg.sentiment_label && (
              <motion.span
                className={`block text-xs mt-2 text-right ${sentimentClass}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Sentiment: {msg.sentiment_label} ({msg.sentiment_score})
              </motion.span>
            )}
            <span className="block text-xs text-gray-500 mt-2 text-right">
              {new Date(msg.date_created).toLocaleString()}
            </span>
          </div>
        </li>
      );
    })}
    <div ref={messagesEndRef} />
    {user_typing && user_typing.typing && user_typing.user_guest === id && (
      <div className="ml-2 flex items-center space-x-1 text-sm text-gray-500">
        <span>{user_guest} is typing...</span>
        <div className="flex space-x-1">
          <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-0"></span>
          <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
          <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-400"></span>
        </div>
      </div>
    )}
  </ul>
</CardBody>

      <CardFooter style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (message.trim() && isRandomChat) {
            // send message to flask backend for sentiment analysis
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

function getSentimentClass(sentiment:string) {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'text-green-600'; // Green color for positive sentiment
    case 'negative':
      return 'text-red-600'; // Red color for negative sentiment
    case 'neutral':
      return 'text-gray-500'; // Gray color for neutral sentiment
    default:
      return 'text-gray-500'; // Default gray for unknown sentiment
  }
}

async function analyzeSentiment(message: string) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/analyze_sentiment/${encodeURIComponent(message)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return null;
  }
}

