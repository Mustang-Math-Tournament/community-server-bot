import { existsSync, readFileSync, writeFileSync } from "fs";
import { SpecialChannelType } from "./commands/setChannel";
import nodeCleanup from "node-cleanup";

const FILE_PATH = "./stored/guildsettings.json";

interface GuildSettings {
    channels?: {
        [key: SpecialChannelType]: string;
    }
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

export function getSetting(guildId: string, ...settingList: string[]) {
    if (!settings[guildId]) return undefined;
    let curLevel: any = settings[guildId];
    for (const s in settingList) {
        curLevel = curLevel[s];
        if (!curLevel) return undefined;
    }
    return curLevel;
}

export function setSetting(guildId: string, value: any, ...settingList: string[]) {
    if (!settings[guildId]) settings[guildId] = {};
    let curLevel: any = settings[guildId];
    for (let i = 0; i < settingList.length-1; i++) {
        if (!(typeof curLevel === "object")) throw "Setting does not contain sub-settings!"
        if (!(settingList[i] in curLevel)) curLevel[settingList[i]] = {};
        curLevel = curLevel[settingList[i]];
    }
    // stop before the last one to modify the reference
    curLevel[settingList[settingList.length-1]] = value;
}

nodeCleanup(saveSettings);
