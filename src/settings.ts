import { existsSync, readFileSync, writeFileSync } from "fs";
import nodeCleanup from "node-cleanup";

const FILE_PATH = "./stored/guildsettings.json";

interface GuildSettings {
    adminChannelId?: string;
    announceChannelId?: string;
    schedule?: [number, number];
}

let settings: { [key: string]: GuildSettings } = {};

export function loadSettings() {
    if (existsSync(FILE_PATH)) {
        settings = JSON.parse(readFileSync(FILE_PATH, "utf8")) as { [key: string]: GuildSettings };
    }
}

function saveSettings() {
    writeFileSync(FILE_PATH, JSON.stringify(settings));
    console.log("Saved settings");
}

export function getSetting(guildId: string, setting: keyof GuildSettings) {
    if (!settings[guildId]) return undefined;
    return settings[guildId][setting];
}

export function setSetting(guildId: string, setting: keyof GuildSettings, value: any) {
    if (!settings[guildId]) settings[guildId] = {};
    settings[guildId][setting] = value;
}

nodeCleanup(saveSettings);
