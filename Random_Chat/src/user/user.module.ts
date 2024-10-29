import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User,Token,Message,Room])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
