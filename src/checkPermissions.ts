import { Channel, GuildChannel, Message, PartialDMChannel } from "discord.js";
import { getSetting } from "./settings";

export function isAdmin(channel: Channel | PartialDMChannel) {
    if (!(channel instanceof GuildChannel)) return false;
    return getSetting(channel.guildId, "adminChannelId") === channel.id;
}

// Verifies if a message is sent in a guild channel.
// Sends the error message if sendError is true
export function verifyAdmin(msg: Message, sendError: boolean) {
    if (!msg.guild) {
        if (sendError) msg.channel.send("You can only run this command in a server.");
        return false;
    }
    const setting = getSetting(msg.guild.id, "adminChannelId");
    if (!setting) {
        if (sendError) msg.channel.send("The admin channel for this server is not set. Use command `setchannel` to set it.");
        return false;
    }
    if (setting !== msg.channelId) {
        if (sendError) msg.channel.send("This command can only be used in the admin channel.");
        return false;
    }
    return true;
}
