
// Exports an array of all commands.
// If you add a command, you must add it to this list.

import { Command } from "./Command";
import commandEcho from "./commands/echo";
import { commandAnswer } from "./commands/answer";
import { commandProblem } from "./commands/problem/problem";
import commandSetChannel from "./commands/setChannel";
import { commandSetSchedule } from "./commands/setSchedule";


const commandList: Command[] = [
    commandAnswer,
    commandEcho,
    commandProblem,
    commandSetChannel,
    commandSetSchedule
];

export default commandList;
