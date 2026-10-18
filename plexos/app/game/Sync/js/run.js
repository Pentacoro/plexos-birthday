import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A partner first; then the stage this player reached
if (!mem.partner) mem.showPairing()
else mem.showStage(Math.min(mem.state().stage || 0, mem.stages.length - 1))
task.focus()
