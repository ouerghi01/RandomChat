import { Entity, PrimaryColumn, ManyToMany, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable, Column, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity("rooms")
export class Room {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  
  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable({
    name: "user_room", // Join table name
    joinColumn: { name: "room_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
  })
  users: User[];

}

