import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Picks up in the maze the player last reached, from its way in
if (mem.party.flag(mem.id, "done")) mem.finish()
else mem.startLeg(mem.party.flag(mem.id, "leg") || mem.start)
task.focus()
