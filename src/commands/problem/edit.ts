
// Edit the problem based on input id

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { editUnfinished, getProblem, getUnfinished } from "../../stores/problemQueue";
import { generateLatex } from "../../generateLatex";
import { Problem } from "../../Problem";

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

    const existingProblemInformation = getProblem(problemId);
    let question = inter.options.getString("question");
    let answer = inter.options.getString("answer");
    let image = null;

    try {
        const imageUrl = inter.options.getAttachment("attachment");
        if (imageUrl && imageUrl != undefined) {
            image = imageUrl.proxyURL;
        }
    } catch (e) {
        image = null;
    }

    if (!question && existingProblemInformation) {
        question = existingProblemInformation.question;
    }

    if (!answer && existingProblemInformation) {
        answer = existingProblemInformation.answer;
    }

    if (image != "" && existingProblemInformation && existingProblemInformation.image) {
        image = existingProblemInformation.image;
    }

    const editedProblem = new Problem({
        question: question ?? "",
        answer: answer ?? "",
        id: problemId,
        image: image ?? "",
        finished: false
    });
    editUnfinished(editedProblem);

    await inter.reply({
        content: "Mustang Math: Problem of the Day"
    });

    try {
        const imageBuffer = await generateLatex(question, answer, image);
        await inter?.channel?.send({
            files: [{
                attachment: imageBuffer,
                name: "problem.png"
            }]
        });
    } catch (e) {
        await inter?.channel?.send({
            content: "Error to send problem preview!"
        });
    }
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
        .setDescription("The new text of the question. If not included, previous value of question will be used."))
    .addStringOption(opt => opt
        .setName("answer")
        .setDescription("The new text of the answer. If not included, previous value of answer will be used."))
    .addAttachmentOption(opt => opt
        .setName("attachment")
        .setDescription("The new attachment. If not included, previous attachments will be used."));

export const commandEdit = new Subcommand({
    name: "edit",
    exec: exec,
    slash: slash
});
