import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { MessageDto } from './dto/message.dto';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { Friendship } from './entities/friend.entity';
import { send } from 'process';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository :Repository<Token>
    ,
    @InjectRepository(Room) private roomRepository :Repository<Room>,
    @InjectRepository(Message) private messageRepository :Repository<Message>,
    @InjectRepository(Friendship) private FriendshipRepository :Repository<Friendship>,
  ) {}
  create(createUserDto: CreateUserDto):Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.age = createUserDto.age;
    user.password = createUserDto.password;
    user.gender = createUserDto.gender;
    user.created_at=new Date();
    return this.userRepository.save(user);

  }
  public async storeTokenInRepository(access_token: string, user: User) {
    const token = new Token();
    token.token = access_token;
    token.user = user;
    token.created_at = new Date();
    token.expired_at = new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000);
    await this.tokenRepository.save(token);
  }
  public async createFriendship(sender: User, receiver: User): Promise<void> {
    const friendship = new Friendship();
    friendship.sender = sender;
    friendship.receiver = receiver;
    friendship.accepted = false;
    await this.FriendshipRepository.save(friendship);
  }
  public async checkFriendship(user:User,friend:User): Promise<boolean> {
    const friendship = await this.FriendshipRepository.findOne({
      where: [
      { sender: user, receiver: friend, accepted: true },
      { sender: friend, receiver: user, accepted: true }
      ]
    });
    return !!friendship;
  }
  public async acceptFriendship(sender: User, receiver: User): Promise<void> {
    const friendship = await this.FriendshipRepository.findOneBy({sender, receiver});
    const friendship1 = await this.FriendshipRepository.findOneBy({sender:receiver, receiver:sender});
    if(friendship!=null){
      friendship.accepted = true;
      await this.FriendshipRepository.save(friendship);
    }else{
      friendship1.accepted = true;
      await this.FriendshipRepository.save(friendship1);
    }
  }
  public findByToken(token: string): Promise<Token> {
    return this.tokenRepository.findOneBy({token})
  }

  findAll() :Promise<User[]>{
    return this.userRepository.find();
  }
  findUserByEmail(email: string):Promise<User> {
    return this.userRepository.findOneBy({email});
  }

  findOne(id: number):Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    user.id = id;
    
    return this.userRepository.save(user);
  }
  saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  async saveMessage(message_dto :MessageDto): Promise<Message> {
    const message = new Message();
    message.content = message_dto.content;
    message.date_created = message_dto.date_created;
    await this.messageRepository.save(message);
    return message;
  }
  async createRoom(roomId: string, sender: User, rec: User): Promise<void> {
    const existingRoom = await this.roomRepository.findOne({
        where: { id: roomId },
        relations: ['users'],
    });

    if (existingRoom) {
        console.log("Room already exists.");
        return;
    }

    const room = new Room();
    room.id = roomId;
    room.users = [sender, rec];
    room.sender = sender;
    room.receiver = rec;

    await this.roomRepository.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(Room, room);

        if (!sender.rooms) sender.rooms = [];
        if (!rec.rooms) rec.rooms = [];

        sender.rooms.push(room);
        rec.rooms.push(room);

        await transactionalEntityManager.save(User, sender);
        await transactionalEntityManager.save(User, rec);
    });

    console.log("Room created and users added.");
}


  
  
  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }


  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
