import { IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";



export class MessageDto {
    @IsString()
    @MinLength(1,{message : 'name is too short'})
    @IsNotEmpty()
    content: string;
    
    date_created: Date;
    constructor(content: string, date_created: Date) {
        this.content = content;
        this.date_created = date_created;
    }
    
    
}