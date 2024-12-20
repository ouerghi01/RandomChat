import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Post_entity } from "./entities/post.entity";
import { CreatePostDto } from "./dto/CreatePostDto.dto";
import { Get_posts_dto } from "./dto/get_posts.dto";
import { Reaction, ReactionType } from "./entities/reaction.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Post_entity) private postRepository: Repository<Post_entity>,
        @InjectRepository(Reaction) private  reactionRepository: Repository<Reaction>,
        private readonly dataSource: DataSource
      ) {}
    // create a new post
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
    // get all posts
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
    // react to a post
    async reactToPost(postId: number, userId: number, reaction: string): Promise<Reaction> {
        // Validate reaction type
        if (!Object.values(ReactionType).includes(reaction as ReactionType)) {
            throw new BadRequestException(`Invalid reaction type: ${reaction}`);
        }

        return this.dataSource.transaction(async (manager) => {
            const post = await manager.findOne(Post_entity, { where: { id: postId } });
            const user = await manager.findOne(User, { where: { id: userId } });
            if (!user || !post) {
                throw new NotFoundException('User Or Post not found');
            }
            let reactionObj = await manager.findOne(Reaction, { where: { post, user } });
            if (reactionObj) {
                reactionObj.reaction = reaction as ReactionType;
            } else {
                reactionObj = manager.create(Reaction, {
                    post,
                    user,
                    reaction: reaction as ReactionType,
                });
            }
            return manager.save(reactionObj);
        });
    }

}