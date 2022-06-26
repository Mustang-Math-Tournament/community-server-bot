
// Contains the logic for storing problems.

import { Problem, ProblemOptions } from "../Problem";
import fs from "fs";
import nodeCleanup from "node-cleanup";

const FILE_PATH = "./stored/problemqueue.json";

let allProblems: Problem[] = []; // list of all problems, finished/unfinished/archived
let problemQueue: number[] = []; // ids of problems in queue
let unfinishedProblems: number[] = []; // ids of unfinished problems
let shownProblem: number | null = null;

interface ProblemSave {
    allProblems: ProblemOptions[];
    problemQueue: number[];
    unfinishedProblems: number[];
    shownProblem: number | null;
}

// read problems that were saved to the file
export function loadProblems() {
    if (fs.existsSync(FILE_PATH)) {
        const problemJSON = JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as ProblemSave;
        if (problemJSON.allProblems) allProblems.push(...problemJSON.allProblems.map(x => new Problem(x)));
        if (problemJSON.problemQueue) problemQueue.push(...problemJSON.problemQueue);
        if (problemJSON.unfinishedProblems) unfinishedProblems.push(...problemJSON.unfinishedProblems);
        shownProblem = problemJSON.shownProblem ? problemJSON.shownProblem : null;
    }
}

// write problems to file
function saveProblems() {
    fs.writeFileSync(FILE_PATH, JSON.stringify({
        allProblems,
        problemQueue,
        unfinishedProblems,
        shownProblem
    }));
    console.log("Saved problems");
}

// Add a problem to the end of the queue
export function addProblem(prob: Problem) {
    if (!allProblems.some(x => x.id === prob.id)) allProblems.push(prob);
    problemQueue.push(prob.id);
}

// Get the first problem in the queue
export function getTopProblem() {
    if (problemQueue.length === 0) return undefined;
    return allProblems.find(x => x.id === problemQueue[0]);
}

// Remove the first problem in the queue, doesn't fully delete it
export function removeTopProblem() {
    if (problemQueue.length === 0) return;
    problemQueue = problemQueue.slice(1);
}

// Get problem in queue by id
export function getProblem(id: number) {
    return allProblems.find(x => x.id === id);
}

// Remove problem by id, returns the first removed problem (if any)
export function removeProblem(id: number) {
    const ret = getProblem(id);
    allProblems = allProblems.filter(x => x.id !== id);
    unfinishedProblems = unfinishedProblems.filter(x => x !== id);
    problemQueue = problemQueue.filter(x => x !== id);
    return ret;
}

export function isValidProblemId(id: string | number) {
    if (typeof id === "number") {
        return problemQueue.includes(id);
    }
    const parsed = parseInt(id);
    if (isNaN(parsed)) return false;
    return problemQueue.includes(parsed);
}

// If you need to edit a problem, just (ab)use the fact that objects are references and modify the properties directly.

// clarification: this gets all problems *in the queue*
export function getAllProblems() {
    return problemQueue.map(x => allProblems.find(p => p.id === x))
        .filter((x): x is Problem => x !== undefined); // get rid of undefineds
}

export function getShown() {
    return allProblems.find(x => x.id === shownProblem);
}

export function setShown(p: Problem | number | null) {
    if (p instanceof Problem) {
        shownProblem = p.id;
    } else {
        shownProblem = p;
    }
}

export function problemQueueSize() {
    return problemQueue.length;
}

// unfinished problem queue functions

export function getUnfinished(id: number) {
    if (!unfinishedProblems.includes(id)) return undefined;
    return allProblems.find(x => x.id === id);
}

export function getAllUnfinished() {
    return unfinishedProblems.map(x => allProblems.find(p => p.id === x))
        .filter((x): x is Problem => x !== undefined); // get rid of undefineds
}

export function addUnfinished(p: Problem) {
    unfinishedProblems.push(p.id);
    console.log(allProblems, p);
    if (!allProblems.some(x => x.id === p.id)) allProblems.push(p);
}

export function removeUnfinished(id: number) {
    removeProblem(id);
}

// make a problem finished and add it to the problem queue
export function finalize(id: number) {
    const pb = getUnfinished(id);
    if (!pb) throw "Problem with id " + id + " not found";
    removeUnfinished(id);
    pb.finished = true;
    addProblem(pb);
}

export function unfinalize(id: number) {
    const pb = removeProblem(id);
    if (!pb) throw "Problem with id " + id + " not found";
    pb.finished = false;
    addUnfinished(pb);
}

loadProblems();
nodeCleanup(saveProblems);
