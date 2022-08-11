import { ColorResolvable, FileOptions, MessageEmbed } from "discord.js";
import { color1 } from "../settings.json";

// Randomly generate id number
// Low chance of collision
// Probably should make this better later
function createId() {
    return Math.floor(Math.random() * 1e6);
}

export interface ProblemOptions {
    question?: string;
    answer?: string;
    id?: number;
    image?: string;
    finished?: boolean;
}

export class Problem {
    question: string;
    answer: string;
    id: number;
    image?: string; // proxy URLs of attachments
    finished: boolean;

    constructor(opts: ProblemOptions) {
        this.question = opts.question ?? "";
        this.answer = opts.answer ?? "";
        this.id = opts.id ?? createId();
        this.image = opts.image;
        this.finished = opts.finished ?? false;
    }

    // Display problem as an embed (obsolete for now)
    _createEmbed(date?: string) {
        const embed = new MessageEmbed()
            .setColor(color1 as ColorResolvable)
            .setTitle("Problem of the Day" + (date ? " " + date : ""))
            .setDescription(this.question);

        if (this.image) embed.setImage(this.image); // can only display first image
        return embed;
    }

    // Display problem as a message
    createMessage(answer?: boolean, date?: string) {
        // convert images into attached files
        const imageAttachments = {
            attachment: this.image,
            name: "image1.png"
        } as FileOptions | undefined;

        // trying to keep it a bit more organized
        const content = [
            `**Problem of the Day${date ? " " + date : ""}**`,
            this.finished ? "" : " (unfinished)",
            `\n${this.question}`,
            answer ? `\nAnswer: ${this.answer}` : ""
        ].join("");

        return {
            content,
            files: imageAttachments
        };
    }

    isCorrect(ans: ProblemAnswer) {
        return this.answer.trim().toLowerCase() === ans.answer.trim().toLowerCase();
    }
}

interface ProblemAnswerOptions {
    userId: string;
    problemId: number;
    answer: string;
    time: number;
}

// a user's answer to a problem
export class ProblemAnswer {
    userId: string;
    problemId: number;
    answer: string;
    time: number;

    constructor(opts: ProblemAnswerOptions) {
        this.userId = opts.userId;
        this.problemId = opts.problemId;
        this.answer = opts.answer;
        this.time = opts.time;
    }
}
