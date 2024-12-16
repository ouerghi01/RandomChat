import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { CreateProfiledDto } from "./dto/create_profile.dto";
import { Profile } from "./entities/profile.entity";
import { User_info } from "./dto/user_info.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('Create_user')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Post('CreateProfile')
    async createProfile(@Body() createUserDto: CreateProfiledDto): Promise<Profile> {
        
        const profile=await this.userService.createProfile(createUserDto);
        return profile;
    }
    @Get('GetProfile/:user_id')
    async getProfile(@Param('user_id') user_id:string): Promise<Profile> {
        const user_id_int=parseInt(user_id, 10);
        const profile=await this.userService.GetProfile(user_id_int);
        return profile;
    }
    @Get('GetUserInfos/:user_id')
    async getUserInfo(@Param('user_id') user_id:string) : Promise<User_info> {
        return await this.userService.getUserInfo(parseInt(user_id,10));
    }
    

}