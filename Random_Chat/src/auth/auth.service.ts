import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Token } from 'src/user/entities/token.entity';
import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    
    constructor(private userService: UserService
        ,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    getJwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET');
    }
    async sign_in(email: string, password: string) : Promise<any> {
        const user = await this.userService.findUserByEmail(email);
        if (!user ||!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException();
        }
        const payload = { email: user.email, sub: user.id };
        
        const access_token = await this.jwtService.signAsync(payload);
        await this.userService.storeTokenInRepository(access_token, user);
       
        
        return {
            access_token: access_token,
            user_email: user.email,
            user_id: user.id
        };
        
    }

    public getUserFromAuthenticationToken(token: string): Promise<User> {
        const payload = this.jwtService.verify(token, 
            {
            secret: jwtConstants.secret,
            }
        );
        const user_id=payload.sub;
        return this.userService.findOne(parseInt( user_id));
    }
    get_token(token:string) :Promise<Token> {
        return this.userService.findByToken(token);
    }
   
   

    async register(createUserDto: CreateUserDto): Promise<Boolean> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        createUserDto.password = hashedPassword;
        const new_user=this.userService.create(createUserDto);
        if(new_user !=null) return true
        return false
    }
}
