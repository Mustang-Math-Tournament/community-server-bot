
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandAddProblem from "./commands/addProblem";
import commandEcho from "./commands/echo";
import commandSetChannel from "./commands/setChannel";
import commandShowProblem from "./commands/showProblem";

let commandList: Command[] = [
    commandEcho,
    commandAddProblem,
    commandShowProblem,
    commandSetChannel
];

export default commandList;