
// Overarching command for problems

import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../Command";
import { commandAdd } from "./add";
import { commandEdit } from "./edit";
import { commandView } from "./view";
import { commandFinish } from "./finish";
import { commandUnfinish } from "./unfinish";
import { commandList } from "./list";
import { commandRemove } from "./remove";

const slash = new SlashCommandBuilder()
    .setName("problem")
    .setDescription("Overall command for problems")
    .addSubcommand(commandAdd.slash)
    .addSubcommand(commandView.slash)
    .addSubcommand(commandFinish.slash)
    .addSubcommand(commandUnfinish.slash)
    .addSubcommand(commandRemove.slash)
    .addSubcommandGroup(commandEdit.slash)
    .addSubcommandGroup(commandList.slash);

export const commandProblem = new Command({
    name: "problem",
    slashJSON: slash.toJSON(),
    subcommands: [commandAdd, commandView, commandFinish, commandUnfinish, commandRemove],
    subcommandGroups: [commandEdit, commandList]
});
