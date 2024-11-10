import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne, OneToMany, OneToOne, JoinColumn, ManyToMany, JoinTable} from "typeorm";
import { Token } from "./token.entity";
import { Message } from "./message.entity";
import { Room } from "./room.entity";
import { Friendship } from "./friend.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id :number;
    @Column({type : 'varchar', length :30})
    name :string;
    @Column({type : 'varchar', length :255})
    email :string;
    @Column({type : 'int'})
    age :number;
    @Column({type:'enum', enum:['m','f']})
    gender : string;
    @Column({ type: 'varchar', length: 255 })
    password: string;
    @OneToMany(() => Token, token => token.id)
    tokens: Token[];
    
    @OneToOne(() => Message)
    @JoinColumn()
    message: Message;
    
    @OneToMany(() => Room, (room) => room.sender)
    send_rooms: Room[];

    @OneToMany(() => Room, (room) => room.receiver)
    received_rooms: Room[];
    @OneToMany(() => Friendship, (friendship) => friendship.sender)
    @ManyToMany(() => Room, (room) => room.users)
    rooms: Room[];
    sentFriendRequests: Friendship[];

    @OneToMany(() => Friendship, (friendship) => friendship.receiver)
    receivedFriendRequests: Friendship[];
    @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

}
