import { Body, Controller, Get, Request,HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { SkipAuth } from './auth.public';
import { console } from 'inspector';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService :UserService) {}
    @HttpCode(HttpStatus.OK)
    @SkipAuth()
    @Post('login')
    async sign_in(@Body() body: { email: string; password: string }) {
        return this.authService.sign_in(body.email, body.password);
    }

    @HttpCode(HttpStatus.OK)
    @SkipAuth()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.findUserByEmail(createUserDto.email);
        if(user!=null){
            return user;
        }
        return await this.authService.register(createUserDto)
       

    }
    

}
