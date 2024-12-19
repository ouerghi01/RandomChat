import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Post_entity } from "./entities/post.entity";
import { CreatePostDto } from "./dto/CreatePostDto.dto";
import { Get_posts_dto } from "./dto/get_posts.dto";

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
        post.isAnonymous = createPostDto.isAnonymous;
        if (createPostDto.post_img) {
            post.image = createPostDto.post_img;
        }
        return this.postRepository.save(post);
    }
    async findAll(): Promise<Get_posts_dto[]> {
        const posts = await this.postRepository.find({
            relations: ['user', 'user.profile'],
        });
        let allPosts : Get_posts_dto[] = [];
        for (let i = 0; i < posts.length; i++) {
            let post = new Get_posts_dto();
            post.title = posts[i].title;
            post.content = posts[i].content;
            post.post_image = posts[i].image;
            post.id = posts[i].id;
            post.userId = posts[i].user.id;
            post.email = posts[i].user.email;
            post.profile_image = posts[i].user.profile.profile_picture_url;
            post.isAnonymous = posts[i].isAnonymous
            post.CreatedAt = posts[i].createdAt;
            allPosts.push(post);
        }
        return allPosts;
    }

}