import { Client, CommandInteraction } from "discord.js";
import { getSetting } from "./stores/settings";

// Verifies if a message is sent in a guild channel.
// Sends the error message if sendError is true
export function verifyAdmin(inter: CommandInteraction, sendError: boolean): inter is CommandInteraction<"cached"> {
    if (!inter.inCachedGuild()) {
        if (sendError) inter.reply({ content: "You can only run this command in a server.", ephemeral: true });
        return false;
    }
    const setting = getSetting(inter.guildId, "channels", "admin");
    if (!setting) {
        if (sendError) inter.reply({ content: "The admin channel for this server is not set. Use command `setchannel` to set it.", ephemeral: true });
        return false;
    }
    if (setting !== inter.channelId) {
        if (sendError) inter.reply({ content: "This command can only be used in the admin channel.", ephemeral: true });
        return false;
    }
    return true;
}

export async function errorInAdminChannel(client: Client, guildId: string, err: string) {
    const adminChannelId = getSetting(guildId, "channels", "admin") as string | undefined;
    if (!adminChannelId) return;
    const channel = await client.channels.fetch(adminChannelId);
    if (!channel || !channel.isText()) return;
    channel.send(err);
    return;
}
