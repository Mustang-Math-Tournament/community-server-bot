
// Randomly generate id number
// Very low chance of collision

import { ColorResolvable, FileOptions, MessageEmbed, MessageOptions } from "discord.js";
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
}

export class Problem {
    question: string;
    answer: string;
    id: number;
    images?: string[]; // proxy URLs of attachments

    constructor(opts: ProblemOptions) {
        this.question = opts.question ?? "";
        this.answer = opts.answer ?? "";
        this.id = opts.id ?? createId();
        this.images = opts.images;
    }

    // Display problem as an embed
    createEmbed(date?: string) {
        const embed = new MessageEmbed()
            .setColor(color1 as ColorResolvable)
            .setTitle("Problem of the Day" + (date ? " "+date : ""))
            .setDescription(this.question);

        if (this.images) embed.setImage(this.images[0]) // can only display first image
        return embed;
    }

    // Display problem as a message
    createMessage(date?: string): MessageOptions {
        // convert images into attached files
        const imageAttachments = this.images?.map((url, ind) => ({
            attachment: url,
            name: `image${ind}.png`
        })) as FileOptions[] | undefined;

        return {
            content: `**Problem of the Day${date ? " "+date : ""}**\n${this.question}`,
            files: imageAttachments
        };
    }
}
