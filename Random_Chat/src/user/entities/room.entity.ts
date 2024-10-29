import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("rooms")
export class Room {
    @PrimaryColumn()
    id: string;
    sender_id:number;
    receiver_id:number;
    constructor(id:string, sender_id:number, receiver_id:number){
        this.id = id;
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
    }
}