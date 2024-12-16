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
import { Profile } from './entities/profile.entity';
import { CreateProfiledDto } from './dto/create_profile.dto';
import { User_info } from './dto/user_info.dto';

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
    @InjectRepository(Profile) private profileRepository :Repository<Profile>,
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
  public async getUserInfo(id: number): Promise<User_info> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: { profile: true },
    });

    if (!user) {
        throw new Error('User not found'); // Optional: Handle the case where the user is not found
    }

    return {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        profile_picture_url: user.profile?.profile_picture_url || '',
        bio: user.profile?.bio || '',
        city: user.profile?.city || '',
        country: user.profile?.country || '',
        timezone: user.profile?.timezone || '',
        phone_number: user.profile?.phone_number || '',
        birthday: user.profile?.birthday || null,
        social_link: user.profile?.social_link || '',
    };
}

  async createProfile(profile_dto:CreateProfiledDto): Promise<Profile> {
    const user1 = await this.userRepository.findOne({ where: 
      { id: profile_dto.userId } ,
      relations: {
        profile: true,
      },
    });
    if (!user1) {
      throw new Error('User not found');
    }
    const profile = new Profile();
    profile.profile_picture_url = profile_dto.profile_picture_url;
    profile.bio = profile_dto.bio;
    profile.city = profile_dto.city;
    profile.country = profile_dto.country;
    profile.timezone = profile_dto.timezone;
    profile.birthday = profile_dto.birthday;
    profile.phone_number = profile_dto.phone_number;
    profile.social_link = profile_dto.social_link;
    const profile_x = await this.profileRepository.save(profile);
    user1.profile = profile_x;
    await this.userRepository.save(user1);
    return profile_x;
  }

  
  public async GetProfile(user_id:number): Promise<Profile> {
    try {
      const user = await this.userRepository.findOne({ where: 
        { id: user_id } ,
        relations: {
          profile: true,
        },
      
      });
      return user.profile;
    }
    catch (error) {
      return null;
    }
  }

  public async storeTokenInRepository(access_token: string, user: User) {
    const token = new Token();
    token.token = access_token;
    token.user = user;
    token.created_at = new Date();
    token.expired_at = new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000);
    await this.tokenRepository.save(token);
  }
  public async editProfile( profile: Profile): Promise<Boolean> {
    const profile_exist = await this.profileRepository.findOne({ where: { id: profile.id } });
    const user1 = await this.userRepository.findOne({ where: { id: profile_exist.user.id } });
    if(user1==null) return false;
    user1.profile = profile;
    await this.profileRepository.save(profile);
    await this.userRepository.save(user1);
    return true;
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
    message.room = await this.roomRepository.findOne({ where: { id: message_dto.roomId } });
    message.sender = message_dto.user;
    message.receiver = message_dto.friend;

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
    }
    else{
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

    
    
}


  
  
  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }


  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
