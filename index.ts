import { Client, Intents } from "discord.js";
import { token } from "./config.json";
import { prefix } from "./settings.json";
import commandList from "./src/commandList";
import "./src/problemQueue";
import { loadProblems } from "./src/problemQueue";
import { setAllSchedules } from "./src/scheduler";
import { loadSettings } from "./src/settings";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", async () => {
    await setAllSchedules(client);
    console.log("Ready!");
});

client.on("messageCreate", (message) => {
    // skip messages from bots
    if (message.author.bot) return;

    const text = message.content;

    // run command
    // if no commands match, only then run listeners
    let foundCommand = false;
    if (text.toLowerCase().startsWith(prefix.toLowerCase())) {
        const withoutPrefix = text.slice(prefix.length);
        for (const command of commandList) {
            if (command.matchAlias(withoutPrefix)) {
                command.checkExecute(message, withoutPrefix);
                foundCommand = true;
                break;
            }
        }
    }

    if (!foundCommand) {
        // run listeners
        for (const command of commandList) {
            command.checkListen(message);
        }
    }
});

loadSettings();
loadProblems();
client.login(token);
