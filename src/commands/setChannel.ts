
// Set the channel where the bot takes admin commands.

import { GuildChannel, Message, Permissions } from "discord.js";
import { Command } from "../Command";
import { setSetting } from "../settings";

type ChannelType = "admin" | "announce";
type ChannelArgumentType = "adminChannelId" | "announceChannelId";

async function setChannel(msg: Message, text: string, type: ChannelType) {
    if (!msg.member || !msg.guild || !msg.channel.isText()) {
        msg.channel.send("You can only run this command in a server text channel.");
        return;
    }

    if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        msg.channel.send("You must have the Manage Server permission to run this command.");
    }

    if (text === "") {
        msg.channel.send("Provide the id of the channel as an argument, or use command `setchannel "+type+" here` to set this as the "+type+"channel.");
        return;
    }

    let resChannel;
    if (text === "here") {
        resChannel = msg.channel;
    } else {
        try {
            resChannel = await msg.guild.channels.fetch(text);
        } catch (err) {} // handled in next if block
        if (!resChannel) {
            msg.channel.send("Could not find channel with that id. Use command `setchannel "+type+" here` to set this channel as the "+type+" channel.");
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

    setSetting(msg.guild.id, type+"ChannelId" as ChannelArgumentType, resChannel.id);
    msg.channel.send(`Set \`${resChannel.name}\` to be the ${type} channel.`);
}

const cmdSetAdminChannel = new Command({
    name: "Set Admin Channel",
    description: "Set the admin channel.",
    aliases: ["admin"],
    exec: (msg, text) => setChannel(msg, text, "admin")
});

const cmdSetAnnounceChannel = new Command({
    name: "Set Announce Channel",
    description: "Set the announce channel.",
    aliases: ["announce"],
    exec: (msg, text) => setChannel(msg, text, "announce")
});

const commandSetChannel = new Command({
    name: "Set Admin Channel",
    description: "Sets the special channels in the server. Arguments: `admin`, `announce`",
    aliases: ["setchannel"],
    exec: (msg, text) => msg.channel.send("Please use `admin` or `announce` to set the respective channel ids."),
    subcommands: [cmdSetAdminChannel, cmdSetAnnounceChannel]
});

export default commandSetChannel;