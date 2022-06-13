import { ProblemAnswer } from "./Problem";

interface UserOptions {
    id: string;
    answers?: ProblemAnswer[];
}

export class User {
    id: string;
    answers: ProblemAnswer[];

    constructor(opts: UserOptions) {
        this.id = opts.id;
        this.answers = opts.answers ?? [];
    }
}
