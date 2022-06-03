
// Remove a problem.
// TODO: support slash commands

import { SlashCommandBuilder } from "@discordjs/builders";
import { Message } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Command } from "../../Command";
import { getProblem, removeProblem } from "../../problemQueue";

function execRemoveProblem(msg: Message, text: string) {
    // verify admin
    if (!msg.member) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!verifyAdmin(msg, true)) return;

    const problem = getProblem(parseInt(text));
    if (!problem) {
        msg.channel.send("Invalid problem id.");
        return;
    }
    removeProblem(problem.id);
    msg.channel.send("Successfully removed problem.");
}

function buildSlash() {
    return new SlashCommandBuilder();
}

const commandRemoveProblem = new Command({
    name: "removeproblem",
    description: "Remove a problem from the queue by id.",
    exec: execRemoveProblem,
    buildSlash
});

export default commandRemoveProblem;
