
// Overarching command for problems

import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../Command";
import { commandAdd } from "./add";
import commandEdit from "./edit";

const slash = new SlashCommandBuilder()
    .setName("problem")
    .setDescription("Overall command for problems")
    .addSubcommand(commandAdd.slash)
    .addSubcommandGroup(commandEdit.slash)

export const commandProblem = new Command({
    name: "problem",
    slashJSON: slash.toJSON(),
    subcommands: [commandAdd],
    subcommandGroups: [commandEdit]
});
