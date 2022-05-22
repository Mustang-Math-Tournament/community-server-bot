
// Set the channel where the bot takes admin commands.

import { GuildChannel, Message, Permissions } from "discord.js";
import { Command } from "../Command";
import { setSetting } from "../settings";

async function setChannel(msg: Message, text: string) {
    if (!msg.member || !msg.guild || !msg.channel.isText()) {
        msg.channel.send("You can only run this command in a server text channel.");
        return;
    }

    if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        msg.channel.send("You must have the Manage Server permission to run this command.");
    }

    if (text === "") {
        msg.channel.send("Provide the id of the channel as an argument, or use `setchannel here` to set this as the admin channel.");
        return;
    }

    let resChannel;
    if (text === "here") {
        resChannel = msg.channel;
    } else {
        resChannel = await msg.guild.channels.fetch(text);
        if (!resChannel) {
            msg.channel.send("Could not find channel with that id. Use `setchannel here` to set this channel as the admin channel.");
            return;
        }
    }

    if (!resChannel.isText()) {
        msg.channel.send("Channel must be a text channel.");
        return;
    }
    if (!(resChannel instanceof GuildChannel)) {
        msg.channel.send("Channel must be part of a server.");
        return;
    }

    setSetting(msg.guild.id, "adminChannelId", resChannel.id);
    msg.channel.send(`Set \`${resChannel.name}\` to be the admin-only command channel.`);
}

const commandSetChannel = new Command({
    name: "Set Admin Channel",
    description: "Sets the channel in which admin-only commands are able to be sent.",
    aliases: ["setchannel"],
    exec: setChannel
});

export default commandSetChannel;