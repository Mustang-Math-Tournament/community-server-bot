
// Submit an answer to a problem.

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getShown } from "../stores/problemQueue";
import { Command } from "../Command";
import { getSenderUser } from "../stores/users";
import { ProblemAnswer } from "../Problem";

async function execAnswer(inter: CommandInteraction) {
    if (!inter.inCachedGuild()) {
        await inter.reply({ content: "This command must be run in a guild.", ephemeral: true });
        return;
    }

    const shown = getShown();
    if (!shown) {
        await inter.reply({ content: "There is currently no problem of the day.", ephemeral: true });
        return;
    }

    const user = getSenderUser(inter);
    if (user.answers.find(x => x.problemId === shown.id)) {
        await inter.reply({ content: "You have already answered today's problem.", ephemeral: true });
        return;
    }

    const answer = inter.options.getString("answer", true);
    user.answers.push(new ProblemAnswer({
        answer,
        userId: user.id,
        problemId: shown.id,
        time: new Date().getTime()
    }));
    await inter.reply({ content: "Your answer has been submitted.", ephemeral: true });
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
