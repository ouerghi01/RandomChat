import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Post_entity } from "./entities/post.entity";
import { CreatePostDto } from "./dto/CreatePostDto.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Post_entity) private postRepository: Repository<Post_entity>,
      ) {}
    async create(createPostDto: CreatePostDto): Promise<Post_entity> {
        const user = await this.userRepository.findOne({
            where: { id: createPostDto.userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const post = new Post_entity();
        post.title = createPostDto.title;
        post.content = createPostDto.content;
        post.user = user;
        return this.postRepository.save(post);
    }
    async findAll(): Promise<Post_entity[]> {
        return this.postRepository.find();
    }

}