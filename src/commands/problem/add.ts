
// Add problem command.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { Problem } from "../../Problem";
import { addUnfinished } from "../../stores/problemQueue";

async function execAddProblem(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const newProblem = new Problem({});
    addUnfinished(newProblem);
    inter.reply("Created a new problem with id `" + newProblem.id + "`. Edit it with /problem edit.");
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a new problem.");

export const commandAdd = new Subcommand({
    name: "add",
    exec: execAddProblem,
    slash: slash
});
