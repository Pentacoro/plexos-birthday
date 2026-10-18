import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Picks up at the first stage not yet solved
mem.showStage(Math.min(mem.party.stepsSolved(mem.id), mem.stages.length - 1))
task.focus()
