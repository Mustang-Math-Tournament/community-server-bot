
// Example command. Echoes the arguments to the command back.
// TODO: support slash commands

import { SlashCommandBuilder } from "@discordjs/builders";
import { Message } from "discord.js";
import { Command } from "../Command";

// BE CAREFUL! If your message contains content from the user, make sure to remove @mentions!
function echo(msg: Message, text: string) {
    msg.channel.send({ content: text, allowedMentions: { parse: []} });
}

function buildSlash() {
    return new SlashCommandBuilder();
}

const commandEcho = new Command({
    name: "echo",
    description: "Echoes the arguments to the command back.",
    exec: echo,
    needsArgs: true,
    buildSlash
});

export default commandEcho;
