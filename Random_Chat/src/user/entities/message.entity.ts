import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
@Entity("messages")
export class Message{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'text' })
    content: string;
    

}