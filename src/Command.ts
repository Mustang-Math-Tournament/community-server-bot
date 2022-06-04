
// See https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups for how the layout works.

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

interface CommandOptions {
    subcommands?: Subcommand[];
    subcommandGroups?: SubcommandGroup[];
    exec?: (inter: CommandInteraction) => void; // Function to execute without subcommands
    slash: SlashCommandBuilder; // The slash command representing this command. This must already have subcommands+groups added to it.
}

export class Command {
    subcommands: Subcommand[];
    subcommandGroups: SubcommandGroup[];
    exec?: (inter: CommandInteraction) => void; // this is ignored if there are subcommands
    slash: SlashCommandBuilder;

    constructor(opts: CommandOptions) {
        this.slash = opts.slash;
        this.exec = opts.exec;
        this.subcommands = opts.subcommands ?? [];
        this.subcommandGroups = opts.subcommandGroups ?? [];
    }

    checkExecute(inter: CommandInteraction) {
        if (inter.commandName !== this.slash.name) return;

        const subcommandGroupName = inter.options.getSubcommandGroup();
        if (subcommandGroupName) {
            for (const cmdGroup of this.subcommandGroups) {
                if (cmdGroup.slash.name === subcommandGroupName) {
                    cmdGroup.checkExecute(inter);
                    return;
                }
            }
            throw "No subcommand group with name "+subcommandGroupName;
        }

        const subcommandName = inter.options.getSubcommand();
        if (subcommandName) {
            for (const cmd of this.subcommands) {
                if (cmd.slash.name === subcommandName) {
                    cmd.exec(inter);
                    return;
                }
            }
            throw "No subcommand with name "+subcommandName;
        }

        if (!this.exec) {
            throw "No execute function on command "+this.slash.name;
        }

        this.exec(inter);
    }
}

interface SubcommandOptions {
    exec: (inter: CommandInteraction) => void;
    slash: SlashCommandSubcommandBuilder;
}

export class Subcommand {
    exec: (inter: CommandInteraction) => void;
    slash: SlashCommandSubcommandBuilder;

    constructor(opts: SubcommandOptions) {
        this.slash = opts.slash;
        this.exec = opts.exec ?? (() => {});
    }
}

interface SubcommandGroupOptions {
    slash: SlashCommandSubcommandGroupBuilder;
    subcommands: Subcommand[];
}

export class SubcommandGroup {
    subcommands: Subcommand[];
    slash: SlashCommandSubcommandGroupBuilder;

    constructor(opts: SubcommandGroupOptions) {
        this.slash = opts.slash;
        this.subcommands = opts.subcommands;
    }

    checkExecute(inter: CommandInteraction) {
        const subcommandName = inter.options.getSubcommand();
        if (subcommandName) {
            for (const cmd of this.subcommands) {
                if (cmd.slash.name === subcommandName) {
                    cmd.exec(inter);
                    return;
                }
            }
            throw "No subcommand with name "+subcommandName+" in group "+this.slash.name;
        }
        throw "Somehow trying to execute a subcommand group";
    }
}
