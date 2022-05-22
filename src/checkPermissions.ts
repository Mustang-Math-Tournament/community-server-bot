import { Channel, GuildChannel, PartialDMChannel } from "discord.js";
import { getSetting } from "./settings";

export function isAdmin(channel: Channel | PartialDMChannel) {
    if (!(channel instanceof GuildChannel)) return false;
    return getSetting(channel.guildId, "adminChannelId") === channel.id;
}
