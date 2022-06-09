
// Edit a problem given its id.

import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { SubcommandGroup } from "../../Command";
import { commandQuestion } from "./edit/question";
import { commandAnswer } from "./edit/answer";

const slash = new SlashCommandSubcommandGroupBuilder()
    .setName("edit")
    .setDescription("Edit a problem.")
    .addSubcommand(commandQuestion.slash)
    .addSubcommand(commandAnswer.slash);

export const commandEdit = new SubcommandGroup({
    name: "edit",
    slash: slash,
    subcommands: [commandQuestion, commandAnswer]
});
