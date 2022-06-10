
// Edit the answer of a problem.
// basically a copy of the question command

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../../checkPermissions";
import { Subcommand } from "../../../Command";
import { getProblem, getUnfinished } from "../../../stores/problemQueue";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const problemId = inter.options.getInteger("problemid", true);
    const problemObj = getUnfinished(problemId);
    if (!problemObj) {
        let content: string;
        if (getProblem(problemId)) { // already finalized
            content = "This problem is already finalized. Use `/problem unfinish` to unfinalize it.";
        } else {
            content = "No problems exist with this id.";
        }
        await inter.reply({ content, ephemeral: true });
        return;
    }

    const newAnswer = inter.options.getString("answer");
    if (!newAnswer) {
        const oldAnswer = problemObj.answer;
        problemObj.answer = "";
        const readAnswer = oldAnswer ? `:\n${oldAnswer}` : " blank.";
        await inter.reply(`Problem ${problemId}'s answer was erased. It previously was${readAnswer}`);
    } else {
        problemObj.answer = newAnswer;
        await inter.reply(`Problem ${problemId}'s answer was updated to:\n${newAnswer}`);
    }
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("answer")
    .setDescription("Add or edit the answer of a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to edit.")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("answer")
        .setDescription("The new text of the answer. If not included, the answer is erased."));

export const commandAnswer = new Subcommand({
    name: "answer",
    exec,
    slash
});
