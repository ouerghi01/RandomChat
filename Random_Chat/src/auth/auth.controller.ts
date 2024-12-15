import { Body, Controller,HttpCode, HttpStatus, Post, UseGuards, Res, Req } from '@nestjs/common';
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
        this.setAuthCookies(response, data);
           
        return data
        
    }
    private setAuthCookies(response: Response<any, Record<string, any>>, data: Data_Authenticated) {
        const isProduction = process.env.NODE_ENV === 'production';
    
        response.cookie('access_token', data.access_token, {
            httpOnly: true, // Protect against XSS
            domain: isProduction ? '192.168.1.6' : undefined, // Use undefined for localhost in development
            secure: isProduction, // Enable secure cookies in production (requires HTTPS)
            sameSite: isProduction ? 'strict' : 'lax', // Strict in production for better CSRF protection
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
    
        response.cookie('user_email', data.user_email, {
            httpOnly: false, // Not sensitive, so accessible via client-side JavaScript
            domain: isProduction ? '192.168.1.6' : undefined, // Use undefined for localhost in development
            secure: isProduction, // Enable secure cookies in production
            sameSite: isProduction ? 'strict' : 'lax', // Strict in production
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
        response.cookie('user_id', data.user_id.toString(), {
            httpOnly: false, // Not sensitive, so accessible via client-side JavaScript
            domain: isProduction ? '192.168.1.6' : undefined,
            secure: isProduction, // Enable secure cookies in production
            sameSite: isProduction ? 'strict' : 'lax', // Strict in production
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
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

