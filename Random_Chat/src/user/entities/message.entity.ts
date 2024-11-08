import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
@Entity("messages")
export class Message{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'text' })
    content: string;
    @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
    date_created: Date;
    

}