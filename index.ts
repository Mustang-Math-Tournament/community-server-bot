import { Client, Intents, TextChannel } from "discord.js";
import { token } from "./config.json";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
    console.log("Ready!");
});

client.login(token);
