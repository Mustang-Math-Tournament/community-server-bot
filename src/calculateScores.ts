import { getGuildUsers } from "./stores/users";
import { User } from "./User";
import { getProblem } from "./stores/problemQueue";
import { getSetting } from "./stores/settings";
import { ProblemAnswer } from "./Problem";

// TODO: modify so changing the guild schedule in the future doesn't mess up earlier scores
function getScore(ans: ProblemAnswer, guildId: string) {
    if (getProblem(ans.problemId)?.isCorrect(ans)) {
        const hours = ans.time;
        const guildSchedule = getSetting(guildId, "schedule") as [number, number] | undefined;
        if (!guildSchedule) {
            throw new Error("Guild schedule needs to be set first!");
        }
        const ghours = guildSchedule[0] + (guildSchedule[1] / 60);
        let time = hours - ghours;
        if (time < 0) {
            time = (24 - ghours) + hours;
        }
        return parseFloat(score(time).toFixed(2));
    } else {
        return 0;
    }
}

export function getUserScore(user: User, guildId: string) {
    const scores = user.answers.map(ans => getScore(ans, guildId));
    console.log(scores);
    const count = scores.reduce((a, b) => a + b, 0);
    console.log(count);
    return count;
}

interface UserScore {
    userId: string;
    userScore: number;
}

function score(time: number) {
    const rate = 1.15; // The closer to 1, the harsher the time penalty at the beginning (faster decay).
    return (1000 / ((rate ** 24) - 1)) * ((rate ** 24) - (rate ** time));
}

export function calculateScores(guildId: string) {
    const users = getGuildUsers(guildId);

    const scoreList: UserScore[] = users.map(x => ({
        userId: x.id,
        userScore: getUserScore(x, guildId)
    }));
    return scoreList.sort((a, b) => b.userScore - a.userScore);
}
