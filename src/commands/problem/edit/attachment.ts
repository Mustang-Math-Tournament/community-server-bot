
// Edit the attachment of a problem.

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { verifyAdmin } from "../../../checkPermissions";
import { Subcommand } from "../../../Command";
import { getProblem, getUnfinished } from "../../../stores/problemQueue";

async function exec(inter: CommandInteraction) {
    if (!verifyAdmin(inter, true)) return;

    const problemId = inter.options.getInteger("problemid", true);
    const problemObj = getUnfinished(problemId);
    if (!problemObj) {
        let content: string;
        if (getProblem(problemId)) { // already finalized
            content = "This problem is already finalized. Use `/problem unfinish` to unfinalize it.";
        } else {
            content = "No problems exist with this id.";
        }
        await inter.reply({ content, ephemeral: true });
        return;
    }

    const newAttachment = inter.options.getAttachment("attachment");
    if (!newAttachment) {
        const oldAttachment = problemObj.images ? problemObj.images[0] : "";
        problemObj.images = [];
        const readAttachment = oldAttachment ? `:\n${oldAttachment}` : " blank.";
        await inter.reply(`Problem ${problemId}'s attachment was erased. It previously was${readAttachment}`);
    } else if (!newAttachment.contentType?.startsWith("image")) {
        await inter.reply({ content: "Attachment must be an image.", ephemeral: true });
    } else {
        problemObj.images = [newAttachment.url];
        await inter.reply(`Problem ${problemId}'s attachment was updated to:\n${newAttachment.url}`);
    }
}

const slash = new SlashCommandSubcommandBuilder()
    .setName("attachment")
    .setDescription("Add or edit the attachment of a problem.")
    .addIntegerOption(opt => opt
        .setName("problemid")
        .setDescription("The id of the problem to edit.")
        .setRequired(true))
    .addAttachmentOption(opt => opt
        .setName("attachment")
        .setDescription("The new attachment. If not included, the attachments are erased."));

export const commandAttachment = new Subcommand({
    name: "attachment",
    exec,
    slash
});
