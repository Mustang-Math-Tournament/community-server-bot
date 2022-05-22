
// Command to show a problem given the ID, or show the current problem.

import { Message } from "discord.js";
import { isAdmin, verifyAdmin } from "../checkPermissions";
import { Command } from "../Command";
import { Problem } from "../Problem";
import { getProblem, getTopProblem } from "../problemQueue";

function showProblem(msg: Message, text: string) {
    // verify admin
    if (!msg.member) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!verifyAdmin(msg, true)) return; 
    
    let problem: Problem;
    if (text === "") {
        const pb = getTopProblem();
        if (!pb) {
            msg.channel.send("There are no problems in the queue.");
            return;
        }
        problem = pb;
    } else if (!isNaN(parseInt(text))) {
        const num = parseInt(text);
        const pb = getProblem(num);
        if (!pb) {
            msg.channel.send("Could not find a problem with that id.");
            return;
        }
        problem = pb;
    } else {
        msg.channel.send("Id must be numeric.");
        return;
    }

    msg.channel.send(problem.createMessage());
}

const commandShowProblem = new Command({
    name: "Show Problem",
    description: "Show a problem, with an id if given, or the first problem otherwise.",
    aliases: ["showproblem"],
    exec: showProblem
});

export default commandShowProblem;