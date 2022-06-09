
// Command to release a problem immediately.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../checkPermissions";
import { Subcommand } from "../../Command";
import { releaseProblem } from "../../stores/scheduler";

async function forceReleaseProblem(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const sure = inter.options.getBoolean("areyousure");
    if (!sure) {
        await inter.reply({ content: "Didn't release the problem.", ephemeral: true });
        return;
    }

    await releaseProblem(inter.client, inter.guild.id);
    await inter.reply("Successfully released problem");
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("release")
    .setDescription("Immediately release a problem. Note that the schedule still continues as usual.")
    .addBooleanOption(opt => opt
        .setName("areyousure")
        .setDescription("Are you sure you want to release this? This cannot be undone.")
        .setRequired(true));

export const commandRelease = new Subcommand({
    name: "release",
    slash: slash,
    exec: forceReleaseProblem
});
