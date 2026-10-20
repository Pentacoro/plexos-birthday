import {getTask} from "/plexos/lib/functions/dll.js"
import {places} from "/plexos/app/game/StarDisc/disc.js"
import {click} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A finger on the star turns the star; anywhere else on the disc, the disc. Let go, and the
// star settles on the nearest of the disc's places, so its tips always point at a digit.
const step = 360 / places
const starReach = 56

mem.draw = () => {
    mem.disc.setAttribute("transform", `rotate(${mem.turns.disc})`)
    mem.star.setAttribute("transform", `rotate(${mem.turns.star})`)
}

// where a point is, as an angle clockwise from the top and a distance from the center
function polar(e) {
    const box = mem.stage.getBoundingClientRect()
    const scale = 208 / box.width
    const x = (e.clientX - box.left) * scale - 104, y = (e.clientY - box.top) * scale - 104
    return { angle: Math.atan2(x, -y) * 180 / Math.PI, distance: Math.hypot(x, y) }
}
const between = (from, to) => ((to - from + 540) % 360) - 180

let grab = null
mem.stage.addEventListener("pointerdown", e => {
    const { angle, distance } = polar(e)
    if (distance > 100) return
    e.preventDefault()
    mem.stage.setPointerCapture(e.pointerId)
    grab = { which: distance < starReach ? "star" : "disc", last: angle, id: e.pointerId }
    mem.stage.classList.add("turning")
})
mem.stage.addEventListener("pointermove", e => {
    if (!grab || e.pointerId !== grab.id) return
    const { angle } = polar(e)
    mem.turns[grab.which] += between(grab.last, angle)
    grab.last = angle
    mem.draw()
})
const release = (e) => {
    if (!grab || e.pointerId !== grab.id) return
    grab = null
    mem.stage.classList.remove("turning")
    settle()
}
mem.stage.addEventListener("pointerup", release)
mem.stage.addEventListener("pointercancel", release)

// the star eases onto the nearest place, measured against the disc, with a soft click
function settle() {
    const relative = mem.turns.star - mem.turns.disc
    const target = mem.turns.disc + Math.round(relative / step) * step
    const from = mem.turns.star, start = performance.now()
    if (Math.abs(target - from) < 0.01) return
    const frame = (now) => {
        const k = Math.min(1, (now - start) / 160)
        mem.turns.star = from + (target - from) * (1 - (1 - k) ** 3)
        mem.draw()
        if (k < 1) requestAnimationFrame(frame)
        else click({ freq: 2600, q: 5, gain: 0.18, length: 0.02 })
    }
    requestAnimationFrame(frame)
}
