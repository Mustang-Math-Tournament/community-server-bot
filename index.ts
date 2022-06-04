import { Client, Intents } from "discord.js";
import { token } from "./config.json";
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

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    for (const cmd of commandList) {
        await cmd.checkExecute(interaction);
    }
});

loadSettings();
loadProblems();
client.login(token);
