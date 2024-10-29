import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatsService } from "./chats.service";
import { UserService } from "src/user/user.service";
import { forwardRef, Inject } from "@nestjs/common";
import { MessageDto } from "src/user/dto/message.dto";
type MessageD = {
  receiver_email:string;
  content:string

}
@WebSocketGateway(3001, { transports: ['websocket'] }) // Enable CORS for WebSocket
export class ChatGateway implements OnGatewayConnection , OnGatewayDisconnect {
  private map: Map<number, Socket>; 
  private waitingQueue: number[] ;
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
  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() message:string,@ConnectedSocket() socket: Socket) {
    try {
      const message_new = JSON.parse(message);
      const user = await this.chatsService.getUserFromSocket(socket);
      if (user != null) {
      this.server.to(message_new.roomId).emit('notification', {
        content: message_new.content,
        sender: user.id
      });
      const message_dto = new MessageDto(message_new.content, user.id, message_new.roomId);
      this.userService.saveMessage(message_dto);
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


  private async initiateRandomConversation(socket:Socket): Promise<void> {
    const user = await this.chatsService.getUserFromSocket(socket)
    if (user != null) {
      try {
      if (this.waitingQueue.length > 0) {
        const random_user_id = this.waitingQueue.shift();
        const random_socket = this.map.get(random_user_id);
        if (random_socket != null) {
        const roomId = this.generateRoomId(user.id, random_user_id);
        socket.join(roomId);
        random_socket.join(roomId);
        this.server.to(roomId).emit('notification', {
          message: 'You are now connected with a random user!',
          roomId: roomId
        });
        this.userService.createRoom(roomId, user.id, random_user_id);
        this.waitingQueue.pop();
        }
      } else {
        this.waitingQueue.push(user.id);
        this.server.to(socket.id).emit('notification', {
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


