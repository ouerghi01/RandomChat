'use client';
import React, { useEffect, useState } from 'react';
//import Logout from './Components/logout';
import io from 'socket.io-client';
import Messages from './Components/messanger';
import "./Components/message.css";
import {Navbar, NavbarBrand, NavbarContent,  DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar} from "@nextui-org/react";
interface InitialsMessage {
  message: string;
  user_id: string;
  roomId: string;
  id:number;
}

export default function MessageApp() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState<InitialsMessage | null>(null);
  const [user_email,setUser_email] = useState<string>('');
 
  
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
    <div className=" w-full h-3/4">
      <Navbar isBordered>
      <NavbarContent justify="start" className='relative right-16'>
        <NavbarBrand className="mr-4">
          <p className="hidden sm:block font-bold text-inherit">Synco</p>
        </NavbarBrand>

       
      </NavbarContent>

      <NavbarContent as="div" className="items-center " style={{
        position: 'relative',
        left: '350px',
      }} justify="end">
        
        <Dropdown >
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
            
            <DropdownItem key="logout" color="danger" 
            onClick={() => {
              localStorage.removeItem('access_token');
              window.location.href = "/Authentication/login";
            }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>

    {MessageModule(showChat, handleStartChat, greetingMessage, socket)}

    </div>
  );
}
function MessageModule(showChat: boolean, handleStartChat: () => void, greetingMessage: InitialsMessage | null, socket: SocketIOClient.Socket | null) {
  return <main className="h-screen flex justify-center items-center w-full">
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
          <div className="absolute" >
            <Messages 
              socket={socket}
              roomId={greetingMessage.roomId}
              user_guest={greetingMessage.user_id}
              id = {greetingMessage.id}
              isRandomChat={true}  // New prop to control size
            />
          </div>
        )
      )
    )}
  </main>;
}

