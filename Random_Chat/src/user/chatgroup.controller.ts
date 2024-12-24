import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GroupChatService } from "./group.chat.service";
import { CreateGroupDto } from "./dto/creategroup.dto";

@Controller('group')
export class ChatGroupController {
    constructor(private groupChatService: GroupChatService) {}
    // create a new group chat
    @Post('create')
    async createGroup(@Body() createGroupDto: CreateGroupDto) {
        return this.groupChatService.createGroupChat(createGroupDto);
    }
    @Get('all/:admin_id')
    async getAllGroup(
        @Param('admin_id') admin_id: number
    ) {
        return this.groupChatService.getAllGroupByAdmin(admin_id);
    }
        
    

}
