import { GuildMember, User } from "discord.js";

let adminRoles: string[] = ["977750990407217152"];

export function isAdmin(user: User | GuildMember) {
    if (!(user instanceof GuildMember)) {
        return false; // can't do permission stuff in dms
    }
    return user.roles.cache.hasAny(...adminRoles);
}
