import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Token } from './user/entities/token.entity';
import { ChatsModule } from './chats/chats.module';
import { Message } from './user/entities/message.entity';
import { Room } from './user/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      database: 'postgres',
      entities: [User,Token,Message,Room],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
