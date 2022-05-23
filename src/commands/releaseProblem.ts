
// Command to release a problem immediately.

import { Message } from "discord.js";
import { verifyAdmin } from "../checkPermissions";
import { Command } from "../Command";
import { releaseProblem } from "../scheduler";

async function forceReleaseProblem(msg: Message, text: string) {
    // verify admin
    if (!msg.member || !msg.guild) {
        msg.channel.send("You can only run this command in a server.");
        return;
    }
    if (!verifyAdmin(msg, true)) return;

    if (text.toLowerCase() !== "yes") {
        msg.channel.send("Are you sure you want to release this problem now? Send command `releaseproblem yes` if so.");
        return;
    }

    await releaseProblem(msg.client, msg.guild.id);
    msg.channel.send("Successfully released problem");
}

const commandReleaseProblem = new Command({
    name: "Release Problem",
    description: "Immediately release a problem. Note that the schedule still continues as usual.",
    exec: forceReleaseProblem,
    aliases: ["releaseproblem"]
});

export default commandReleaseProblem;
