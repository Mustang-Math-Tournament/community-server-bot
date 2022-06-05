
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandAddProblem from "./commands/problem/addProblem";
import commandEcho from "./commands/echo";
import commandSetChannel from "./commands/setChannel";

let commandList: Command[] = [
    commandAddProblem,
    commandEcho,
    commandSetChannel,
];

export default commandList;