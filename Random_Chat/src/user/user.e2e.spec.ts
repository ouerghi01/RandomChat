import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as request from 'supertest' ;
import { Token } from './entities/token.entity';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { Friendship } from './entities/friend.entity';
import { CreateProfiledDto } from './dto/create_profile.dto';
let app: INestApplication;
let userRepository: Repository<User>;
let profileRepository: Repository<Profile>;
const validProfileDto = {
  profile_picture_url: 'https://example.com/images/profile1.jpg',
  bio: 'A passionate developer with a love for coding and technology.',
  city: 'New York',
  country: 'USA',
  timezone: 'UTC-5',
  birthday: '1990-05-15',
  phone_number: '+1 234 567 8901',
  social_link: 'https://twitter.com/developer123',
};
beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      UserModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'e2e_test',
        entities: [User, Profile,Token,Message,Room,Friendship],
        synchronize: false,
      }),
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  userRepository = module.get<Repository<User>>('UserRepository');
  profileRepository = module.get<Repository<Profile>>('ProfileRepository');
});

describe('POST /Create_user', () => {
  it('should create a user', async () => {
    const validCreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 25,
      gender: 'm',
      password: 'Password123!',
    };

    const user_dto = new CreateUserDto();
    user_dto.name = validCreateUserDto.name;
    user_dto.email = validCreateUserDto.email;
    user_dto.age = validCreateUserDto.age;
    user_dto.gender = validCreateUserDto.gender;
    user_dto.password = validCreateUserDto.password;

    const { body } = await request(app.getHttpServer())
      .post('/user/Create_user')
      .send(user_dto)
      .expect(201);

    expect(body).toHaveProperty('id');
    expect(body.name).toBe(validCreateUserDto.name);
    expect(body.email).toBe(validCreateUserDto.email);
  });
});


describe('POST /CreateProfile', () => {
  it('should create a profile', async () => {
    
    const user_id = 1; // Assuming this user exists    
    let profile_dto= new CreateProfiledDto();
    profile_dto.userId=user_id;
    profile_dto.profile_picture_url=validProfileDto.profile_picture_url;
    profile_dto.bio=validProfileDto.bio;
    profile_dto.city=validProfileDto.city;
    profile_dto.country=validProfileDto.country;
    profile_dto.timezone=validProfileDto.timezone;
    profile_dto.birthday=new Date(validProfileDto.birthday);
    profile_dto.phone_number=validProfileDto.phone_number;
    profile_dto.social_link=validProfileDto.social_link;

    const { body } = await request(app.getHttpServer())
      .post(`/user/CreateProfile`)
      .send(  profile_dto )
      .expect(201);

    expect(body).toHaveProperty('id');
    expect(body.profile_picture_url).toBe(validProfileDto.profile_picture_url);
    expect(body.bio).toBe(validProfileDto.bio);
  });
});
describe('GET /user_profile', () => {
  it('should return a user profile', async () => {
    const user_id="1";
    const { body } = await request(app.getHttpServer())
      .get(`/user/GetProfile/${user_id}`)
      .expect(200);
    
    expect(body.profile_picture_url).toBe(validProfileDto.profile_picture_url);
    expect(body.bio).toBe(validProfileDto.bio);
  });
});

afterAll(async () => {
  await app.close();
});

