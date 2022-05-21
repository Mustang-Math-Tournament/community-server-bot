
// Randomly generate id number
// Very low chance of collision
// Probably should make this better later
function createId() {
    return Math.floor(Math.random()*1e9);
}

export class Problem {
    problem: string;
    answer: string;
    id: number;

    constructor(problem: string, answer: string) {
        this.problem = problem;
        this.answer = answer;
        this.id = createId();
    }
}
