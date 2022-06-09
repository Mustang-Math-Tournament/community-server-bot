
// Edit the answer of a problem.
// basically a copy of the question command

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { getProblem, getUnfinished, removeUnfinished } from "../../stores/problemQueue";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const problemId = inter.options.getInteger("problemid", true);
    const problemObj = getUnfinished(problemId);
    if (!problemObj) {
        let content: string;
        if (getProblem(problemId)) { // already finalized
            content = "This problem is already finished and cannot be directly removed. Use `/problem unfinish` to unfinalize it first, if you are sure.";
        } else {
            content = "No problems exist with this id.";
        }
        await inter.reply({ content, ephemeral: true });
        return;
    }

    removeUnfinished(problemId);
    await inter.reply(`Removed problem ${problemId}. It used to be:\n${problemObj.createMessage().content}`);
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to remove.")
        .setRequired(true));

export const commandRemove = new Subcommand({
    name: "remove",
    exec,
    slash
});
