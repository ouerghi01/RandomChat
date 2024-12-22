import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { Poll } from "./entities/poll.entity";
import { Option_entity } from "./entities/option.entity";
import { ResponsePoll } from "./dto/pollresponse.dto";
import { VoteDto } from "./dto/vote_dto.dto";
import { Vote_entity } from "./entities/vote.entity";


@Injectable()
export class PollService  {
    constructor(
     @InjectRepository(User) private userRepository: Repository<User>,
     private readonly dataSource: DataSource,
     @InjectRepository(Poll) private pollRepository: Repository<Poll>,
     @InjectRepository(Option_entity) private optionsRepository: Repository<Option_entity>,
    ){}
    // create a new poll
    async createPoll(question: string, userId: number, options: string[]){
         const user = await this.userRepository.findOne({
               where: { id: userId },
         });
         if(!user){
            throw new Error("User not found");
         }
         return this.dataSource.transaction(async manager => {
            const poll = new Poll();
            poll.question = question;
            poll.user = user;
            const newPoll = await manager.save(poll);
            for(let i = 0; i < options.length; i++){
                const option = new Option_entity();
                option.content = options[i];
                option.poll = newPoll;
                
                option.vote = new Vote_entity();
                await manager.save(option);
            }
            return newPoll;
        });
   }
    // get all polls
    async getAllPolls(): Promise<ResponsePoll[]> {
        const polls = await this.pollRepository.find({
            relations: ["options", "options.vote", "options.vote.users", "user"],
        });
    
        return polls.map((poll) => ({
            id: poll.id,
            question: poll.question,
            user: poll.user?.email || "Anonymous",
            createdAt: poll.createdAt,
            updatedAt: poll.updatedAt,
            options: poll.options.map((option) => ({
                id: option.id,
                content: option.content,
                users_vote: option.vote?.users.map((user) => user.id) || [],
            })),
        }));
    }
    
    async vote_to_option(vote_dto: VoteDto) {
        const option = await this.optionsRepository.findOne({
            where: { id: vote_dto.optionIndex },
            relations: ["poll", "vote", "vote.users"],
        });
        if (!option) {
            throw new Error("Option not found");
        }
    
        await this.dataSource.transaction(async (manager) => {
            const user = await this.userRepository.findOne({
                where: { id: vote_dto.userId },
            });
            if (!user) {
                throw new Error("User not found");
            }
    
            let vote = option.vote;
            if (!vote) {
                // Create a new vote if none exists for this option
                vote = new Vote_entity();
                vote.option = option;
                vote.users = [];
            }
    
            // Check if the user already voted
            const userIndex = vote.users.findIndex((u) => u.id === user.id);
            if (userIndex !== -1) {
                // User has already voted; remove their vote
                vote.users.splice(userIndex, 1);
            } else {
                // User is voting for the option; add their vote
                vote.users.push(user);
            }
    
            // Save the updated vote and related entities
            await manager.save(vote);
        });
    
        // Fetch the updated poll and format the response
        const pollUpdated = await this.pollRepository.findOne({
            where: { id: option.poll.id },
            relations: ["options", "options.vote", "options.vote.users", "user"],
        });
    
        const pollResponse = new ResponsePoll();
        pollResponse.id = pollUpdated.id;
        pollResponse.question = pollUpdated.question;
        pollResponse.user = pollUpdated.user?.email || "Anonymous";
        pollResponse.createdAt = pollUpdated.createdAt;
        pollResponse.updatedAt = pollUpdated.updatedAt;
        pollResponse.options = pollUpdated.options.map((opt) => ({
            id: opt.id,
            content: opt.content,
            users_vote: opt.vote?.users.map((u) => u.id) || [],
        }));
    
        return pollResponse;
    }
    

}