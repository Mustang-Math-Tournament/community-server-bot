
// Overarching command for problems

import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../Command";
import { commandAdd } from "./add";
import { commandEdit } from "./edit";
import { commandView } from "./view";
import { commandFinish } from "./finish";
import { commandUnfinish } from "./unfinish";

const slash = new SlashCommandBuilder()
    .setName("problem")
    .setDescription("Overall command for problems")
    .addSubcommand(commandAdd.slash)
    .addSubcommand(commandView.slash)
    .addSubcommand(commandFinish.slash)
    .addSubcommand(commandUnfinish.slash)
    .addSubcommandGroup(commandEdit.slash)

export const commandProblem = new Command({
    name: "problem",
    slashJSON: slash.toJSON(),
    subcommands: [commandAdd, commandView, commandFinish, commandUnfinish],
    subcommandGroups: [commandEdit]
});
