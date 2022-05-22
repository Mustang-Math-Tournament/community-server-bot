
// Edit a problem given its id.

import { Message } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Command } from "../../Command";
import { Problem } from "../../Problem";
import { getUser, setUser } from "../../problemEditor";
import { getProblem, isValidProblemId } from "../../problemQueue";

function execEditProblem(msg: Message, text: string) {
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

    const userId = msg.member.id;
    if (!getUser(userId)) {
        msg.channel.send("Editing problem. Send the question text, and attach any images.");
    } else {
        // user already has a problem, but make new one
        msg.channel.send("Discarding current problem and editing a new one. Send the question text, and attach any images.");
    }
    setUser(userId, { step: "question", channel: msg.channel.id, problem: problem, toAdd: false });
}

const commandEditProblem = new Command({
    name: "Edit Problem",
    description: "Edits a problem given its id",
    aliases: ["editproblem"],
    exec: execEditProblem
});

export default commandEditProblem;
