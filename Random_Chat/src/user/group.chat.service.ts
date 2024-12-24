import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { GroupChat } from "./entities/groupchat.enity";
import { CreateGroupDto } from "./dto/creategroup.dto";
import { AddUserDto } from "./dto/addusergroup.dto";

@Injectable()
export class GroupChatService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly dataSource: DataSource, 
        @InjectRepository(GroupChat) private groupChatRepository: Repository<GroupChat>,
    ) {}
    // create a new group chat
    async createGroupChat(createGroupDto:CreateGroupDto): Promise<GroupChat> {
        const user = await this.userRepository.findOne({
            where: { id: createGroupDto.admin },
        });
        if(!user){
            throw new Error("User not found");
        }
        const groupChat = new GroupChat();
        groupChat.admin = user;
        groupChat.name = createGroupDto.name;
        groupChat.description = createGroupDto.description;
        groupChat.max_member_count = createGroupDto.max_member_count;
        groupChat.logo_group = createGroupDto.logo_group;
        groupChat.users = [user];
        return this.groupChatRepository.save(groupChat);
    }
    async addUser(addUserDto: AddUserDto): Promise<void > {
        const user = await this.userRepository.findOne({
            where: { id: addUserDto.user_id },
        });
        const groupChat = await this.groupChatRepository.findOne({
            where: { id: addUserDto.group_id },
        });
        if(!groupChat || !user){
            throw new Error(" User Or Group Chat not found");
        }
        if(groupChat.users.length >= groupChat.max_member_count){
            throw new Error("Group Chat is full");
        }
        groupChat.users.push(user);
        await this.groupChatRepository.save(groupChat);
    }
        

}