
// Schedules and executes the release of the problem.

import { Client } from "discord.js";
import { getShown, getTopProblem, removeTopProblem, setShown } from "./problemQueue";
import { getSetting } from "./settings";
import Schedule from "node-schedule";

let scheduledJobs: { [key: string]: Schedule.Job } = {};

async function errorInAdminChannel(client: Client, guildId: string, err: string) {
    const adminChannelId = getSetting(guildId, "adminChannelId");
    if (!adminChannelId) return;
    const channel = await client.channels.fetch(adminChannelId);
    if (!channel || !channel.isText()) return;
    channel.send(err);
    return;
}

export async function releaseProblem(client: Client, guildId: string) {
    const oldProblem = getShown();
    if (oldProblem) {
        // updateLeaderboard()
        // addToArchive()
        setShown(null);
    }

    const newProblem = getTopProblem();
    if (!newProblem) {
        // no new problems
        await errorInAdminChannel(client, guildId, "Error: There is no problem in the queue for today!");
        return;
    }

    const announceChannelId = getSetting(guildId, "announceChannelId");
    if (!announceChannelId) {
        await errorInAdminChannel(client, guildId, "Error: There is no announcement channel set for this server!");
        return;
    }

    const announceChannel = await client.channels.fetch(announceChannelId);
    if (!announceChannel || !announceChannel.isText()) {
        await errorInAdminChannel(client, guildId, "Error: Announcement channel with id `"+announceChannelId+"` does not exist!");
        return;
    }

    announceChannel.send(newProblem.createMessage());
    setShown(newProblem);
    removeTopProblem();
}

export function setScheduler(client: Client, guildId: string) {
    const guildSchedule = getSetting(guildId, "schedule");
    if (!guildSchedule) {
        throw new Error("Guild schedule needs to be set first!");
    }

    if (scheduledJobs[guildId]) {
        scheduledJobs[guildId] = Schedule.rescheduleJob(scheduledJobs[guildId], guildSchedule);
    } else {
        scheduledJobs[guildId] = Schedule.scheduleJob(guildSchedule, () => releaseProblem(client, guildId));
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
