import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Every letter received is kept in step order: each step's letter, then its "Incorrecto" reply
// once one has come. They lie side by side like a strip: swiping right brings the one before in
// from the left, swiping left the one after in from the right. Past the newest, the sheet turns
// over onto the typewriter to answer it (or, all answered, the closing note shows). A letter
// already answered has "Reenviar" instead of "Investigar", for a go that changes no progress.
const keyOf = (step, wrong) => step + (wrong ? "w" : "")
const parse = (key) => ({ step: parseInt(key), wrong: key.endsWith("w") })
const order = (a, b) => parseInt(a) - parseInt(b) || a.length - b.length

mem.received = () => {
    const saved = mem.party.flag(mem.id, "received")
    if (saved) return [...saved].sort(order)
    // progress from before letters were kept: the letters it must have had
    const solved = mem.party.stepsSolved(mem.id)
    return Array.from({ length: Math.min(solved + 1, mem.letters.length) }, (_, step) => keyOf(step))
}

mem.receive = (step, wrong) => {
    const key = keyOf(step, wrong)
    let list = mem.received()
    if (!list.includes(key)) {
        list = [...list, key].sort(order)
        mem.party.setFlag(mem.id, "received", list)
    }
    mem.reading = list.indexOf(key)
}

const solved = (step) => step < mem.party.stepsSolved(mem.id)
const finished = () => mem.party.stepsSolved(mem.id) >= mem.letters.length

// The button under the letter: answered letters are sent again, the open one investigated
mem.labelButton = () => {
    mem.investigate.textContent = solved(mem.step) ? "Reenviar" : "Investigar"
}

// The letter at a place in the strip becomes the one on the desk, and the one answered next
function showReceived(index) {
    const { step, wrong } = parse(mem.received()[index])
    mem.reading = index
    mem.step = step
    mem.setStepCategory(step)
    mem.buildAnswer(mem.passwordOf(step).length)
    mem.showLetterText(mem.letterOf(step), wrong ? mem.wrong : null)
    mem.labelButton()
}

// The sheet leaving stays behind as a copy, so the next one can already be sliding in beside it
function ghost() {
    const copy = mem.letter.cloneNode(true)
    copy.classList.add("letter-ghost")
    mem.letter.after(copy)
    copy.querySelector(".letter-full .letter-text").scrollTop = mem.letterText.scrollTop
    return copy
}

const slide = "cubic-bezier(0.25, 0.8, 0.3, 1)"

// by: 1 forward (swiped left), -1 back (swiped right)
mem.browse = async (by) => {
    if (mem.busy) return
    if (mem.view === "desk") return by < 0 && mem.closeTypewriter(false, true)
    if (mem.view !== "letter" && mem.view !== "done") return
    const list = mem.received()
    const from = mem.view === "done" ? list.length : mem.reading
    const to = from + by
    if (to < 0 || to > list.length) return
    // past the newest: turned over to answer, or the closing note once all are answered
    if (to === list.length && !finished()) return mem.openTypewriter(true)
    const width = mem.stage.clientWidth
    const g = mem.geometry()
    mem.busy = true
    const moves = []
    if (mem.view === "letter") {
        const old = ghost()
        moves.push(mem.tween(old, `translate(${-by * width}px, ${mem.letterY}px)`, 320, slide).then(() => old.remove()))
    } else {
        mem.stage.classList.remove("done")
        mem.setFlat()
    }
    if (to === list.length) {
        mem.letter.style.transform = `translate(${by * width}px, ${g.center}px)`
        await Promise.all(moves)
        mem.busy = false
        return mem.finish()
    }
    showReceived(to)
    mem.letterY = g.center
    mem.letter.style.transform = `translate(${by * width}px, ${g.center}px)`
    moves.push(mem.letterTo(g.center, 320, slide))
    mem.view = "letter"
    mem.stage.classList.add("reading")
    await Promise.all(moves)
    mem.busy = false
}
