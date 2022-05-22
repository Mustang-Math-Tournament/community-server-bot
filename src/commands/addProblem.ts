
// Add problem command.

import { Message } from "discord.js";
import { isAdmin } from "../checkPermissions";
import { Command } from "../Command";
import { Problem } from "../Problem";
import { addProblem } from "../problemQueue";

type ProblemStep = "question" | "answer";

// Represents a problem that is partially created.
interface PartialProblem {
    step: ProblemStep; // which part of the problem is being waited for
    channel: string; // id of channel the problem is being created in
    problem: Problem;
}

// List of users and their current problem
let users: { [key: string]: PartialProblem } = {};

function execAddProblem(msg: Message, text: string) {
    // verify admin
    if (!msg.member) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!isAdmin(msg.member)) {
        msg.channel.send("You do not have permission to add problems.");
        return;
    }

    const userId = msg.member.id;
    if (!users[userId]) {
        // start a new problem
        msg.channel.send("Creating a new problem. Send the question text, and attach any images.");
    } else {
        // user already has a problem, but make new one
        msg.channel.send("Discarding current problem and creating a new one. Send the question text, and attach any images.");
    }
    users[userId] = { step: "question", channel: msg.channel.id, problem: new Problem({})};
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

            msg.channel.send("Answer recorded. Problem added to queue. ID: `"+partialProblem.problem.id+"`");
            addProblem(partialProblem.problem);
            delete users[userId];
            break;
    }
}

const commandAddProblem = new Command({
    name: "Add Problem",
    description: "Add a new Problem of the Day to the queue.",
    aliases: ["addproblem"],
    exec: execAddProblem,
    needsArgs: false,
    listens: true,
    listenExec: listen
});

export default commandAddProblem;
