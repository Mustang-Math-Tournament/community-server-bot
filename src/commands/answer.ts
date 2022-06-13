
// Submit an answer to a problem.

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getShown } from "../stores/problemQueue";
import { Command } from "../Command";

async function execAnswer(inter: CommandInteraction) {
    if (inter.inGuild()) {
        await inter.reply({ content: "This command must be run in a DM!", ephemeral: true });
        return;
    }

    const shown = getShown();
    if (!shown) {
        await inter.reply({ content: "There is currently no problem of the day!", ephemeral: true });
        return;
    }

    const answer = inter.options.getString("answer", true);
    if (answer.trim().toLowerCase() === shown.answer.trim().toLowerCase()) {
        // replace this later, just for testing
        await inter.reply({ content: "Correct answer!", ephemeral: true });
        return;
    } else {
        await inter.reply({ content: "Incorrect answer!", ephemeral: true });
    }
}

const slash = new SlashCommandBuilder()
    .setName("answer")
    .setDescription("Answer the current problem of the day.")
    .addStringOption(opt => opt
        .setName("answer")
        .setDescription("Your answer.")
        .setRequired(true));

export const commandAnswer = new Command({
    name: "answer",
    slashJSON: slash.toJSON(),
    exec: execAnswer
});
