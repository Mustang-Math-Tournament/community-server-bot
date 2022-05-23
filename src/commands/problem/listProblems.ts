
// List the current problems in the queue.

import { Message } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Command } from "../../Command";
import Pagination from "../../Pagination";
import { getAllProblems } from "../../problemQueue";

const SNIPPET_LENGTH = 40;
function getSnippet(text: string) {
    if (text.length > SNIPPET_LENGTH) {
        return text.substring(0, SNIPPET_LENGTH-3) + "...";
    }
    return text;
}

function listProblems(msg: Message, text: string) {
    // verify admin
    if (!msg.member) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!verifyAdmin(msg, true)) return;

    const problems = getAllProblems();
    if (problems.length === 0) {
        msg.channel.send("There are no problems in the queue.");
        return;
    }

    new Pagination(msg, {
        rangeMin: 1,
        rangeMax: problems.length,
        displayAmount: 10,
        displayFunc: (start, end) => {
            let str = "Current problems in queue:\n\n";
            for (let i = start; i <= end; i++) {
                const pb = problems[i-1];
                const qtext = pb.question.length === 0 ? "[no question text]" : getSnippet(pb.question);
                str += `${i}. id: \`${pb.id}\`; question: ${qtext}\n`;
            }
            return str;
        }
    });
}

const commandListProblems = new Command({
    name: "List Problems",
    description: "List problems currently in the queue.",
    aliases: ["listproblems"],
    exec: listProblems
});

export default commandListProblems;
