import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Every letter received is kept in step order: each step's letter, then the "Incorrecto" reply
// once one has come, one letter for every step, plain white and saying only that. They lie side
// by side like a strip: swiping right brings the one before in from the left, swiping left the
// one after in from the right. Past the newest, the sheet turns over onto the typewriter to
// answer it (or, all answered, the closing note shows). A letter already answered has
// "Reenviar" instead of "Responder", for a go that changes no progress. The final letter, after
// the last step, is kept as "final" and comes after them.
const keyOf = (step, wrong) => mem.isQueen(step) ? "queen" : mem.isSecret(step) ? "secret" : mem.isFinal(step) ? "final" : wrong ? "wrong" : String(step)
// the "Incorrecto" belongs to whichever step is open, the last once all are answered
const openStep = () => Math.min(mem.party.stepsSolved(mem.id), mem.letters.length - 1)
const parse = (key) => key === "queen" ? { step: mem.letters.length + 2, wrong: false }
    : key === "secret" ? { step: mem.letters.length + 1, wrong: false }
    : key === "final" ? { step: mem.letters.length, wrong: false }
    : key === "wrong" ? { step: openStep(), wrong: true }
    : { step: parseInt(key), wrong: false }
const rank = (key) => key === "queen" ? 1e9 + 2 : key === "secret" ? 1e9 + 1 : key === "final" ? 1e9 : key === "wrong" ? mem.letters.length - 0.5 : parseInt(key)
// every letter there is: the badge goes complete once all are in
const everyLetter = () => [...mem.letters.map((_, step) => keyOf(step)), "wrong", "final", "secret"]
const order = (a, b) => rank(a) - rank(b)
// progress from when each step had its own "Incorrecto" ("0w", "1w")
mem.letterKey = (key) => /^\d+w$/.test(key) ? "wrong" : key

mem.received = () => {
    const saved = mem.party.flag(mem.id, "received")
    if (saved) return [...new Set(saved.map(mem.letterKey))].sort(order)
    // progress from before letters were kept: the letters it must have had
    const solved = mem.party.stepsSolved(mem.id)
    return Array.from({ length: Math.min(solved + 1, mem.letters.length) }, (_, step) => keyOf(step))
}

// New is judged by what was saved, so the very first letter is kept too
mem.receive = (step, wrong) => {
    const key = keyOf(step, wrong)
    let list = mem.received()
    if (!(mem.party.flag(mem.id, "received") || []).includes(key)) {
        list = [...new Set([...list, key])].sort(order)
        mem.party.setFlag(mem.id, "received", list)
        // each letter has its own envelope color
        const look = key === "wrong" ? "wrong" : mem.isQueen(step) ? "queen" : mem.isSecret(step) ? "secret-" + mem.team : mem.isFinal(step) ? "final"
            : step === 2 ? "2-" + mem.team : "1"
        mem.party.record("letters", titleOf(key), key, { image: "/plexos/app/game/Party/img/letter-" + look + ".svg", detail: (key !== "wrong" && mem.answerOf(step)) || " " })
        if (mem.isFinal(step)) mem.party.setBadge("letters", 2)
        if (everyLetter().every(each => list.includes(each))) mem.party.setBadge("letters", 3)
    }
    mem.reading = list.indexOf(key)
}

// What each letter was answered with, shown under it in Cartas: a step's right answer; for the
// final letter, the other teams' passwords taken so far
function titleOf(key) {
    if (key === "wrong") return "Carta (Incorrecto)"
    const { step } = parse(key)
    return mem.isQueen(step) ? "Carta de Pentacoro" : mem.isSecret(step) ? "Carta Secreta" : mem.isFinal(step) ? "Carta Final" : "Carta " + (step + 1)
}
mem.answerOf = (step) => mem.isFinal(step) ? Object.values(mem.otherTeams()).join(" · ") : mem.party.flag(mem.id, "answers")?.[step] || ""
mem.noteAnswer = async (step, entry) => {
    if (!mem.isFinal(step)) await mem.party.setFlag(mem.id, "answers", { ...mem.party.flag(mem.id, "answers"), [step]: entry })
    mem.party.updateDetail("letters", titleOf(keyOf(step)), mem.answerOf(step))
}

// Every password that opened a letter, for the results at the end: whose it was, whether real
// or fake (or the player's own code from spades' papers), on which letter, and when
mem.logEntry = async (step, entry) => {
    const whose = mem.whoseEntry(entry)
    const record = { step, entry, kind: whose ? whose.kind : "code", from: whose?.player.name || null, at: Date.now() }
    await mem.party.setFlag(mem.id, "entries", [...(mem.party.flag(mem.id, "entries") || []), record])
}

// The "Incorrecto" says only that; any other letter its text
mem.showLetterOf = (step, wrong) => wrong ? mem.showLetterText("", mem.wrong) : mem.showLetterText(mem.letterOf(step), null)

const solved = (step) => step < mem.party.stepsSolved(mem.id)
const finished = () => mem.party.stepsSolved(mem.id) >= mem.letters.length

// The button under the letter: answered letters are sent again, the open one investigated, the
// final one answered. The secret letter has none.
mem.labelButton = () => {
    // Mariana alone answers the secret letter, and then her own, once
    const herTurn = mem.isMariana && ((mem.isSecret(mem.step) && !mem.received().includes("queen")) || (mem.isQueen(mem.step) && !mem.party.flag(mem.id, "queenAnswered")))
    mem.investigate.hidden = (mem.isSecret(mem.step) || mem.isQueen(mem.step)) && !herTurn && !mem.firstEnding()
    mem.investigate.textContent = mem.firstEnding() ? "Continuar" : solved(mem.step) && !mem.isFinal(mem.step) && !herTurn ? "Reenviar" : "Responder"
}

// The black letter and the secret one, the first time each: read, it only goes on to its text
// (won, complete), and back to the desktop. Answering it comes on coming back to it.
const endingOf = () => mem.isFinal(mem.step) ? "done" : mem.isSecret(mem.step) ? "complete" : null
mem.firstEnding = () => !!endingOf() && !mem.storySeen(endingOf())
mem.answerPressed = () => {
    if (mem.busy || mem.view !== "letter") return
    if (!mem.firstEnding()) return mem.openTypewriter()
    mem.showStory(endingOf())
    mem.labelButton()
}

// The letter at a place in the strip becomes the one on the desk, and the one answered next
function showReceived(index) {
    const { step, wrong } = parse(mem.received()[index])
    mem.reading = index
    mem.step = step
    mem.setStepCategory(step)
    mem.dressLetter(step, wrong)
    mem.showLetterOf(step, wrong)
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
    // sealed again: from envelope to envelope, the strip's ends being its ends
    if (mem.view === "mail" && mem.envelopes) {
        const to = mem.reading + by
        if (to >= 0 && to < mem.received().length) await slideEnvelope(to, by)
        return
    }
    if (mem.view !== "letter" && mem.view !== "done") return
    const list = mem.received()
    const from = mem.view === "done" ? list.length : mem.reading
    const to = from + by
    if (to < 0 || to > list.length) return
    // past the newest: turned over to answer, or the closing note once all are answered
    // the final letter can be answered until the secret one is in
    const newest = list.at(-1)
    const answerable = !finished() || newest === "final" || (mem.isMariana && ((newest === "secret") || (newest === "queen" && !mem.party.flag(mem.id, "queenAnswered"))))
    // the black and the secret letter, the first time, lead on to their text, not the typewriter
    if (to === list.length && mem.firstEnding()) return mem.answerPressed()
    if (to === list.length && answerable) return mem.openTypewriter(true)
    await slideTo(to, by)
}

// A letter opened from the Cartas folder: the strip slides straight to it
// A letter opened from the Cartas folder comes back sealed: its envelope falls in as when it
// first arrived, and until one is opened every letter is in its envelope again, the strip
// sliding from envelope to envelope
mem.envelopes = false
mem.showLetter = async (key) => {
    const to = mem.received().indexOf(mem.letterKey(key))
    if (to < 0 || mem.busy || !["letter", "done", "mail"].includes(mem.view)) return
    mem.busy = true
    mem.envelopes = true
    mem.stage.classList.remove("done")
    showReceived(to)
    mem.view = "mail"
    mem.placeMailAbove()
    await mem.arrive()
    mem.busy = false
}

async function slideEnvelope(to, by) {
    mem.busy = true
    mem.tiltReset()
    const width = mem.stage.clientWidth
    await mem.tween(mem.tilt, `translateX(${-by * width}px)`, 260, "cubic-bezier(0.5, 0, 0.9, 0.5)")
    showReceived(to)
    mem.setFolded()
    mem.tilt.style.transform = `translateX(${by * width}px)`
    await mem.tween(mem.tilt, "translateX(0px)", 340, slide)
    mem.tilt.style.transform = ""
    mem.busy = false
}

// The sheet on the desk slides out and the one at a place in the strip (or, past the end, the
// closing note) slides in, the way by points
async function slideTo(to, by) {
    const list = mem.received()
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
