
// Procedure to edit problems.
// This is created as a command, but that's only to make it convenient to listen.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Message } from "discord.js";
import { Command } from "./Command";
import { Problem } from "./Problem";
import { addProblem } from "./problemQueue";

type ProblemStep = "question" | "answer";

// Represents a problem that is partially created.
interface PartialProblem {
    step: ProblemStep; // which part of the problem is being waited for
    channel: string; // id of channel the problem is being created in
    toAdd: boolean; // whether or not to add the problem at the end
    problem: Problem;
}

let users: { [key: string]: PartialProblem } = {};

export function getUser(userId: string) {
    return users[userId];
}

export function setUser(userId: string, partial: PartialProblem) {
    users[userId] = partial;
}

function listen(msg: Message) {
    if (!msg.member) return;

    const userId = msg.member.id;
    if (!users[userId]) return;

    const partialProblem = users[userId];
    if (partialProblem.channel !== msg.channelId) return;

    switch (partialProblem.step) {
        case "question":
            partialProblem.problem.question = msg.cleanContent;
            
            const attachments = msg.attachments;
            if (attachments.size > 0) {
                partialProblem.problem.images = Array.from(attachments.values())
                    .filter(x => x.contentType && x.contentType.startsWith("image"))
                    .map(x => x.url);
            }

            msg.channel.send("Question recorded. Now send the answer.");
            partialProblem.step = "answer";
            break;
        case "answer":
            partialProblem.problem.answer = msg.cleanContent;

            msg.channel.send(`Answer recorded. ${partialProblem.toAdd ? "Problem added to queue. " : "Finished editing problem. "}ID: \`${partialProblem.problem.id}\``);
            if (partialProblem.toAdd) addProblem(partialProblem.problem);
            delete users[userId];
            break;
    }
}

function buildSlash() {
    // workaround: make it a subcommand so it isn't added to the command list
    return new SlashCommandSubcommandBuilder();
}

const fakeEditorCommand = new Command({
    name: "problemeditor",
    description: "A fake listening command that allows editing of problems.",
    exec: (()=>{}),
    listens: true,
    listenExec: listen,
    buildSlash
});

export default fakeEditorCommand;
