
// Schedules and executes the release of the problem.

import { Client } from "discord.js";
import { getShown, getTopProblem, removeTopProblem, setShown } from "./problemQueue";
import { getSetting } from "./settings";
import Schedule from "node-schedule";
import { errorInAdminChannel } from "../checkPermissions";
import { showProblemResults } from "../showResults";
import { generateLatex } from "../generateLatex";

const scheduledJobs: { [key: string]: Schedule.Job } = {};

export async function releaseProblem(client: Client, guildId: string) {
    const oldProblem = getShown();
    if (oldProblem) {
        setShown(null);
        showProblemResults(client, guildId, oldProblem);
    }


    const newProblem = getTopProblem();
    if (!newProblem) {
        // no new problems
        await errorInAdminChannel(client, guildId, "Error: There is no problem in the queue for today!");
        return;
    }
    const announceChannelId = getSetting(guildId, "channels", "announce") as string | undefined;
    if (!announceChannelId) {
        await errorInAdminChannel(client, guildId, "Error: There is no announcement channel set for this server!");
        return;
    }

    const announceChannel = await client.channels.fetch(announceChannelId);
    if (!announceChannel || !announceChannel.isText()) {
        await errorInAdminChannel(client, guildId, "Error: Announcement channel with id `" + announceChannelId + "` does not exist!");
        return;
    }

    const imageBuffer = await generateLatex(newProblem.question, newProblem.answer, newProblem.image != undefined ? newProblem.image : null);
    await announceChannel.send({
        content: "Mustang Math: Problem of the Day",
        files: [{
            attachment: imageBuffer,
            name: "problem.png"
        }]
    });
    setShown(newProblem);
    removeTopProblem();

    if (!getTopProblem()) {
        await errorInAdminChannel(client, guildId, "Warning: There is no problem in the queue for tomorrow!");
    }
}

export function setScheduler(client: Client, guildId: string) {
    const guildSchedule = getSetting(guildId, "schedule") as [number, number] | undefined;
    if (!guildSchedule) {
        throw new Error("Guild schedule needs to be set first!");
    }

    const rule = new Schedule.RecurrenceRule();
    rule.tz = "Etc/UTC";
    [rule.hour, rule.minute] = guildSchedule;

    if (scheduledJobs[guildId]) {
        scheduledJobs[guildId] = Schedule.rescheduleJob(scheduledJobs[guildId], rule);
    } else {
        scheduledJobs[guildId] = Schedule.scheduleJob(rule, () => releaseProblem(client, guildId));
    }
}

export async function setAllSchedules(client: Client) {
    // searches for all guilds and sets their schedules
    const allOauthGuilds = await client.guilds.fetch();
    const allIds = Array.from(allOauthGuilds.keys());
    for (const guildId of allIds) {
        if (!getSetting(guildId, "schedule")) continue;
        setScheduler(client, guildId);
    }
}
