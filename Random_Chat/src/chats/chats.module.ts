import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatGateway } from './chat.gateway';

import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule,UserModule],
  controllers: [],
  providers: [ChatsService,ChatGateway]
})
export class ChatsModule {}
