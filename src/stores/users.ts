import { CommandInteraction } from "discord.js";
import fs from "fs";
import nodeCleanup from "node-cleanup";
import { User } from "../User";

const FILE_PATH = "./stored/users.json";

let users: { [key: string]: User[] } = {};

function loadUsers() {
    if (fs.existsSync(FILE_PATH)) {
        users = JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as { [key: string]: User[] };
    }
}

function saveUsers() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users));
    console.log("Saved users");
}

export function getSender(inter: CommandInteraction) {
    if (!inter.inCachedGuild()) return null;
    return users[inter.guildId]?.find(x => x.id === inter.user.id);
}

loadUsers();
nodeCleanup(saveUsers);
