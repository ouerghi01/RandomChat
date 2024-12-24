import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react';
import { Socket } from "socket.io-client";
import Image from 'next/image';

import React, { useEffect } from 'react'
interface GroupProps {
  socket: typeof Socket;
  groupId: number;
  name_group: string;
  description: string;
  logo_group: string;
  max_member_count: number;

}
interface MessagesProps {
    sender: string | number;
    content: string;
    groupId: string;
    date_created: Date;
  }
  
export default function ChatUI(props:GroupProps) {
    const { socket, groupId, name_group, description, logo_group, max_member_count } = props;
    const [messages_group, setMessages_group] = React.useState<MessagesProps[]>([]);
    const userEmail = localStorage.getItem("user_email");
    const [new_user_email, setNew_user_email] = React.useState("");
    const [message, setMessage] = React.useState("");
  
    useEffect(() => {
      socket.on("group_message", (data:MessagesProps) => {
        setMessages_group((prev) => [...prev, data]);
      });
  
      return () => {
        socket.off("group_message");
      }; // Clean up the listener
    }, [socket]);
  
    const handleInvite = () => {
      if (new_user_email.trim()) {
        socket.emit("join_group", { groupId, userEmail: new_user_email });
        setNew_user_email("");
      }
    };
  
    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        socket.emit("send_message", {
          content: message,
          groupId,
          date_created: new Date(),
          sender: localStorage.getItem("user_id"),
        });
        setMessage("");
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100 py-4 px-2">
        <Card className="w-full max-w-3xl shadow-lg rounded-lg bg-white">
          <CardHeader className="flex items-center px-4 py-3 border-b">
            <Image src={logo_group} alt="Group Logo" width={50} height={50} className="rounded-full" />
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-800">{name_group}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-4 py-2 overflow-y-auto" style={{ maxHeight: "400px" }}>
            <ul className="list-none p-0 m-0">
              {messages_group.map((msg, index) => {
                const isSender = msg.sender === userEmail;
                return (
                  <li
                    key={index}
                    className={`flex ${isSender ? "justify-end" : "justify-start"} my-2`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-xl shadow-sm text-sm break-words ${
                        isSender
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span className="block mb-1 text-xs text-gray-500">
                        {isSender ? "You" : `User: ${msg.sender}`}
                      </span>
                      <span>{msg.content}</span>
                      <span className="block text-xs text-gray-400 mt-2 text-right">
                        {new Date(msg.date_created).toLocaleString()}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
          <Divider />
          <CardFooter className="px-4 py-2 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <Input
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="bg-gray-100 rounded-full px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                variant="shadow"
                color="primary"
                className="ml-3"
              >
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
  
        <div className="w-full max-w-3xl mt-4">
          <Card className="shadow-md rounded-lg bg-white px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Invite User</h4>
            <div className="flex items-center">
              <Input
                fullWidth
                type="email"
                placeholder="Enter user's email"
                value={new_user_email}
                onChange={(e) => setNew_user_email(e.target.value)}
                className="bg-gray-100 rounded-full px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="shadow"
                color="primary"
                onClick={handleInvite}
                className="ml-3"
              >
                Invite
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Max members: {max_member_count}
            </p>
          </Card>
        </div>
      </div>
    );
  }
  