
// Add problem command.
// TODO: support slash commands

import { SlashCommandBuilder } from "@discordjs/builders";
import { Message } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Command } from "../../Command";
import { Problem } from "../../Problem";
import { getUser, setUser } from "../../problemEditor";

function execAddProblem(msg: Message, text: string) {
    // verify admin
    if (!msg.member) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!verifyAdmin(msg, true)) return;

    const userId = msg.member.id;
    if (!getUser(userId)) {
        // start a new problem
        msg.channel.send("Creating a new problem. Send the question text, and attach any images.");
    } else {
        // user already has a problem, but make new one
        msg.channel.send("Discarding current problem and creating a new one. Send the question text, and attach any images.");
    }
    setUser(userId, { step: "question", channel: msg.channel.id, problem: new Problem({}), toAdd: true });
}

function buildSlash() {
    return new SlashCommandBuilder();
}

const commandAddProblem = new Command({
    name: "Add Problem",
    description: "Add a new Problem of the Day to the queue.",
    aliases: ["addproblem"],
    exec: execAddProblem,
    buildSlash
});

export default commandAddProblem;
