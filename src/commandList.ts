
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandEcho from "./commands/echo";
import { commandProblem } from "./commands/problem/problem";
import commandSetChannel from "./commands/setChannel";

let commandList: Command[] = [
    commandEcho,
    commandProblem,
    commandSetChannel,
];

export default commandList;
