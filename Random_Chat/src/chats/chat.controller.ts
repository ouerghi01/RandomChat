import { Controller, Get, Param } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";

@Controller('chats')

export class ChatController {
    constructor(private  chatGateway:ChatGateway ){}
    @Get('/getClients/:id')
    getClients(@Param('id') id: string): boolean {
        const clientId = parseInt(id, 10);
        return this.chatGateway.getClients().some(client => client === clientId);
    }


}