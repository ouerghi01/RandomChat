import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets/errors/ws-exception';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatsService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService :AuthService) {}
    async getUserFromSocket(socket :Socket) {
        let auth_token = socket.handshake.headers.authorization;
        console.log(auth_token)
        const user = await this.authService.getUserFromAuthenticationToken(auth_token);
        if (!user) {
            throw new WsException('Invalid credentials.');
        }
        return user;
    }
    
}
