import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// a tap on a suit picks its column
mem.suits.addEventListener("pointerdown", e => {
    const suit = e.target.closest(".suit")
    if (!suit) return
    e.preventDefault()
    mem.showColumn(Number(suit.dataset.column))
})

// a sideways swipe anywhere on the card moves one column over, the way it went
let swipe = null
mem.root.addEventListener("pointerdown", e => { if (!e.target.closest(".suit")) swipe = { x: e.clientX, y: e.clientY } })
mem.root.addEventListener("pointerup", e => {
    if (!swipe) return
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y
    swipe = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) mem.showColumn(mem.column + (dx < 0 ? 1 : -1))
})
mem.root.addEventListener("pointercancel", () => { swipe = null })
