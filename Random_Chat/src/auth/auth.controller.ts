import { Body, Controller, Get,HttpCode, HttpStatus, Post, UseGuards, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { SkipAuth } from './auth.public';
import { console } from 'inspector';
import { Request } from 'express';
interface Data_Authenticated {
    access_token: string,
    user_email: string,
    user_id: number
}
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService :UserService) {}
    @HttpCode(HttpStatus.OK)
    @SkipAuth()
    @Post('login')
    async sign_in(@Body() body: { email: string; password: string },@Res({ passthrough: true }) response: Response,@Req() request: Request) {

        const data: Data_Authenticated = await this.authService.sign_in(body.email, body.password);
        response.cookie('access_token', data.access_token, {
            httpOnly: false, // Not secure for production; use true if storing sensitive data
            domain: 'localhost', // Adjust for your domain
            secure: true, // Use true if using HTTPS
            sameSite: 'none', // Cross-site cookies
          });
        response.cookie('user_email',data.user_email,{
            httpOnly: false,
            domain: 'localhost',
            secure: true,
            sameSite: 'none',
        });
           
        return data
        
    }
    @Post('verify')
    async verify(@Req() req) {
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.getUserFromAuthenticationToken(token);
    }

    @HttpCode(HttpStatus.OK)
    @SkipAuth()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.findUserByEmail(createUserDto.email);
        if(user!=null){
            return user;
        }
        const happen= await this.authService.register(createUserDto)
        if(happen) return true;
        return null;

    }
    
    

// Removed the Res function as it is not needed anymore
}

