import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
@Entity("messages")
export class Message{
    @PrimaryGeneratedColumn()
    id: number;
    content: string;
    senderId: number;
    roomId: number;

}