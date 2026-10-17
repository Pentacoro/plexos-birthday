import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Picks up at the first letter not yet answered
mem.machine.style.transform = "translateY(110%)"
const solved = mem.party.stepsSolved(mem.id)
if (solved >= mem.letters.length) mem.finish()
else mem.startStep(solved)
task.focus()
