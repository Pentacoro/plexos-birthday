import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// pointerdown throughout, so one tap is always one action
const press = (node, action) => node.addEventListener("pointerdown", e => {
    e.preventDefault()
    action(e)
})

// the envelope opens on a tap that lifts without moving: a drag only tilts it (tilt.js)
for (const piece of [mem.envBack, mem.envFront, mem.envFlap, mem.letter]) {
    piece.addEventListener("pointerdown", e => e.preventDefault())
    piece.addEventListener("pointerup", () => { if (mem.view === "mail" && !mem.tiltMoved) mem.readMail() })
}
press(mem.investigate, () => mem.answerPressed())
press(mem.sendButton, () => mem.send())

mem.keys.addEventListener("pointerdown", e => {
    const key = e.target.closest(".key")
    if (!key) return
    e.preventDefault()
    key.classList.add("pressed")
    if (key.dataset.erase) mem.erase()
    else mem.strike(key.dataset.char, Number(key.dataset.bar))
})
for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
    mem.keys.addEventListener(type, () => {
        for (const key of mem.keys.querySelectorAll(".pressed")) key.classList.remove("pressed")
    })
}

// A horizontal swipe goes through the letters received, right going back, and past the
// newest turns it over onto the typewriter
let swipe = null
// not from the typewriter's keys, which type on touch
mem.stage.addEventListener("pointerdown", e => { swipe = e.target.closest(".machine") ? null : { x: e.clientX, y: e.clientY } })
mem.stage.addEventListener("pointerup", e => {
    if (!swipe) return
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y
    swipe = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) mem.browse(dx > 0 ? -1 : 1)
})
mem.stage.addEventListener("pointercancel", () => { swipe = null })

// A real keyboard types too
task.node.addEventListener("keydown", e => {
    if (mem.view !== "desk") return
    if (e.key === "Backspace") return mem.erase()
    if (e.key === "Enter") return mem.send()
    if (e.key === " " && mem.writing(mem.step) === "free") return mem.strike(" ", 7)
    const char = e.key.toUpperCase()
    const key = mem.keys.querySelector(`.key[data-char="${char}"]`)
    if (key) mem.strike(char, Number(key.dataset.bar))
})

task.cmd("event.on", { eventName: "viewport-resize", callback: () => {
    if (mem.view === "desk") mem.layoutTypebars()
}, priority: 1 })
