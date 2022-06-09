
// Randomly generate id number
// Very low chance of collision

import { ColorResolvable, FileOptions, InteractionReplyOptions, MessageEmbed, MessageOptions } from "discord.js";
import { color1 } from "../settings.json";

// Probably should make this better later
function createId() {
    return Math.floor(Math.random()*1e9);
}

export interface ProblemOptions {
    question?: string;
    answer?: string;
    id?: number;
    images?: string[];
    finished?: boolean;
}

export class Problem {
    question: string;
    answer: string;
    id: number;
    images?: string[]; // proxy URLs of attachments
    finished: boolean;

    constructor(opts: ProblemOptions) {
        this.question = opts.question ?? "";
        this.answer = opts.answer ?? "";
        this.id = opts.id ?? createId();
        this.images = opts.images;
        this.finished = opts.finished ?? false;
    }

    // Display problem as an embed (obsolete for now)
    _createEmbed(date?: string) {
        const embed = new MessageEmbed()
            .setColor(color1 as ColorResolvable)
            .setTitle("Problem of the Day" + (date ? " "+date : ""))
            .setDescription(this.question);

        if (this.images) embed.setImage(this.images[0]) // can only display first image
        return embed;
    }

    // Display problem as a message
    createMessage(answer?: boolean, date?: string) {
        // convert images into attached files
        const imageAttachments = this.images?.map((url, ind) => ({
            attachment: url,
            name: `image${ind}.png`
        })) as FileOptions[] | undefined;

        // trying to keep it a bit more organized
        const content = [
            `**Problem of the Day${date ? " "+date : ""}**`,
            this.finished ? "" : " (unfinished)",
            `\n${this.question}`,
            answer ? `\nAnswer: ${this.answer}` : ""
        ].join("");

        return {
            content,
            files: imageAttachments
        };
    }
}
