import { Body, Controller, Get, Post } from "@nestjs/common";
import { PostService } from "./user.post.service";
import { CreatePostDto } from "./dto/CreatePostDto.dto";
import { Post_entity } from "./entities/post.entity";
import { Get_posts_dto } from "./dto/get_posts.dto";
import { ReactionDto } from "./dto/reaction.dto";
import { Reaction } from "./entities/reaction.entity";

@Controller('post')
export class PostController { 
    constructor(private postService: PostService) {}
    @Post('Create_post')
    async createPost(@Body() createPostDto: CreatePostDto): Promise<Post_entity> {
        return this.postService.create(createPostDto);
    }
    @Get('GetAllPosts')
    async getAllPosts(): Promise<Get_posts_dto[]> {
        return this.postService.findAll();
    }
    @Post('ReactToPost')
    async reactToPost(@Body() reactDto: ReactionDto): Promise<Reaction> {
        return this.postService.reactToPost(reactDto.postId, reactDto.userId, reactDto.reaction);
    }
}