'use client'
import React, { useState, useEffect } from 'react'


interface MessagesProps {
  socket: SocketIOClient.Socket;
  roomId: string
}
interface IMsgDataTypes {
    sender: string | number;
    socket_id:string ;
    content: string;
}
  

export default function Messages({ socket ,roomId}: MessagesProps) {
 
  const [message,setMessage] = useState("") ;
  const [messages,setMessages] = useState<IMsgDataTypes[]>([]) ;
  useEffect(() => {
    socket.on('send_message', (data: IMsgDataTypes) => {

        setMessages([...messages,data])
    });
  },[socket,messages]);
    
  return (
    <div>
        <ul>
            {messages.map((message,index) => {
                return (
                  <>
                <ul style={{
                  listStyleType: 'none',
                  padding: '0px',
                  margin: '0px'
                }}>

                <strong>User {message.sender}: </strong>
                <li key={index} style={{
                  marginLeft: '10px',
                  padding: '5px',
                  border: '1px solid black',
                  borderRadius: '5px',
                  color: message.socket_id === socket.id? 'blue' : 'black',
                  backgroundColor: message.socket_id === socket.id? 'lightblue' : 'white'  // Apply different colors for sender and receiver.
                }}>
                    
                    {message.content}
                </li>
                </ul>

                  
                  </>
               
                )
            })}
        </ul>
        <form onSubmit={(e)=>{
          e.preventDefault()
          socket.emit('send_message',{content:message, roomId:roomId})
          setMessage("")  // Reset the input field to empty after sending the message.
        }}>
        <input type='text' value={message} onChange={(e) => {
          setMessage(e.target.value)  
        }} />
        <button >Send</button>
        </form>
        
      
    </div>
  )
}
