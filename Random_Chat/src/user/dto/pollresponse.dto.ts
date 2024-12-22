import { OptionsResponse } from "./options.dto";

export class ResponsePoll {
    id: number;
    question: string;
    options: OptionsResponse[];
    user :string;
    createdAt: Date;
    updatedAt: Date;
}