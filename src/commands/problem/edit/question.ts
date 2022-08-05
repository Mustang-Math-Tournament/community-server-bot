
// Edit the question of a problem.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../../checkPermissions";
import { Subcommand } from "../../../Command";
import { getProblem, getUnfinished } from "../../../stores/problemQueue";
import { typeset } from "../../../util/latex.js";

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

    const tex = inter.options.getString("question");
    await typeset(tex).then(async (image: any) => {
        await inter.reply({
            files: [{
                attachment: image,
                name: "problem.png"
            }]
        });
    }).catch(async (err: any) => {
        await inter.reply(err);
    });

    /* const newQuestion = inter.options.getString("question");
    if (!newQuestion) {
        const oldQuestion = problemObj.question;
        problemObj.question = "";
        const readQuestion = oldQuestion ? `:\n${oldQuestion}` : " blank.";
        await inter.reply(`Problem ${problemId}'s question was erased. It previously was${readQuestion}`);
    } else {
        problemObj.question = newQuestion;
        await inter.reply(`Problem ${problemId}'s question was updated to:\n${newQuestion}`);
    }*/
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("question")
    .setDescription("Add or edit the question of a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to edit.")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("question")
        .setDescription("The new text of the question. If not included, the question is erased."));

export const commandQuestion = new Subcommand({
    name: "question",
    exec: exec,
    slash: slash
});
