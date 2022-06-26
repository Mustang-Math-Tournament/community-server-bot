
// Show the results of a problem of the day.

import { Client, ColorResolvable, MessageEmbed } from "discord.js";
import { Problem } from "./Problem";
import { getSetting } from "./stores/settings";
import { errorInAdminChannel } from "./checkPermissions";
import { color1 } from "../settings.json";
import { getProblemUserAnswers } from "./stores/users";
import { calculateScores } from "./calculateScores";

export async function showProblemResults(client: Client, guildId: string, problem: Problem) {
    const resultsChannelId = getSetting(guildId, "channels", "results");
    if (!resultsChannelId) {
        await errorInAdminChannel(client, guildId, "There is no results channel set for this server.");
        return;
    }

    const targetGuild = await client.guilds.fetch(guildId);
    if (!targetGuild) {
        throw "Guild id " + guildId + " does not exist or is inaccessible!";
    }

    const resultsChannel = await targetGuild.channels.fetch(resultsChannelId);
    if (!resultsChannel) {
        await errorInAdminChannel(client, guildId, "Results channel not found.");
        return;
    }
    if (!resultsChannel.isText()) {
        await errorInAdminChannel(client, guildId, "Results channel is not text.");
        return;
    }

    const embed = new MessageEmbed()
        .setColor(color1 as ColorResolvable)
        .setTitle("Problem of the Day Results");
    const embedDesc: string[] = [];

    const answers = getProblemUserAnswers(guildId, problem.id);
    let numCorrect = 0; let fastest: number;
    answers.forEach(ans => {
        if (problem.isCorrect(ans)) {
            numCorrect++;
            if (!fastest || ans.time < fastest) {
                fastest = ans.time;
            }
        }
    });
    embedDesc.push(`${numCorrect} of ${answers.length} people answered correctly.`);
    embed.setDescription(embedDesc.join("\n"));

    const scores = calculateScores(guildId);
    embed.addField("Leaderboard", scores.map(sc => `<@${sc.userId}>: ${sc.userScore}`).slice(0, 10).join("\n"));
    resultsChannel.send({
        embeds: [embed],
        allowedMentions: {
            parse: []
        }
    });
}
