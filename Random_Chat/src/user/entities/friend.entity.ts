import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('friendship')
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentFriendRequests)
    @JoinColumn({ name: "sender_id" })
    sender: User;
    @ManyToOne(() => User, (user) => user.receivedFriendRequests)
    @JoinColumn({ name: "receiver_id" })
    receiver: User;

    @Column({ default: false })
    accepted: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
