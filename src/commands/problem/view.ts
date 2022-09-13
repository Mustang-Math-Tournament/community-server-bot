
// Command to show a problem given the ID, or show the current problem.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { generateLatex } from "../../generateLatex";
import { getProblem, getUnfinished } from "../../stores/problemQueue";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const showAnswer = inter.options.getBoolean("showanswer", false) ?? false;

    const problemId = inter.options.getInteger("problemid", true);
    const problemFin = getProblem(problemId);
    if (!problemFin) {
        const problemUnfin = getUnfinished(problemId);
        if (!problemUnfin) {
            await inter.reply({ content: "No problem with this id found.", ephemeral: true });
        } else {
            const imageBuffer = await generateLatex(problemUnfin.question, showAnswer ? problemUnfin.answer : null, problemUnfin.image == undefined ? null : problemUnfin.image);
            await inter.reply({
                content: "Mustang Math: Problem of the Day"
            });

            await inter?.channel?.send({
                files: [{
                    attachment: imageBuffer,
                    name: "problem.png"
                }]
            });
        }
        return;
    }

    const imageBuffer = await generateLatex(problemFin.question, showAnswer ? problemFin.answer : null, problemFin.image == undefined ? null : problemFin.image);
    await inter.reply({
        content: "Mustang Math: Problem of the Day"
    });

    await inter?.channel?.send({
        files: [{
            attachment: imageBuffer,
            name: "problem.png"
        }]
    });
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("view")
    .setDescription("View a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to edit.")
        .setRequired(true))
    .addBooleanOption(opt => opt
        .setName("showanswer")
        .setDescription("Whether or not to show the answer. Default false."));

export const commandView = new Subcommand({
    name: "view",
    exec,
    slash
});
