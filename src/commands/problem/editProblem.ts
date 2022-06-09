
// Edit a problem given its id.

import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../Command";
import commandQuestion from "./edit/question";
import commandAnswer from "./edit/answer";

const slash = new SlashCommandBuilder()
    .setName("editproblem")
    .setDescription("Edit a problem.")
    .addSubcommand(commandQuestion.slash)
    .addSubcommand(commandAnswer.slash);

const commandEditProblem = new Command({
    name: "editproblem",
    slashJSON: slash.toJSON(),
    subcommands: [commandQuestion, commandAnswer]
});

export default commandEditProblem;
