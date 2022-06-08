
// Edit a problem given its id.
// TODO: support slash commands

import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../Command";
import commandQuestion from "./edit/question";

const slash = new SlashCommandBuilder()
    .setName("editproblem")
    .setDescription("Edit a problem.")
    .addSubcommand(commandQuestion.slash);

const commandEditProblem = new Command({
    name: "editproblem",
    slashJSON: slash.toJSON(),
    subcommands: [commandQuestion]
});

export default commandEditProblem;
