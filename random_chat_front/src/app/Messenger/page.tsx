'use client';
import React, { memo, useEffect, useState } from 'react';
import DiscussionComponent from './Components/messanger';
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import "./Components/message.css";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFriend } from '@/lib/features/Messagiere/mesgSlice';
import { useSocket } from '../contexts/SocketContext';
import Loading from './Loading_cus';

interface InitialsMessage {
  message: string;
  user_id: string;
  roomId: string;
  id: number;
}
export interface friendWithRoom {
  id: number;
  name: string;
  roomId: string;
 
}

 async function verifyUserToken(token:string) {
  const response = await fetch('http://localhost:3006/auth/verify', {
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
      return 
  } else {
      console.log('Token verified successfully:', data);
      
  }
}
function Message() {
  const socket = useSocket();
  /**
   * Retrieves the 'access_token' from the local storage.
   *
   * @constant {string | null} token - The access token stored in the local storage, or null if it doesn't exist.
   */
  const token = Cookies.get('access_token');;

  const [showChat, setShowChat] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState<InitialsMessage | null>(null);
  const user_email = Cookies.get('user_email')
  const dispatch = useAppDispatch()
  const [isRandomChat, setIsRandomChat] = useState<boolean>(true);
  const [friend_ids, setFriend_ids] = useState<friendWithRoom[]>([]);
  const friend = useAppSelector((state) => state.friends.friend);

 
  async function fetchFriend(userId: number) {
    verifyUserToken(token || '');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Navbar isBordered className="px-6">
  {/* Left Section: Brand Name */}
  <NavbarContent justify="start">
    <NavbarBrand className="mr-4">
      <p className="hidden sm:block font-bold text-inherit">Synco</p>
    </NavbarBrand>
  </NavbarContent>

  {/* Center Section: Start Chat Button */}
  <NavbarContent justify="center">
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out"
      onClick={handleStartChat}
    >
      Start talking with Random People
    </button>
  </NavbarContent>

  {/* Right Section: Profile Dropdown */}
  <NavbarContent justify="end" className="flex items-center">
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
        <DropdownItem
          key="logout"
          color="danger"
          onClick={async () => {
            localStorage.removeItem('access_token');
            localStorage.clear();
            
            
            sessionStorage.clear(); // Clear all keys in sessionStorage
            window.location.href = "/Authentication/login";
          }}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </NavbarContent>
</Navbar>


<div className="flex flex-1 h-screen overflow-hidden">
  {/* Left Sidebar */}
  <div className="flex flex-col w-1/4 bg-slate-700 p-4 rounded-tr-lg rounded-br-lg shadow-lg">
    <h1 className="text-2xl font-semibold text-white mb-6">Friends</h1>
    <ul className="space-y-3">
      {friend_ids.length > 0 &&
        friend_ids.map((friendWithRoom) =>
          friendWithRoom ? (
            <li key={friendWithRoom.id}>
              <button
                className="flex items-center w-full text-left text-white p-3 rounded-lg hover:bg-slate-600 transition duration-150 ease-in-out"
                onClick={() => {
                  setIsRandomChat(false);
                  dispatch(setFriend(friendWithRoom));
                }}
              >
                <Avatar
                  isBordered
                  className="transition-transform"
                  color="secondary"
                  name={friendWithRoom.name}
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
                <span className="ml-3 font-medium ">{friendWithRoom.name}</span>
              </button>
            </li>
          ) : null
        )}
    </ul>
  </div>
        {MessageModule(showChat,friend,greetingMessage,socket,isRandomChat)}

       
      </div>
    </div>
  );
}

function MessageModule(showChat: boolean, friend: friendWithRoom | null, greetingMessage: InitialsMessage | null, socket: SocketIOClient.Socket | null, isRandomChat: boolean) {
  return (
    <main className="h-full w-full flex justify-center items-center">
      {!showChat ? (
        <div className="flex gap-5 items-center justify-center relative top-10 left-5">
          {!isRandomChat && friend && friend.roomId && friend.id && socket ? (
            <div className="relative">
              <DiscussionComponent
                key={friend.id} // Add this key
                socket={socket}
                roomId={friend.roomId}
                user_guest={friend.name}
                isRandomChat={isRandomChat}
                id={friend.id}
              />
            </div>
          ): <Loading/>
        }
        </div>
      ) : (
        /* Render greeting message chat if showChat is true and greeting message exists */
        greetingMessage && greetingMessage.user_id && socket && greetingMessage.roomId && (
          <div className="relative">
            <DiscussionComponent
              socket={socket}
              roomId={greetingMessage.roomId}
              user_guest={greetingMessage.user_id}
              id={greetingMessage.id}
              isRandomChat={isRandomChat}
            />
          </div>
        )
      )}
    </main>
  );
}



const MessageApp = memo(Message);
export default MessageApp;
