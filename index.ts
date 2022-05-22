import { Client, Intents } from "discord.js";
import { token } from "./config.json";
import { prefix } from "./settings.json";
import commandList from "./src/commandList";
import "./src/problemQueue";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", async () => {
    console.log("Ready!");
});

client.on("messageCreate", (message) => {
    // skip messages from bots
    if (message.author.bot) return;

    const text = message.content;
    console.log("Received", text);

    // run command
    // if no commands match, don't do anything
    if (text.toLowerCase().startsWith(prefix.toLowerCase())) {
        const withoutPrefix = text.slice(prefix.length);
        for (const command of commandList) {
            if (command.matchAlias(withoutPrefix)) {
                command.checkExecute(message, withoutPrefix);
            }
        }
    }

    // run listeners
    for (const command of commandList) {
        command.checkListen(message);
    }
});

client.login(token);
