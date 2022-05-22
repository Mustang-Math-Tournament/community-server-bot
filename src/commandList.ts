
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandAddProblem from "./commands/problem/addProblem";
import commandEcho from "./commands/echo";
import commandSetChannel from "./commands/setChannel";
import commandShowProblem from "./commands/problem/showProblem";
import fakeEditorCommand from "./problemEditor";
import commandEditProblem from "./commands/problem/editProblem";

let commandList: Command[] = [
    commandAddProblem,
    commandEcho,
    commandEditProblem,
    commandSetChannel,
    commandShowProblem,
    fakeEditorCommand,
];

export default commandList;