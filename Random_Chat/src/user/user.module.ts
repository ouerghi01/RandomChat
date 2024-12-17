import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { Friendship } from './entities/friend.entity';
import { Profile } from './entities/profile.entity';
import { UserController } from './user.controller';
import { Post_entity } from './entities/post.entity';
import { PostService } from './user.post.service';
import { PostController } from './post.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User,Token,Message,Room,Friendship,Profile,Post_entity])],
  controllers: [UserController,PostController],
  providers: [UserService,PostService],
  exports: [UserService,PostService],
})
export class UserModule {}
