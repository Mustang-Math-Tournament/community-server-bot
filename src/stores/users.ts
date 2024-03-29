import { CommandInteraction } from "discord.js";
import fs from "fs";
import nodeCleanup from "node-cleanup";
import { ProblemAnswer } from "../Problem";
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

export function getSenderUser(inter: CommandInteraction<"cached">) {
    let res = users[inter.guildId]?.find(x => x.id === inter.user.id);
    if (!res) {
        res = new User({ id: inter.user.id });
        if (!users[inter.guildId]) users[inter.guildId] = [];
        users[inter.guildId].push(res);
    }
    return res;
}

export function getGuildUsers(id: string) {
    return users[id];
}

export function getProblemUserAnswers(guildId: string, problemId: number) {
    return users[guildId]?.map(x => x.answers.find(p => p.problemId === problemId)).filter((x): x is ProblemAnswer => x !== undefined);
}

loadUsers();
nodeCleanup(saveUsers);
