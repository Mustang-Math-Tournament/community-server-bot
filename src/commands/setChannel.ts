
// Set the channel where the bot takes admin commands.

import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v9";
import { CommandInteraction, GuildBasedChannel } from "discord.js";
import { Command } from "../Command";
import { setSetting } from "../settings";

const CHANNEL_TYPES = ["admin", "announce"];
export type SpecialChannelType = (typeof CHANNEL_TYPES)[number]; // convert to union

async function setChannel(inter: CommandInteraction) {
    if (!inter.member || !inter.guild || !inter.channel?.isText()) {
        await inter.reply({ content: "You can only run this command in a server text channel.", ephemeral: true });
        return;
    }

    /*if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        msg.channel.send("You must have the Manage Server permission to run this command.");
        return;
    }*/ // TODO: relegate permissions check to slash command

    const apiChannel = inter.options.getChannel("channel", true);
    let resChannel: GuildBasedChannel;
    if ("permissions" in apiChannel) { // need to check if it's the raw API data
        const fetchedChannel = await inter.client.channels.fetch(apiChannel.id) as GuildBasedChannel;
        if (!fetchedChannel) {
            await inter.reply({ content: "You can only run this command in a server text channel.", ephemeral: true });
            return;
        }
        resChannel = fetchedChannel;
    } else {
        resChannel = apiChannel;
    }

    if (!resChannel.isText()) {
        await inter.reply({ content: "Channel must be a text channel.", ephemeral: true });
        return;
    }

    const channelType = inter.options.getString("channeltype", true);
    if (!CHANNEL_TYPES.includes(channelType)) {
        await inter.reply({ content: "Invalid channel type.", ephemeral: true });
        return;
    }

    setSetting(resChannel.guildId, resChannel.id, "channels", channelType); // maybe unnecessary due to pass-by-reference

    await inter.reply({ content: `Set \`${resChannel.name}\` to be the ${channelType} channel.` });
    return;
}

const slashSetChannel = new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Sets the special channels in the server.")
    .addStringOption(opt => 
        opt.setName("channeltype")
            .setDescription("The type of special channel to change.")
            .setRequired(true)
            .addChoices(...CHANNEL_TYPES.map(ct => ({
                name: ct,
                value: ct
            }))))
    .addChannelOption(opt => 
        opt.setName("channel")
            .setDescription("The channel to set as the new special channel.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText));

const commandSetChannel = new Command({
    name: "setchannel",
    exec: setChannel,
    slashJSON: slashSetChannel.toJSON()
});

export default commandSetChannel;