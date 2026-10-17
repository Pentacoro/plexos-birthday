import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Always the phone. Calling their team again leads back to wherever they were.
mem.showDial()
task.focus()
