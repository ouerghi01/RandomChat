import { Body, Controller, Get, Post } from "@nestjs/common";
import { PostService } from "./user.post.service";
import { CreatePostDto } from "./dto/CreatePostDto.dto";
import { Post_entity } from "./entities/post.entity";

@Controller('post')
export class PostController { 
    constructor(private postService: PostService) {}
    @Post('Create_post')
    async createPost(@Body() createPostDto: CreatePostDto): Promise<Post_entity> {
        return this.postService.create(createPostDto);
    }
    @Get('GetAllPosts')
    async getAllPosts(): Promise<Post_entity[]> {
        return this.postService.findAll();
    }
}