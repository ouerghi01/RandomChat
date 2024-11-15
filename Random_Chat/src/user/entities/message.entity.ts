import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';
@Entity("messages")
export class Message{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'text' })
    content: string;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date_created: Date;
    @ManyToOne(() => User, (user) => user.messages_receiver, { nullable: true })
    @JoinColumn({ name: "receiver_id" })
    receiver: User | null;
    @ManyToOne(() => User, (user) => user.messages_sender, { nullable: true })
    @JoinColumn({ name: "sender_id" })
    sender: User | null;

    
    @ManyToOne(() => Room, (room) => room.messages, { nullable: true })
    @JoinColumn({ name: "room_id" })
    room: Room | null;

    

}