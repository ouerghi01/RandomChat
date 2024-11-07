'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Messages from './Components/messanger';
import { Navbar, NavbarBrand, NavbarContent, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import "./Components/message.css";

interface InitialsMessage {
  message: string;
  user_id: string;
  roomId: string;
  id: number;
}
interface friendWithRoom {
  id: number;
  roomId: string;
  name: string;
 
}

export default function MessageApp() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState<InitialsMessage | null>(null);
  const [user_email, setUser_email] = useState<string>('');
  
  const [isRandomChat, setIsRandomChat] = useState<boolean>(true);
  const [friend_ids, setFriend_ids] = useState<friendWithRoom[]>([]);
  const  [friends,setFriends] = useState<friendWithRoom[]>([]);
  async function fetchFriend(userId: number) {
    const response = await fetch('/api/friends/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFriend(Number(localStorage.getItem('user_id')) || 0).then(data => {
        setFriend_ids(data.friends);
      })
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize socket only if access token exists
    const token = localStorage.getItem('access_token');
    setUser_email(localStorage.getItem('user_email') || '');

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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Navbar isBordered>
        <NavbarContent justify="start" className='relative right-16'>
          <NavbarBrand className="mr-4">
            <p className="hidden sm:block font-bold text-inherit">Synco</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" style={{ position: 'relative', left: '350px' }} justify="end">
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user_email}</p>
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onClick={() => {
                localStorage.removeItem('access_token');
                window.location.href = "/Authentication/login";
              }}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* Layout: Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="flex flex-col w-1/4 bg-slate-400 p-4 rounded-lg shadow-md h-full">
          <h1 className="text-xl font-semibold text-white mb-4">Friends</h1>
          <ul className="space-y-2">
            {friend_ids.map((friendWithRoom, index) => (
              <li key={index}>
                <div className="flex items-center space-x-3">
                  <button
                    className="w-full text-left text-white hover:bg-slate-600 p-2 rounded-md transition-all duration-200 ease-in-out"
                    onClick={() => {
                      setIsRandomChat(false);
                      setFriends([...friends, friendWithRoom])
                    }}
                  >
                    {
                      friendWithRoom.name
                    }
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {
          !isRandomChat && friends.length > 0 
          ? friends.map((f:friendWithRoom,index:number) => {
            return (
              socket && (
                <div key={index}>
                  <Messages 
                  socket={socket}
                  roomId={f.roomId}
                  user_guest={f.name}
                  id={f.id}
                  isRandomChat={false} // New prop to control size
                />
                </div>
                
              )
            )
          })
          :null
            
        }
        {MessageModule(showChat,handleStartChat,greetingMessage,socket,isRandomChat)}

       
      </div>
    </div>
  );
}

function MessageModule(showChat: boolean, handleStartChat: () => void, greetingMessage: InitialsMessage | null, socket: SocketIOClient.Socket | null,isRandomChat:boolean) {
  return (
    <main className="h-full w-full flex justify-center items-center">
      {!showChat ? (
        <button
          className="bg-blue-100 px-4 py-2 rounded-lg text-center"
          onClick={handleStartChat}
        >
          Start talking with Random People
        </button>
      ) : (
        greetingMessage && greetingMessage.user_id && (
          socket && greetingMessage.roomId && (
            <div className="absolute">
              <Messages
                socket={socket}
                roomId={greetingMessage.roomId}
                user_guest={greetingMessage.user_id}
                id={greetingMessage.id}
                isRandomChat={isRandomChat} // New prop to control size
              />
            </div>
          )
        )
      )}
    </main>
  );
}


