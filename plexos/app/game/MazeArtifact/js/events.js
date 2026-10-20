import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Taps and drags on the picture zoom and move it
mem.frame.addEventListener("pointerdown", e => {
    if (!mem.zoomDown(e)) return
    e.preventDefault()
    mem.frame.setPointerCapture(e.pointerId)
})
mem.frame.addEventListener("pointermove", e => mem.zoomMove(e))
mem.frame.addEventListener("pointerup", e => mem.zoomUp(e))
mem.frame.addEventListener("pointercancel", () => mem.zoomCancel())
