import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.render()
mem.ticker = setInterval(mem.render, 1000)
task.focus()
