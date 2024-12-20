import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatsService } from "./chats.service";
import { UserService } from "src/user/user.service";
import { forwardRef, Inject } from "@nestjs/common";
import { MessageDto } from "src/user/dto/message.dto";
import { json } from "stream/consumers";
import { Message } from "src/user/entities/message.entity";

interface Message_int {
  content: string;
  roomId: string;
  date_created:Date;
  receiver_id: number;
}
interface Message_user {
  message: string;
  receiver_id: number;
  date_created:Date;
  roomId: string;

}
interface User_typing {
  user_guest: number;
  typing: boolean;
}
@WebSocketGateway(3001, { transports: ['websocket'] }) // Enable CORS for WebSocket
export class ChatGateway implements OnGatewayConnection , OnGatewayDisconnect {
  private map: Map<number, Socket>; 
  private waitingQueue: number[] ;
  public getClients(): number[] {
    return [... this.map.keys()];
  }
  constructor(private chatsService: ChatsService,
  @Inject(forwardRef(() => UserService))
  private userService :UserService) {
    this.map = new Map<number, Socket>();
    this.waitingQueue = [];
  }
  @WebSocketServer()
  server: Server;
  private removeFromQueue(user_id: number) {
    const index = this.waitingQueue.indexOf(user_id);
    if (index > -1) {
      this.waitingQueue.splice(index, 1);
    }
  }
  async handleConnection(socket: Socket) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      this.map.set(user.id, socket);
      }
    } catch (error) {
      console.error('Error handling connection:', error);
    }
  }
  async handleDisconnect(socket_client: Socket) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket_client);
      if (user != null) {
      this.map.delete(user.id);
      this.removeFromQueue(user.id);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  }
  @SubscribeMessage('typing')
  async userTyping(@ConnectedSocket() socket: Socket, @MessageBody() user_typing: User_typing) {
    console.log(user_typing);
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      const friendSocket = this.map.get(user_typing.user_guest);
      if (friendSocket != null) {
        this.server.to(friendSocket.id).emit('send_user_typing', {
          user_guest: user.id,
          typing: user_typing.typing
        });
      }
      }
    } catch (error) {
      console.error('Error processing typing:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while processing typing. Please try again later.'
      });
    }
  }
  @SubscribeMessage('send_user_typing')
  async receiveUserTyping(@ConnectedSocket() socket: Socket, message: any) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      const friendSocket = this.map.get(message.user_guest);
      if (friendSocket != null) {
        this.server.to(friendSocket.id).emit('send_user_typing', {
          user_guest: user.id,
          typing: message.typing
        });
      }
      }
    } catch (error) {
      console.error('Error receiving typing:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while receiving typing. Please try again later.'
      });
    }
  }
  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() message:Message_int ,@ConnectedSocket() socket: Socket) {
    try {
      const message_new :Message_int=message;
      socket.join(message_new.roomId);

      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      this.server.to(message_new.roomId).emit('send_message', {
        content: message_new.content,
        sender: user.email,
        roomId: message_new.roomId,
        receiver_id: message_new.receiver_id,
        date_created:message_new.date_created
      });
      const friend = await this.userService.findOne(message_new.receiver_id);
      
      let  message_dto = new MessageDto(message_new.content,message.date_created,message_new.roomId,user,friend);
      await this.userService.saveMessage(message_dto);    
      }
    } catch (error) {
      console.error('Error processing message:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while processing your message. Please try again later.'
      });
    }
  }
  
  
  @SubscribeMessage('notification')
  async getMessage(@ConnectedSocket() socket: Socket,message:any) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      
      if (user) {
      this.server.to(socket.id).emit('messages', message);
      }
    } catch (error) {
      console.error('Error getting message:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while retrieving the message. Please try again later.'
      });
    }
  }
 
  @SubscribeMessage('find_random_chat')
  async randomUserMessage(@ConnectedSocket() socket: Socket) {
    await this.initiateRandomConversation(socket);
  }
  @SubscribeMessage('send_message_to_user')
  async sendMessageToUser(@ConnectedSocket() socket: Socket, @MessageBody() message: Message_user) {
    const user = await this.chatsService.getUserFromSocket(socket);
    if(user!=null){
    const friend = await this.userService.findOne(message.receiver_id);
    if (friend != null) {
      const roomId = message.roomId;
      
      socket.join(roomId);
      const friendSocket = this.map.get(friend.id);
      if (friendSocket != null) {
        friendSocket.join(roomId);
        this.server.to(roomId).emit('send_message', {
          content: message.message,
          sender: user.email,
          roomId: roomId,
          receiver_id: friend.id,
          date_created:message.date_created
        });
      
      let  message_dto = new MessageDto(message.message,message.date_created,message.roomId,user,friend);
      await this.userService.saveMessage(message_dto);
        
        
      } else {
        this.server.to(socket.id).emit('notification', {
          message: 'The user you are trying to connect with is not online.'
        });
      }
    } else {
      this.server.to(socket.id).emit('notification', {
        message: 'The user you are trying to connect with does not exist.'
      });
    }
  }

  }
  @SubscribeMessage('accept_friend')
  async acceptFriend(@ConnectedSocket() socket: Socket, @MessageBody() friendId: number) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      const friend = await this.userService.findOne(friendId);
      if (friend != null) {
        await this.userService.acceptFriendship(user, friend);
        this.server.to(socket.id).emit('notification', {
        message: `You are now friends with ${friend.email}.`
        });
        const friendSocket = this.map.get(friendId);
        if (friendSocket != null) {
        this.server.to(friendSocket.id).emit('accepted_friend', {
        message: `You are now friends with ${user.email}.`
        });
        this.server.to(socket.id).emit('accepted_friend', {
          message: `You are now friends with ${user.email}.`
          });
        this.server.to(friendSocket.id).emit('notification', {
          message: `You are now friends with ${user.email}.`
          });
        }
      } else {
        this.server.to(socket.id).emit('notification', {
        message: 'The user you are trying to add as a friend does not exist.'
        });
      }
      }
    } catch (error) {
      console.error('Error accepting friend:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while trying to accept a friend. Please try again later.'
      });
    }
  }
  @SubscribeMessage('add_friend')
  async addFriend(@ConnectedSocket() socket: Socket, @MessageBody() friendId: number) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      const friend = await this.userService.findOne(friendId);
      if (friend != null) {
        await this.userService.createFriendship(user, friend);
        this.server.to(socket.id).emit('notification', {
        message: `Friend request sent to ${friend.email}.`
        });
        const friendSocket = this.map.get(friendId);
        if (friendSocket != null) {
        this.server.to(friendSocket.id).emit('notification_friendship',{message:'accept'});
        }
      } else {
        this.server.to(socket.id).emit('notification', {
        message: 'The user you are trying to add as a friend does not exist.'
        });
      }
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while trying to add a friend. Please try again later.'
      });
    }
  }
  @SubscribeMessage('notification_friendship')
  async receiveFriendshipNotification(@ConnectedSocket() socket: Socket,message:any) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
    
      this.server.to(socket.id).emit('notification_friendship', 
        message
      );
      console.log('accept')
      }
    } catch (error) {
      console.error('Error receiving friendship notification:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while trying to retrieve friend requests. Please try again later.'
      });
    }
  }
  @SubscribeMessage('accepted_friend')
  async receiveAcceptedFriend(@ConnectedSocket() socket: Socket,message:any) {
    try {
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
    
      this.server.to(socket.id).emit('accepted_friend', 
        message
      );
      }
    } catch (error) {
      console.error('Error receiving accepted friend:', error);
      this.server.to(socket.id).emit('notification', {
      message: 'An error occurred while trying to retrieve friend requests. Please try again later.'
      });
    }
  }
  @SubscribeMessage('check_friendship')
  async checkFriendship(@ConnectedSocket() socket: Socket, @MessageBody() friendId: number) {
  try {
    const user = await this.chatsService.getUserFromSocket(socket);
    if (user != null) {
    const friend = await this.userService.findOne(friendId);
    if (friend != null) {
      const friendship = await this.userService.checkFriendship(user, friend);
      this.server.to(socket.id).emit('check_friendship', {
      friendship: friendship
      });
    } else {
      this.server.to(socket.id).emit('notification', {
      message: 'The user you are trying to check friendship with does not exist.'
      });
    }
    }
 
  }
  catch (error) {
    console.error('Error checking friendship:', error);
    this.server.to(socket.id).emit('notification', {
    message: 'An error occurred while trying to check friendship. Please try again later.'
    });
  }
  
  }




  private async initiateRandomConversation(socket:Socket): Promise<void> {
    const user = await this.chatsService.getUserFromSocket(socket)
    console.log(user);
    if (user != null) {
      try {
      if (this.waitingQueue.length > 0 && this.waitingQueue[0] !== user.id) {
        const random_user_id = this.waitingQueue.shift();
        const random_socket = this.map.get(random_user_id);
        const random_user = await this.chatsService.getUserFromSocket(random_socket)
        if (random_socket != null) {
        const roomId = this.generateRoomId(user.id, random_user_id);
        this.userService.createRoom(roomId, user, random_user);

        socket.join(roomId);
        random_socket.join(roomId);
        this.server.to(random_socket.id).emit('find_random_chat', {
          message: 'You are now connected with a random user! ',
          user_id: user.email,
          id:user.id,
          roomId: roomId
        });
        this.server.to(socket.id).emit('find_random_chat', {
          message: 'You are now connected with a random user!',
          user_id: random_user.email,
          id:random_user.id,
          
          roomId: roomId
        });

        this.waitingQueue.pop();
        }
      } else {
        this.waitingQueue.push(user.id);
        this.waitingQueue = [...new Set(this.waitingQueue)];
        this.server.to(socket.id).emit('find_random_chat', {
        message: 'Waiting for a random user to join...'
        });
      }
      } catch (error) {
      console.error('Error initiating random conversation:', error);
      this.server.to(socket.id).emit('notification', {
        message: 'An error occurred while trying to find a random user. Please try again later.'
      });
      }
    }
   
  }
  private generateRoomId(user1Id: number, user2Id: number): string {
    return `room_${Math.min(user1Id, user2Id)}_${Math.max(user1Id, user2Id)}`;
  }
}


