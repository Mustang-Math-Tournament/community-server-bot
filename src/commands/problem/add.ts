
// Add problem

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { addUnfinished } from "../../stores/problemQueue";
import { generateLatex } from "../../generateLatex";
import { Problem } from "../../Problem";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const question = inter.options.getString("question");
    const answer = inter.options.getString("answer");
    let image = null;

    try {
        const imageUrl = inter.options.getAttachment("attachment");
        if (imageUrl && imageUrl != undefined) {
            image = imageUrl.proxyURL;
        }
    } catch (e) {
        image = null;
    }

    const newProblem = new Problem({
        question: question ?? "",
        answer: answer ?? "",
        image: image ?? "",
        finished: false
    });
    addUnfinished(newProblem);

    const imageBuffer = await generateLatex(question, answer, image);
    await inter.reply({
        content: "Mustang Math: Problem of the Day"
    });

    await inter?.channel?.send({
        files: [{
            attachment: imageBuffer,
            name: "problem.png"
        }]
    });

    await inter?.channel?.send("Created a new problem with id `" + newProblem.id + "`. Edit it with /problem edit.");
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a problem.")
    .addStringOption(opt => opt
        .setName("question")
        .setDescription("The new text of the question. If not included, previous value of question will be used.")
        .setRequired(true))
    .addStringOption(opt => opt
        .setName("answer")
        .setDescription("The new text of the answer. If not included, previous value of answer will be used.")
        .setRequired(true))
    .addAttachmentOption(opt => opt
        .setName("attachment")
        .setDescription("The new attachment. If not included, previous attachments will be used."));

export const commandAdd = new Subcommand({
    name: "add",
    exec: exec,
    slash: slash
});
