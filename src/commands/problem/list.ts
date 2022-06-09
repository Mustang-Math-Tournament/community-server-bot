
// List the current problems in the queue.

import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Command, Subcommand, SubcommandGroup } from "../../Command";
import Pagination from "../../Pagination";
import { getAllProblems, getAllUnfinished } from "../../stores/problemQueue";

const SNIPPET_LENGTH = 40;
function getSnippet(text: string) {
    if (text.length > SNIPPET_LENGTH) {
        return text.substring(0, SNIPPET_LENGTH-3) + "...";
    }
    return text;
}

async function exec(inter: CommandInteraction, finished: boolean) {
    if (!verifyAdmin(inter, true)) return;

    const problems = finished ? getAllProblems() : getAllUnfinished();
    if (problems.length === 0) {
        await inter.reply("There are no problems in the queue.");
        return;
    }

    new Pagination(inter, {
        rangeMin: 1,
        rangeMax: problems.length,
        displayAmount: 10,
        displayFunc: (start, end) => {
            let str = `Current problems in ${finished ? "finished" : "unfinished"} queue:\n\n`;
            for (let i = start; i <= end; i++) {
                const pb = problems[i-1];
                const qtext = pb.question.length === 0 ? "[no question text]" : getSnippet(pb.question);
                str += `${finished ? i+"." : "-"} id: \`${pb.id}\`; question: ${qtext}\n`;
            }
            return str;
        }
    });
}

const finishedCmd = new Subcommand({
    name: "finished",
    exec: inter => exec(inter, true)
});

const unfinishedCmd = new Subcommand({
    name: "unfinished",
    exec: inter => exec(inter, false)
});

const slash = new SlashCommandSubcommandGroupBuilder()
    .setName("list")
    .setDescription("List all problems in/out of the queue.")
    .addSubcommand(cmd => cmd
        .setName("finished")
        .setDescription("List the finished problems."))
    .addSubcommand(cmd => cmd
        .setName("unfinished")
        .setDescription("List the unfinished problems."));

export const commandList = new SubcommandGroup({
    name: "list",
    slash: slash,
    subcommands: [finishedCmd, unfinishedCmd]
});
