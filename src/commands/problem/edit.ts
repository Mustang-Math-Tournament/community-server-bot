
// Edit the problem based on input id

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { getProblem, getUnfinished } from "../../stores/problemQueue";
import { generateLatex } from "../../generateLatex";

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
        await inter.channel?.send({ content });
        return;
    }

    const question = inter.options.getString("question");
    const answer = inter.options.getString("answer");
    const attachment = inter.options.getAttachment("attachment");

    const imageBuffer = await generateLatex(question ?? "", answer ?? "", attachment ?? null);

    inter.reply({ content: "Mustang Math: Problem of the Day" });

    await inter.channel?.send({
        files: [{
            attachment: imageBuffer,
            name: "problem.png"
        }]
    });
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("edit")
    .setDescription("Edit a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to edit.")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("question")
        .setDescription("The new text of the question. If not included, the question is erased."))
    .addStringOption(opt => opt
        .setName("answer")
        .setDescription("The new text of the answer. If not included, the answer is erased."))
    .addAttachmentOption(opt => opt
        .setName("attachment")
        .setDescription("The new attachment. If not included, the attachments are erased."));

export const commandEdit = new Subcommand({
    name: "edit",
    exec: exec,
    slash: slash
});
