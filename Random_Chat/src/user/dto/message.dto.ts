import { IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";



export class MessageDto {
    @IsString()
    @MinLength(1,{message : 'name is too short'})
    @IsNotEmpty()
    content: string;
    constructor(content: string) {
        this.content = content;
    }
    
    
}