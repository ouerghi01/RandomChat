import { IsInt, IsNumber, IsString, MinLength } from "class-validator";



export class MessageDto {
    @IsString()
    @MinLength(1,{message : 'name is too short'})
    content: string;
    
    @IsInt()
    @MinLength(1)
    sender_id: number;

    @IsInt()
    @MinLength(1)
    roomId: number;
    constructor(content: string, sender_id: number, roomId: number) {
        this.content = content;
        this.sender_id = sender_id;
        this.roomId = roomId;
    }
}