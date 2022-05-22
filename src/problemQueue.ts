
// Contains the logic for storing problems.

import { Problem } from "./Problem";
import fs from "fs";
import nodeCleanup from "node-cleanup";

const FILE_PATH = "./stored/problemqueue.json";

let problemQueue: Problem[] = [];

// read problems that were saved to the file
function loadProblems() {
    if (fs.existsSync(FILE_PATH)) {
        problemQueue = JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as Problem[];
    }
}

// write problems to file
function saveProblems() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(problemQueue));
    console.log("Saved problems");
}

// Add a problem to the end of the queue
export function addProblem(prob: Problem) {
    problemQueue.push(prob);
}

// Get the first problem in the queue
export function getTopProblem() {
    return problemQueue[0];
}

// Remove the first problem in the queue
export function removeTopProblem() {
    problemQueue = problemQueue.slice(1);
}

// Get problem by id
export function getProblem(id: number) {
    return problemQueue.find(x => x.id === id);
}

// Remove problem by id
export function removeProblem(id: number) {
    problemQueue = problemQueue.filter(x => x.id !== id);
}

loadProblems();
nodeCleanup(() => {
    saveProblems();
});
