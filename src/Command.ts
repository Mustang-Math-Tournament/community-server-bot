
// See https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups for how the layout works.

import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
import { CommandInteraction } from "discord.js";

interface CommandOptions {
    name: string; // Name of the command - must be same as slash
    subcommands?: Subcommand[];
    subcommandGroups?: SubcommandGroup[];
    exec?: (inter: CommandInteraction) => Promise<void>; // Function to execute without subcommands
    slashJSON: RESTPostAPIApplicationCommandsJSONBody; // The slash command representing this command, converted to JSON
}

export class Command {
    name: string;
    subcommands: Subcommand[];
    subcommandGroups: SubcommandGroup[];
    exec?: (inter: CommandInteraction) => Promise<void>; // this is ignored if there are subcommands
    slashJSON: RESTPostAPIApplicationCommandsJSONBody;

    constructor(opts: CommandOptions) {
        this.name = opts.name;
        this.slashJSON = opts.slashJSON;
        this.exec = opts.exec;
        this.subcommands = opts.subcommands ?? [];
        this.subcommandGroups = opts.subcommandGroups ?? [];
    }

    async checkExecute(inter: CommandInteraction) {
        if (inter.commandName !== this.name) return;

        const subcommandGroupName = inter.options.getSubcommandGroup(false);
        if (subcommandGroupName) {
            for (const cmdGroup of this.subcommandGroups) {
                if (cmdGroup.name === subcommandGroupName) {
                    await cmdGroup.checkExecute(inter);
                    return;
                }
            }
            throw "No subcommand group with name " + subcommandGroupName;
        }

        const subcommandName = inter.options.getSubcommand(false);
        if (subcommandName) {
            for (const cmd of this.subcommands) {
                if (cmd.name === subcommandName) {
                    await cmd.exec(inter);
                    return;
                }
            }
            throw "No subcommand with name " + subcommandName;
        }

        if (!this.exec) {
            throw "No execute function on command " + this.name;
        }

        await this.exec(inter);
    }
}

interface SubcommandOptions {
    name: string;
    exec: (inter: CommandInteraction) => Promise<void>;
    slash?: any;
}

export class Subcommand {
    name: string;
    exec: (inter: CommandInteraction) => Promise<void>;
    slash?: any; // any since slash command builders have weird typings. just use "as" to cast

    constructor(opts: SubcommandOptions) {
        this.name = opts.name;
        this.exec = opts.exec;
        this.slash = opts.slash;
    }
}

interface SubcommandGroupOptions {
    name: string;
    subcommands: Subcommand[];
    slash?: any;
}

export class SubcommandGroup {
    name: string;
    subcommands: Subcommand[];
    slash?: any; // any since slash command builders have weird typings. just use "as" to cast

    constructor(opts: SubcommandGroupOptions) {
        this.name = opts.name;
        this.subcommands = opts.subcommands;
        this.slash = opts.slash;
    }

    async checkExecute(inter: CommandInteraction) {
        const subcommandName = inter.options.getSubcommand(false);
        if (subcommandName) {
            for (const cmd of this.subcommands) {
                if (cmd.name === subcommandName) {
                    await cmd.exec(inter);
                    return;
                }
            }
            throw "No subcommand with name " + subcommandName + " in group " + this.name;
        }
        throw "Somehow trying to execute a subcommand group";
    }
}
