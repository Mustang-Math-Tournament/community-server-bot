
// Example command. Echoes the arguments to the command back.

import { Message } from "discord.js";
import { Command } from "../Command";

// BE CAREFUL! If your message contains content from the user, make sure to remove @mentions!
function echo(msg: Message, text: string) {
    msg.channel.send({ content: text, allowedMentions: { parse: []} });
}

const commandEcho = new Command({
    name: "Echo",
    description: "Echoes the arguments to the command back.",
    aliases: ["echo"],
    exec: echo,
    needsArgs: true
});

export default commandEcho;
