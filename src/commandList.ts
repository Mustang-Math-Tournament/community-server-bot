
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandAddProblem from "./commands/problem/addProblem";
import commandEcho from "./commands/echo";
import commandSetChannel from "./commands/setChannel";
import commandShowProblem from "./commands/problem/showProblem";
import fakeEditorCommand from "./problemEditor";
import commandEditProblem from "./commands/problem/editProblem";
import commandRemoveProblem from "./commands/problem/removeProblem";
import commandListProblems from "./commands/problem/listProblems";
import commandSetSchedule from "./commands/setSchedule";
import commandReleaseProblem from "./commands/releaseProblem";

let commandList: Command[] = [
    commandAddProblem,
    commandEcho,
    commandEditProblem,
    commandListProblems,
    commandReleaseProblem,
    commandRemoveProblem,
    commandSetChannel,
    commandSetSchedule,
    commandShowProblem,
    fakeEditorCommand,
];

export default commandList;