
// Example command. Echoes the arguments to the command back.

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../Command";

// BE CAREFUL! If your message contains content from the user, make sure to remove @mentions!
async function echo(inter: CommandInteraction) {
    await inter.reply({ content: inter.options.getString("text"), allowedMentions: { parse: [] } });
}

const slash = new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Echoes the arguments to the command back.")
    .addStringOption(opt => opt.setName("text").setDescription("Text to echo.").setRequired(true));

const commandEcho = new Command({
    name: "echo",
    exec: echo,
    slashJSON: slash.toJSON()
});

export default commandEcho;
