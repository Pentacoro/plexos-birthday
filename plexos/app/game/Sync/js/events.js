import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// coming back from the phone, the code it gave shows
task.onfocus = () => mem.showHeard?.()

mem.next.addEventListener("pointerdown", e => {
    e.preventDefault()
    mem.advance()
})
