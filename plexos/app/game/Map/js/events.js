import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// pointerdown, so a quick second tap can't count twice
mem.switch.addEventListener("pointerdown", e => {
    e.preventDefault()
    e.stopPropagation()
    mem.toggleView()
})

// Taps and drags on the picture itself zoom and move it
mem.frame.addEventListener("pointerdown", e => {
    if (e.target.closest(".map-switch") || !mem.zoomDown(e)) return
    e.preventDefault()
    mem.frame.setPointerCapture(e.pointerId)
})
mem.frame.addEventListener("pointermove", e => mem.zoomMove(e))
mem.frame.addEventListener("pointerup", e => mem.zoomUp(e))
mem.frame.addEventListener("pointercancel", () => mem.zoomCancel())
