
// Set the schedule of a server.
// TODO: support slash commands

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../checkPermissions";
import { Command } from "../Command";
import { setScheduler } from "../stores/scheduler";
import { setSetting } from "../stores/settings";

async function setSchedule(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const dateText = inter.options.getString("time", true);

    const timeRegex = /^([0-2][0-9]):([0-5][0-9])$/;
    const matches = dateText.match(timeRegex);
    if (!matches) {
        await inter.reply({ content: "Please format release time as 24-hour hh:mm in UTC time zone. Examples: 08:04, 23:59", ephemeral: true });
        return;
    }

    const hours = parseInt(matches[1]), minutes = parseInt(matches[2]);
    if (hours < 0 || hours >= 24 || isNaN(hours) || minutes < 0 || minutes >= 60 || isNaN(minutes)) {
        await inter.reply({ content: "Please format release time as 24-hour hh:mm in UTC time zone. Examples: 08:04, 23:59", ephemeral: true });
        return;
    }

    inter.reply("Set schedule for this server to "+hours+":"+minutes);
    setSetting(inter.guild.id, [hours, minutes], "schedule");
    setScheduler(inter.client, inter.guild.id);
}

const slash = new SlashCommandBuilder()
    .setName("setschedule")
    .setDescription("Set the problem release schedule for this server.")
    .addStringOption(opt => opt
        .setName("time")
        .setDescription("Time of day to release. Format as 24-hour hh:mm in UTC time zone. Examples: 08:04, 23:59")
        .setRequired(true));

export const commandSetSchedule = new Command({
    name: "setschedule",
    exec: setSchedule,
    slashJSON: slash.toJSON()
});
