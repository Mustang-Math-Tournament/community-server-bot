
// Contains the logic for storing problems.

import { Problem, ProblemOptions } from "../Problem";
import fs from "fs";
import nodeCleanup from "node-cleanup";

const FILE_PATH = "./stored/problemqueue.json";

let problemQueue: Problem[] = [];
let unfinishedProblems: Problem[] = [];
let shownProblem: Problem | null = null;

interface ProblemSave {
    problemQueue: ProblemOptions[];
    unfinishedProblems: ProblemOptions[];
    shownProblem: ProblemOptions | null;
}

// read problems that were saved to the file
export function loadProblems() {
    if (fs.existsSync(FILE_PATH)) {
        const problemJSON = JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as ProblemSave;
        if (problemJSON.problemQueue) problemQueue.push(...problemJSON.problemQueue.map(x => new Problem(x)));
        if (problemJSON.unfinishedProblems) unfinishedProblems.push(...problemJSON.unfinishedProblems.map(x => new Problem(x)));
        shownProblem = problemJSON.shownProblem ? new Problem(problemJSON.shownProblem) : null;
    }
}

// write problems to file
function saveProblems() {
    fs.writeFileSync(FILE_PATH, JSON.stringify({
        problemQueue,
        unfinishedProblems,
        shownProblem
    }));
    console.log("Saved problems");
}

// Add a problem to the end of the queue
export function addProblem(prob: Problem) {
    problemQueue.push(prob);
}

// Get the first problem in the queue
export function getTopProblem() {
    if (problemQueue.length === 0) return undefined;
    return problemQueue[0];
}

// Remove the first problem in the queue
export function removeTopProblem() {
    if (problemQueue.length === 0) return;
    problemQueue = problemQueue.slice(1);
}

// Get problem by id
export function getProblem(id: number) {
    return problemQueue.find(x => x.id === id);
}

// Remove problem by id, returns the first removed problem (if any)
export function removeProblem(id: number) {
    const ret = getProblem(id);
    problemQueue = problemQueue.filter(x => x.id !== id);
    return ret;
}

export function isValidProblemId(id: string | number) {
    if (typeof id === "number") {
        return problemQueue.some(x => x.id === id);
    }
    const parsed = parseInt(id);
    if (isNaN(parsed)) return false;
    return problemQueue.some(x => x.id === parsed);
}

// If you need to edit a problem, just (ab)use the fact that objects are references and modify the properties directly.

export function getAllProblems() {
    return problemQueue;
}

export function getShown() {
    return shownProblem;
}

export function setShown(p: Problem | null) {
    shownProblem = p;
}

export function problemQueueSize() {
    return problemQueue.length;
}

// unfinished problem queue functions

export function getUnfinished(id: number) {
    return unfinishedProblems.find(x => x.id === id);
}

export function getAllUnfinished() {
    return unfinishedProblems;
}

export function addUnfinished(p: Problem) {
    unfinishedProblems.push(p);
}

export function removeUnfinished(id: number) {
    unfinishedProblems = unfinishedProblems.filter(x => x.id !== id);
}

// make a problem finished and add it to the problem queue
export function finalize(id: number) {
    const pb = getUnfinished(id);
    if (!pb) throw "Problem with id "+id+" not found";
    removeUnfinished(id);
    pb.finished = true;
    addProblem(pb);
}

export function unfinalize(id: number) {
    const pb = removeProblem(id);
    if (!pb) throw "Problem with id "+id+" not found";
    pb.finished = false;
    addUnfinished(pb);
}

loadProblems();
nodeCleanup(saveProblems);
