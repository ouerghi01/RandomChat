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
import { Reaction } from './entities/reaction.entity';
import { Poll } from './entities/poll.entity';
import { Option_entity } from './entities/option.entity';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { Vote_entity } from './entities/vote.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User,Token,Message,Room,Friendship,Profile,Post_entity,Reaction,Poll,Option_entity,Vote_entity])],
  controllers: [UserController,PostController,PollController],
  providers: [UserService,PostService,PollService],
  exports: [UserService,PostService,PollService],
})
export class UserModule {}
