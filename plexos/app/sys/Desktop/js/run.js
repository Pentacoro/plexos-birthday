import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem
let arg  = mem.arg

task.node.style.width = document.body.offsetWidth + "px"
task.node.style.height = document.body.offsetHeight + "px"

task.cmd("event.emit", {eventName: "desktop-open"})

mem.desktopInit(arg.address, task.id)
task.focus()