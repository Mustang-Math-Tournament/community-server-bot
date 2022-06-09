
// Edit the answer of a problem.
// basically a copy of the question command

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { getProblem, getUnfinished, unfinalize } from "../../stores/problemQueue";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const problemId = inter.options.getInteger("problemid", true);
    const problemObj = getProblem(problemId);
    if (!problemObj) {
        let content: string;
        if (getUnfinished(problemId)) {
            content = "This problem is not yet finished. Use `/problem finish` to finalize it."; // TODO: add unfinalize
        } else {
            content = "No problems exist with this id.";
        }
        await inter.reply({ content, ephemeral: true });
        return;
    }

    unfinalize(problemId);
    await inter.reply({ content: `Unfinalized problem ${problemId} and removed it from the queue.` });
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("unfinish")
    .setDescription("Unfinish a problem and remove it from the queue.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to unfinish.")
        .setRequired(true));

export const commandUnfinish = new Subcommand({
    name: "unfinish",
    exec,
    slash
});
