
// Class file for the Command class.
// A Command stores the information for commands and can execute them.
// Commands are case insensitive.

import { Message } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

interface CommandOptions {
    name: string; // Name of the command.
    description: string; // Description of the command.
    aliases: string[]; // List of names that can be used to call the command.
    subcommands?: Command[]; // Subcommands for this command.

    // Function that is executed when command is called and it doesn't match a subcommand.
    // msg is the Message object of the sent command, text is the remaining part of the command.
    // Example: for the command "!test hello 123", text will be "hello 123"
    exec: (msg: Message, text: string) => any;

    needsArgs?: boolean; // Whether or not this command needs arguments (text is not empty). Default false.

    listens?: boolean; // Whether or not this command listens to all sent messages. Default false.
    listenExec?: (msg: Message) => any; // Function that executes on every message while listening.
}

export class Command {
    name: string;
    aliases: string[];
    subcommands: Command[];
    exec: (msg: Message, text: string) => any;
    needsArgs: boolean;
    listens: boolean;
    listenExec: (msg: Message) => any;

    constructor(opts: CommandOptions) {
        this.name = opts.name;
        this.aliases = opts.aliases.map(x => x.toLowerCase()); // case insensitive
        this.subcommands = opts.subcommands ?? [];
        this.exec = opts.exec;
        this.needsArgs = opts.needsArgs ?? false;
        this.listens = opts.listens ?? false;
        this.listenExec = opts.listenExec ?? (()=>{});
    }

    // Checks if text is a valid form of this command.
    matchAlias(text: string): boolean {
        if (text === "") return false;
        const firstWord = text.split(" ")[0];
        return this.aliases.includes(firstWord.toLowerCase());
    }

    // Checks for matching subcommands, and executes the command if none found.
    // text can still include the command alias.
    checkExecute(msg: Message, text: string) {
        // remove command word
        let splitText = text.split(" ");
        if (splitText.length > 0 && this.aliases.includes(splitText[0].toLowerCase())) {
            splitText = splitText.splice(1);
        }
        let newText = splitText.join(" ");

        let foundSubcommand = false;
        for (const subcommand of this.subcommands) {
            if (subcommand.matchAlias(newText)) {
                subcommand.checkExecute(msg, newText);
                foundSubcommand = true;
                break;
            }
        }

        if (!foundSubcommand) {
            if (this.needsArgs && newText.length === 0) {
                msg.channel.send("Error: you must include arguments for this command.");
            } else {
                this.exec(msg, newText);
            }
        }
    }

    // Executes the listen function when receiving command, and propagates it to the subcommands.
    checkListen(msg: Message) {
        for (const subcommand of this.subcommands) {
            subcommand.checkListen(msg);
        }
        if (this.listens) this.listenExec(msg);
    }

    // Get the slash command for registration.
    getSlash() {
        return new SlashCommandBuilder(); // TODO: actually create it
    }
}
