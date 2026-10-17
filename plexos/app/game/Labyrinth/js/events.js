import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// pointerdown, so one tap is always one step
mem.pad.addEventListener("pointerdown", e => {
    const button = e.target.closest(".move")
    if (!button) return
    e.preventDefault()
    button.classList.add("pressed")
    mem.move(button.dataset.move)
})
for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
    mem.pad.addEventListener(type, () => { for (const b of mem.pad.querySelectorAll(".pressed")) b.classList.remove("pressed") })
}

// Arrow keys walk too
const KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }
task.node.addEventListener("keydown", e => {
    if (!KEYS[e.key]) return
    e.preventDefault()
    mem.move(KEYS[e.key])
})
