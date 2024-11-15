import { IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { User } from "../entities/user.entity";



export class MessageDto {
    @IsString()
    @MinLength(1,{message : 'name is too short'})
    @IsNotEmpty()
    content: string;
    roomId: string
    
    date_created: Date;
    user: User;
    friend: User;
    constructor(content: string, date_created: Date, roomId: string, user: User, friend: User) {
        this.content = content;
        this.date_created = date_created;
        this.roomId = roomId;
        this.user = user;
        this.friend = friend;
    }
    
    
}