import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { Token } from "./token.entity";
import { Message } from "./message.entity";
import { Room } from "./room.entity";

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
    @OneToOne(() => Room, room => room.sender)
    @JoinColumn()
    room: Room;

    @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

}
