
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

const args = Minimist(process.argv, { string: "guild" });

if (!args.guild && !args.global) {
    console.log("Run `npm run publish -- --guild=<GUILD ID>` to publish commands to a certain guild.\n\
Run `npm run publish -- --global` to globally publish commands (NOT RECOMMENDED FOR DEVELOPMENT).");
} else {
    let guildId: string | null = null;
    if (args.guild) {
        guildId = args.guild;
        console.log("Adding to guild", guildId);
    } // else global

    const commandsJSON: RESTPostAPIApplicationCommandsJSONBody[] = [];

    for (const command of commandList) {
        commandsJSON.push(command.slashJSON);
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

            console.log("Finished refreshing slash commands.");
        } catch (err) {
            console.error(err);
        }
    }

    sendCommands();
}
