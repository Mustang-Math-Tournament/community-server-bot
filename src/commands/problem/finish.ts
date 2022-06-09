
// Edit the answer of a problem.
// basically a copy of the question command

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { finalize, getProblem, getUnfinished } from "../../stores/problemQueue";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const problemId = inter.options.getInteger("problemid", true);
    const problemObj = getUnfinished(problemId);
    if (!problemObj) {
        let content: string;
        if (!getProblem(problemId)) { // already finalized
            content = "This problem is already finished. Use `/problem edit unfinish` to unfinalize it."; // TODO: add unfinalize
        } else {
            content = "No problems exist with this id.";
        }
        await inter.reply({ content, ephemeral: true });
        return;
    }

    finalize(problemId);
    await inter.reply({ content: `Finalized problem ${problemId} and added it to the queue.`});
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("finish")
    .setDescription("Finish a problem and add it to the queue.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to finish.")
        .setRequired(true));

export const commandFinish = new Subcommand({
    name: "finish",
    exec,
    slash
});
