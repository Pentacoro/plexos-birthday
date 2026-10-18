import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A waiting envelope can be tilted like a card in the hand: dragging a finger across the screen
// turns it slightly in 3D, with a glare that follows the finger; let go and it settles back.
// The special envelopes' shine, sheen, gem and foil follow the turn and sit still without it:
// the stage carries --tx and --ty (-1 to 1) and --tm (how far it is turned, 0 to 1) for them.
// The envelope and the letter in it sit in one layer for this, so they turn together. Only a
// tap that hasn't moved opens it (events.js).
const most = 14          // degrees at the most, either way
const reach = 160        // pixels of drag for the most

mem.tilt = document.createElement("div")
mem.tilt.className = "tilt"
mem.envBack.before(mem.tilt)
mem.tilt.append(mem.envBack, mem.letter, mem.envFront, mem.envFlap)
const glare = document.createElement("div")
glare.className = "tilt-glare"
mem.tilt.append(glare)

let from = null
mem.tiltMoved = false
const clamp = (value) => Math.max(-most, Math.min(most, value))

let now = { x: 0, y: 0, fx: 50, fy: 50 }
let settling = 0

function turn(x, y, fx = now.fx, fy = now.fy) {
    now = { x, y, fx, fy }
    const amount = Math.min(1, Math.hypot(x, y) / most)
    mem.tilt.style.transform = x || y ? `rotateX(${x}deg) rotateY(${y}deg)` : ""
    mem.stage.style.setProperty("--tx", (y / most).toFixed(3))
    mem.stage.style.setProperty("--ty", (-x / most).toFixed(3))
    mem.stage.style.setProperty("--tm", amount.toFixed(3))
    glare.style.opacity = String(amount)
    glare.style.background = `radial-gradient(circle at ${fx}% ${fy}%, rgba(255, 255, 255, 0.35), transparent 45%)`
}

// back to rest with a little overshoot, the effects easing out with it
function settle() {
    const run = ++settling
    const start = performance.now(), from = { ...now }
    const step = (time) => {
        if (run !== settling) return
        const t = Math.min(1, (time - start) / 600)
        const back = 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
        const left = 1 - back
        turn(from.x * left, from.y * left)
        if (t < 1) requestAnimationFrame(step)
        else turn(0, 0)
    }
    requestAnimationFrame(step)
}

// straight back to rest, for a slide that takes the envelope away
mem.tiltReset = () => {
    settling++
    turn(0, 0)
}

mem.stage.addEventListener("pointerdown", e => {
    mem.tiltMoved = false
    from = mem.view === "mail" && !mem.busy ? { x: e.clientX, y: e.clientY } : null
    if (from) settling++
})
document.addEventListener("pointermove", e => {
    if (!from) return
    const dx = e.clientX - from.x, dy = e.clientY - from.y
    if (Math.hypot(dx, dy) > 8) mem.tiltMoved = true
    const box = mem.envFront.getBoundingClientRect()
    turn(clamp(-dy / reach * most), clamp(dx / reach * most),
        (e.clientX - box.left) / box.width * 100, (e.clientY - box.top) / box.height * 100)
})
for (const type of ["pointerup", "pointercancel"]) {
    document.addEventListener(type, () => {
        if (!from) return
        from = null
        settle()
    })
}
task.onEnd = ((own) => (...args) => {
    from = null
    return own?.(...args)
})(task.onEnd)
