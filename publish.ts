
/* This is a separate script that publishes all the slash commands.
 * Run `npm run publish -- --guild=<GUILD ID>` to publish commands to a certain guild.
 * Run `npm run publish -- --global` to globally publish commands.
     Do not use this in development--it may take up to an hour for commands to be added.
 */

import Minimist from "minimist";
import commandList from "./src/commandList";
import { clientId, token } from "./config.json";
import { REST } from "@discordjs/rest";
import { Routes, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";

const args = Minimist(process.argv);

if (!args.guild && !args.global) {
    console.log("Run `npm run publish -- --guild=<GUILD ID>` to publish commands to a certain guild.\n\
Run `npm run publish -- --global` to globally publish commands (NOT RECOMMENDED FOR DEVELOPMENT).");
} else {
    let guildId: string | null = null;
    if (args.guild) {
        guildId = args.guild;
    } // else global

    const commandsJSON: RESTPostAPIApplicationCommandsJSONBody[] = [];

    for (const command of commandList) {
        const slashCommand = command.getSlash();
        if (slashCommand instanceof SlashCommandBuilder) { // must not be subcommand
            commandsJSON.push(slashCommand.toJSON());
        }
    }

    const rest = new REST({ version: "9" }).setToken(token);
    
    async function sendCommands() {
        try {
            console.log("Started refreshing slash commands.");

            const route = guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);
            await rest.put(
                route,
                { body: commandsJSON }
            );
        } catch (err) {
            console.error(err);
        }
    }

    sendCommands();
}
