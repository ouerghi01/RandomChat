import { Body, Controller, Post } from "@nestjs/common";
import { PollDto } from "./dto/polldto.dto";
import { Poll } from "./entities/poll.entity";
import { PollService } from "./poll.service";
import { ResponsePoll } from "./dto/pollresponse.dto";
import { VoteDto } from "./dto/vote_dto.dto";



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
    // vote for an option
    @Post('vote')
    async vote(@Body() vote_dto: VoteDto): Promise<ResponsePoll> {
        return this.pollService.vote_to_option(vote_dto);
    }
    
}