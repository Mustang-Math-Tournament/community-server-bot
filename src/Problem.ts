
// Randomly generate id number
// Very low chance of collision
// Probably should make this better later
function createId() {
    return Math.floor(Math.random()*1e9);
}

export class Problem {
    question: string;
    answer: string;
    id: number;
    images?: string[]; // proxy URLs of attachments

    constructor(question: string, answer: string, images?: string[]) {
        this.question = question;
        this.answer = answer;
        this.id = createId();
        this.images = images;
    }
}
