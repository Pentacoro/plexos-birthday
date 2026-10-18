import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.open.addEventListener("pointerdown", e => {
    e.preventDefault()
    mem.decode()
})
mem.password.addEventListener("keydown", e => { if (e.key === "Enter") mem.decode() })
task.focus()
