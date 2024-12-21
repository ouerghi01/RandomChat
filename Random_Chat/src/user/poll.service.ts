import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { Poll } from "./entities/poll.entity";
import { Option_entity } from "./entities/option.entity";
import { ResponsePoll } from "./dto/pollresponse.dto";


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
                option.users = [];
                await manager.save(option);
            }
            return newPoll;
        });
   }
    // get all polls
    async getAllPolls(){
        const polls = await this.pollRepository.find({
            relations: ["options", "user"],
        });
        const pollResponse: ResponsePoll[] = new Array<ResponsePoll>();
        for(let i = 0; i < polls.length; i++){
            const poll = polls[i];
            const options = poll.options.map(option => option.content);
            const user = poll.user.email;
            pollResponse.push({
                id: poll.id,
                question: poll.question,
                options: options,
                user: user,
                createdAt: poll.createdAt,
                updatedAt: poll.updatedAt,
            });
        }
        return pollResponse;
    }

}