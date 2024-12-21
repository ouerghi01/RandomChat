import { Body, Controller, Post } from "@nestjs/common";
import { PollDto } from "./dto/polldto.dto";
import { Poll } from "./entities/poll.entity";
import { PollService } from "./poll.service";
import { ResponsePoll } from "./dto/pollresponse.dto";



@Controller('poll')
export class PollController {
    constructor(
        private readonly pollService: PollService,
    ){}
   
    // create a new poll
    @Post('createPoll')
    async createPoll(@Body() poll_dto:PollDto): Promise<Poll> {
        return this.pollService.createPoll(poll_dto.question, poll_dto.user_id, poll_dto.options);
    }
    // get all polls
    @Post('getAllPolls')
    async getAllPolls(): Promise<ResponsePoll[]> {
        return this.pollService.getAllPolls();
    }
    
}