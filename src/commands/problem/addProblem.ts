
// Add problem command.

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Command } from "../../Command";
import { Problem } from "../../Problem";
import { addUnfinished } from "../../stores/problemQueue";

async function execAddProblem(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const newProblem = new Problem({});
    addUnfinished(newProblem);
    inter.reply("Created a new problem with id `"+newProblem.id+"`. Edit it with /editproblem.");
}

const slash = new SlashCommandBuilder()
    .setName("addproblem")
    .setDescription("Add a new problem.")

const commandAddProblem = new Command({
    name: "addproblem",
    exec: execAddProblem,
    slashJSON: slash.toJSON()
});

export default commandAddProblem;
