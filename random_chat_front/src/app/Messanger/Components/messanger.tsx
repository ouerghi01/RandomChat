'use client'
import React, { useState, useEffect } from 'react'


interface MessagesProps {
  socket: SocketIOClient.Socket;
}
interface IMsgDataTypes {
    roomId: string | number;
    
    message: string;
  }
  

export default function Messages({ socket }: MessagesProps) {
 
  const [message,setMessage] = useState("") ;
  const [messages,setMessages] = useState<IMsgDataTypes[]>([]) ;
  useEffect(() => {
    socket.on('notification', (data: IMsgDataTypes) => {

        setMessages([...messages,data])
    });
  },[socket,messages]);
    
  return (
    <div>
        <ul>
            {messages.map((message,index) => {
                return <li key={index}>{message.message}</li>
            })}
        </ul>
        <input type='text' value={message} onChange={(e) => {
            setMessage(e.target.value)
           }}/>
        <button >Send</button>

      
    </div>
  )
}
