import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The envelope is three pieces (back, front pocket, flap) with the letter sliding between the
// back and the front. They move together by the same vertical offset; the flap also turns.
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In the typewriter the sheet sits just under the badges. On a short screen (under 550px) it
// comes down instead, so its line is near the keys rather than far above them, with room
// left for the typebars to swing.
function deskTop() {
    if (window.innerHeight >= 550) return 14
    const line = mem.answer.offsetTop + mem.slotsRow.offsetTop + mem.slotsRow.offsetHeight * 0.55
    return Math.max(14, mem.machine.offsetTop - 90 - line)
}

// Offsets are measured from where each piece sits in the layout, so they follow any screen size
mem.geometry = () => {
    const stageH = mem.stage.clientHeight
    const eh = mem.envBack.offsetHeight
    const lh = mem.letter.offsetHeight
    const top = mem.letter.offsetTop
    return {
        above: -(stageH / 2 + eh + 80),
        below: stageH / 2 + eh + 80,
        // where the letter goes: in the envelope, half out of it, centred to read, in the typewriter
        inside: 0,
        out: -eh * 0.62,
        center: stageH / 2 - lh / 2 - 34 - top,
        desk: deskTop() - top,
    }
}

mem.envelopeY = 0
mem.flapAngle = 0

function pieceTransforms(y, flap) {
    return [`translateY(${y}px)`, `translateY(${y}px) rotateX(${flap}deg)`]
}

// The flap tucks behind the letter once it is past upright, and comes back over it closing
function flapLayer(flap) {
    mem.stage.classList.toggle("flap-open", flap > 90)
}

mem.setEnvelope = (y, flap) => {
    const [body, top] = pieceTransforms(y, flap)
    mem.envBack.style.transform = body
    mem.envFront.style.transform = body
    mem.envFlap.style.transform = top
    mem.envelopeY = y
    mem.flapAngle = flap
    flapLayer(flap)
}

mem.envelopeTo = (y, flap, duration, easing = "ease") => {
    const [body, top] = pieceTransforms(y, flap)
    const crossing = (mem.flapAngle > 90) !== (flap > 90)
    if (crossing) setTimeout(() => flapLayer(flap), duration / 2)
    mem.envelopeY = y
    mem.flapAngle = flap
    return Promise.all([
        mem.tween(mem.envBack, body, duration, easing),
        mem.tween(mem.envFront, body, duration, easing),
        mem.tween(mem.envFlap, top, duration, easing),
    ])
}

// Moving up or down also brings the sheet back to the middle, from wherever the carriage left it
mem.letterX = 0
mem.letterY = 0
mem.letterTo = (y, duration, easing = "ease") => {
    mem.letterX = 0
    mem.letterY = y
    return mem.tween(mem.letter, `translate(0px, ${y}px)`, duration, easing)
}

// A new letter waits above the screen, folded in its closed envelope
mem.placeMailAbove = () => {
    const g = mem.geometry()
    mem.setFolded()
    mem.setEnvelope(g.above, 0)
    mem.letterX = 0
    mem.letterY = g.above + g.inside
    mem.letter.style.transform = `translate(0px, ${mem.letterY}px)`
    mem.stage.classList.remove("reading", "mail-gone", "unsealed", "sealed", "done")
}

// ...and falls into the middle of it
mem.arrive = async () => {
    const g = mem.geometry()
    const easing = "cubic-bezier(0.25, 0.9, 0.35, 1.12)"
    await Promise.all([mem.envelopeTo(0, 0, 750, easing), mem.letterTo(g.inside, 750, easing)])
}

// Opened from the top: the flap lifts, the letter slides out, the envelope drops away below,
// and the letter comes to the middle and unfolds
mem.openMail = async () => {
    const g = mem.geometry()
    await mem.envelopeTo(0, 180, 420)
    await mem.letterTo(g.out, 480, "cubic-bezier(0.3, 0.7, 0.4, 1)")
    await mem.envelopeTo(g.below, 180, 520, "cubic-bezier(0.5, 0, 0.9, 0.5)")
    mem.stage.classList.add("mail-gone")
    await mem.letterTo(g.center, 480)
    await mem.unfold()
}

// The reply, already folded in the middle: an envelope rises to meet it, takes it in,
// closes under the team's seal, and flies off upward
mem.sendMail = async () => {
    const g = mem.geometry()
    mem.setEnvelope(g.below, 180)
    mem.stage.classList.remove("mail-gone")
    mem.stage.classList.add("unsealed")
    await Promise.all([mem.letterTo(g.out, 500), mem.envelopeTo(0, 180, 600, "cubic-bezier(0.2, 0.8, 0.3, 1)")])
    await mem.letterTo(g.inside, 450, "cubic-bezier(0.5, 0, 0.6, 1)")
    await mem.envelopeTo(0, 0, 420)
    await mem.pressSeal()
    await wait(250)
    const easing = "cubic-bezier(0.6, 0, 0.9, 0.4)"
    await Promise.all([mem.envelopeTo(g.above, 0, 650, easing), mem.letterTo(g.above + g.inside, 650, easing)])
}

// The sender's wax seal: pressed onto the closed flap in the team's color, with their suit
mem.pressSeal = async () => {
    mem.stage.classList.remove("unsealed")
    mem.stage.classList.add("sealed")
    await mem.envSeal.animate(
        [{ transform: "scale(1.9)", opacity: 0 }, { transform: "scale(0.92)", opacity: 1, offset: 0.7 }, { transform: "scale(1)", opacity: 1 }],
        { duration: 380, easing: "ease-out" },
    ).finished
}
