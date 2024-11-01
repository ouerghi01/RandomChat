import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("rooms")
export class Room {
    @PrimaryColumn()
    id: string;
    @OneToOne(() => User)
    @JoinColumn({ name: "sender_id" })
    sender: User;
    @OneToOne(() => User)
    @JoinColumn({ name: "receiver_id" })
    receiver:User;
    constructor( roomId:string,sender:User, receiver:User){
        this.id=roomId;
        this.sender= sender;
        this.receiver = receiver;
    }
}