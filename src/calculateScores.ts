import { getGuildUsers } from "./stores/users";
import { User } from "./User";
import { getProblem } from "./stores/problemQueue";

// TODO: improve scoring function
// weighted x1: correct answers
export function getUserScore(user: User) {
    return user.answers.filter(ans => getProblem(ans.problemId)?.isCorrect(ans)).length;
}

interface UserScore {
    userId: string;
    userScore: number;
}

export function calculateScores(guildId: string) {
    const users = getGuildUsers(guildId);
    const scoreList: UserScore[] = users.map(x => ({
        userId: x.id,
        userScore: getUserScore(x)
    }));
    return scoreList.sort((a, b) => b.userScore - a.userScore);
}
