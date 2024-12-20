import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Token } from './user/entities/token.entity';
import { ChatsModule } from './chats/chats.module';
import { Message } from './user/entities/message.entity';
import { Room } from './user/entities/room.entity';
import { Friendship } from './user/entities/friend.entity';
import { Profile } from './user/entities/profile.entity';
import { UserController } from './user/user.controller';
import { Post_entity } from './user/entities/post.entity';
import { PostController } from './user/post.controller';
import { Reaction } from './user/entities/reaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`, // Loads the appropriate environment file
      isGlobal: true, // Makes the config available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: "postgres",
        password: "postgres",
        database: configService.get<string>('DB_NAME'),
        entities: [User, Token, Message, Room, Friendship,Profile,Post_entity,Reaction],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ChatsModule,
  ],
  controllers: [UserController,PostController],
  providers: [],
})
export class AppModule {}

