import {getTask} from "/plexos/lib/functions/dll.js"
import {pushBack, leave} from "/plexos/app/game/Party/backStack.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The page in the typewriter holds one dash per character of the password. The line stays put
// and the typebars travel along it, always striking the next empty dash.
mem.answer = mem.stage.querySelector(".answer")
mem.typewriterBack = null

mem.buildAnswer = (length) => {
    mem.slotsRow.replaceChildren()
    for (let i = 0; i < length; i++) mem.slotsRow.append(document.createElement("span"))
    mem.slotsRow.style.setProperty("--n", length)
    mem.entry = ""
    mem.renderAnswer()
}

mem.renderAnswer = () => {
    const slots = [...mem.slotsRow.children]
    slots.forEach((slot, i) => {
        const char = mem.entry[i] || ""
        if (slot.textContent === char) return
        slot.textContent = char
        // each letter lands a little unevenly, as typed ones do
        slot.style.transform = char ? `translate(${(Math.random() - 0.5) * 1.6}px, ${(Math.random() - 0.5) * 2}px) rotate(${(Math.random() - 0.5) * 4}deg)` : ""
    })
    mem.alignCarriage()
}

// Like a carriage, the sheet slides sideways for the dash typed next, and the typebars cover
// the rest of the way to it. The sheet travels from right to left as the line fills, but never
// past the screen's edges, so the whole line is always in view; it starts where every dash can
// be counted. Off the typewriter the sheet stays centred.
mem.placeCarriage = () => {
    const slots = mem.slotsRow.children
    const slot = slots[Math.min(mem.entry.length, slots.length - 1)]
    if (!slot || !slot.offsetWidth) return false
    const reach = Math.max(0, (mem.stage.clientWidth - mem.letter.offsetWidth) / 2 - 10)
    const progress = slots.length > 1 ? Math.min(mem.entry.length, slots.length - 1) / (slots.length - 1) : 0
    mem.letterX = reach * (1 - 2 * progress)
    mem.typebars.style.left = (mem.letter.offsetLeft + mem.letterX + slot.offsetLeft + slot.offsetWidth / 2) + "px"
    return true
}

mem.alignCarriage = () => {
    if (mem.view !== "desk" || !mem.placeCarriage()) return
    mem.tween(mem.letter, `translate(${mem.letterX}px, ${mem.letterY}px)`, 120, "ease-out")
}

// The carriage springs back to the middle once the line is done
mem.returnCarriage = async () => {
    mem.typebars.style.left = ""
    mem.letterX = 0
    await mem.tween(mem.letter, `translate(0px, ${mem.letterY}px)`, 480, "cubic-bezier(0.3, 1.6, 0.5, 1)")
}

// The typebars meet where the page's line is, and reach down to the top of the machine
mem.layoutTypebars = () => {
    const g = mem.geometry()
    const line = mem.letter.offsetTop + g.desk + mem.answer.offsetTop + mem.slotsRow.offsetTop + mem.slotsRow.offsetHeight * 0.55
    mem.typebars.style.top = line + "px"
    mem.alignCarriage()
    // each bar is as long as it takes to reach the machine at its own angle
    const drop = Math.max(40, mem.machine.offsetTop - line + 4)
    for (const bar of mem.bars) bar.style.height = drop / Math.cos(bar.dataset.angle * Math.PI / 180) + "px"
}

// Turned (swiped past the newest letter), the sheet goes off to the left and comes back from
// the left as the page to write on, as if turned over
mem.openTypewriter = async (turn = false) => {
    if (mem.busy || mem.view !== "letter") return
    mem.busy = true
    // not "desk" yet, so nothing nudges the carriage while the sheet is on its way
    mem.view = "opening"
    mem.typewriterBack = pushBack(() => mem.closeTypewriter(true))
    mem.stage.classList.remove("reading")
    const width = mem.stage.clientWidth
    if (turn) await mem.tween(mem.letter, `translate(${-width}px, ${mem.letterY}px)`, 220, "cubic-bezier(0.5, 0, 0.9, 0.5)")
    mem.showAnswerSheet()
    mem.renderAnswer()
    mem.layoutTypebars()
    // the sheet goes in one move straight to where the carriage starts
    const g = mem.geometry()
    mem.letterY = g.desk
    mem.placeCarriage()
    if (turn) mem.letter.style.transform = `translate(${-width}px, ${mem.letterY}px)`
    await Promise.all([
        mem.tween(mem.letter, `translate(${mem.letterX}px, ${mem.letterY}px)`, 500, "cubic-bezier(0.3, 0.7, 0.3, 1)"),
        mem.tween(mem.machine, "translateY(0)", 550, "cubic-bezier(0.2, 0.8, 0.3, 1)"),
    ])
    mem.view = "desk"
    mem.stage.classList.add("typing")
    mem.busy = false
}

// Back to the letter. The back button has already taken its history step; otherwise it goes here.
// Turned (swiped right), the page goes off to the right and the letter comes back from there.
mem.closeTypewriter = async (byBack = false, turn = false) => {
    if (mem.view !== "desk") return
    if (!byBack) leave(mem.typewriterBack)
    mem.typewriterBack = null
    mem.busy = true
    mem.view = "letter"
    mem.stage.classList.remove("typing")
    const g = mem.geometry()
    const width = mem.stage.clientWidth
    const away = turn
        ? mem.tween(mem.letter, `translate(${width}px, ${mem.letterY}px)`, 220, "cubic-bezier(0.5, 0, 0.9, 0.5)")
        : mem.letterTo(g.center, 500)
    const lowered = mem.tween(mem.machine, "translateY(110%)", 450, "cubic-bezier(0.5, 0, 0.8, 0.4)")
    await away
    mem.showLetterText(mem.letterOf(mem.step))
    if (turn) {
        mem.letter.style.transform = `translate(${width}px, ${g.center}px)`
        await mem.letterTo(g.center, 320, "cubic-bezier(0.25, 0.8, 0.3, 1)")
    }
    await lowered
    mem.stage.classList.add("reading")
    mem.busy = false
}

// A key swings its typebar up to the page; the letter lands as it hits
mem.strike = (char, bar) => {
    if (mem.busy || mem.view !== "desk") return
    const length = mem.slotsRow.children.length
    if (mem.entry.length >= length) return
    mem.answer.classList.remove("wrong")
    const arm = mem.bars[bar]?.firstChild
    arm?.animate(
        [{ transform: "scaleY(0.25)" }, { transform: "scaleY(1)", offset: 0.45 }, { transform: "scaleY(0.25)" }],
        { duration: 190, easing: "ease-out" },
    )
    setTimeout(() => {
        if (mem.entry.length >= length) return
        mem.entry += char
        mem.renderAnswer()
    }, 80)
}

mem.erase = () => {
    if (mem.busy || mem.view !== "desk" || !mem.entry) return
    mem.entry = mem.entry.slice(0, -1)
    mem.renderAnswer()
}

// Only the right password is sent. Anything else shakes the page and clears it.
// Whatever is written goes, right or wrong, so it pays to be sure first. Only a line with
// every dash filled can be sent; an unfinished one just shakes.
mem.send = async () => {
    if (mem.busy || mem.view !== "desk") return
    if (mem.entry.length === mem.slotsRow.children.length) return mem.submitStep(mem.entry === mem.passwordOf(mem.step))
    void mem.answer.offsetWidth
    mem.answer.classList.add("wrong")
}
