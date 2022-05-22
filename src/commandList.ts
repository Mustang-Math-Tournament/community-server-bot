
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandAddProblem from "./commands/addProblem";
import commandEcho from "./commands/echo";

let commandList: Command[] = [
    commandEcho,
    commandAddProblem
];

export default commandList;