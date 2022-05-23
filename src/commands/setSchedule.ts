
// Set the schedule of a server.

import { Message } from "discord.js";
import { verifyAdmin } from "../checkPermissions";
import { Command } from "../Command";
import { setSetting } from "../settings";

function setSchedule(msg: Message, text: string) {
    // verify admin
    if (!msg.member || !msg.guild) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!verifyAdmin(msg, true)) return;

    const timeRegex = /^([0-2][0-9]):([0-5][0-9])$/;
    const matches = text.match(timeRegex);
    if (!matches) {
        msg.channel.send("Please format release time as 24-hour hh:mm. Examples: 08:04, 23:59");
        return;
    }

    const groups = matches.groups;
    if (!groups || !groups[1] || !groups[2]) {
        msg.channel.send("Please format release time as 24-hour hh:mm. Examples: 08:04, 23:59");
        return;
    }

    const hours = parseInt(groups[1]), minutes = parseInt(groups[2]);
    if (hours < 0 || hours >= 24 || isNaN(hours) || minutes < 0 || minutes >= 60 || isNaN(minutes)) {
        msg.channel.send("Invalid time. Please format release time as 24-hour hh:mm. Examples: 08:04, 23:59");
        return;
    }

    const cronSchedule = `${minutes} ${hours} * * *`;
    console.log("Set schedule for", msg.guild.id, "to", cronSchedule);
    setSetting(msg.guild.id, "schedule", cronSchedule);
}

const commandSetSchedule = new Command({
    name: "Set Schedule",
    description: "Set the problem release schedule for this server.",
    aliases: ["setschedule"],
    exec: setSchedule
});

export default commandSetSchedule;
