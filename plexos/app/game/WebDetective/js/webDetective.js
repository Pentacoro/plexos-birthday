import {getTask} from "/plexos/lib/functions/dll.js"
import {leave} from "/plexos/app/game/Party/backStack.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Each step is a letter that arrives, is read, and gets answered with a password on the
// typewriter. A right answer goes off in an envelope and the next letter falls in.

// After a wrong answer the same letter comes back, headed with the verdict
mem.startStep = async (step, { wrong = false } = {}) => {
    mem.step = step
    mem.view = "mail"
    mem.busy = true
    mem.setStepCategory(step)
    mem.showLetterText(mem.letterOf(step), wrong ? mem.wrong : null)
    mem.receive(step, wrong)
    mem.labelButton()
    mem.dressLetter(step, wrong)
    mem.placeMailAbove()
    await mem.arrive()
    mem.busy = false
}

mem.readMail = async () => {
    if (mem.busy || mem.view !== "mail") return
    mem.busy = true
    await mem.openMail()
    // one opened, and the letters are letters again
    mem.envelopes = false
    mem.view = "letter"
    mem.stage.classList.add("reading")
    mem.busy = false
}

// The carriage returns, the page leaves the typewriter, folds, and goes off in an envelope.
// A right answer is saved first, so nothing is lost if the window closes mid-animation, and
// the open letter comes, or the closing note once all are answered. After a wrong one, the same
// letter comes back headed "Incorrecto". Letters sent again ("Reenviar") work the same way.
mem.submitStep = async (correct) => {
    mem.busy = true
    mem.view = "sending"
    leave(mem.typewriterBack)
    mem.typewriterBack = null
    if (correct && mem.step < mem.letters.length) await mem.party.solveStep(mem.id, mem.step + 1)
    // a password of another team on the final letter is kept, to stay written on it
    if (correct && mem.isFinal(mem.step)) await mem.party.setFlag(mem.id, "otherTeams", { ...mem.otherTeams(), [mem.teamOfEntry(mem.entry)]: mem.entry })
    if (correct && mem.step <= mem.letters.length) await mem.noteAnswer(mem.step, mem.entry)
    await mem.returnCarriage()
    mem.stage.classList.remove("typing")
    const g = mem.geometry()
    await Promise.all([
        mem.tween(mem.machine, "translateY(110%)", 500, "cubic-bezier(0.5, 0, 0.8, 0.4)"),
        mem.letterTo(g.center, 550),
    ])
    await mem.fold()
    await mem.sendMail()
    const open = mem.party.stepsSolved(mem.id)
    // Mariana's heart brings the velvet letter; her answer to it is the very last
    if (mem.isSecret(mem.step)) await mem.startStep(mem.letters.length + 2)
    else if (mem.isQueen(mem.step)) {
        await mem.party.setFlag(mem.id, "queenAnswered", true)
        mem.finish()
    }
    // the final letter always comes back, until three other teams have answered it
    else if (mem.isFinal(mem.step)) await mem.startStep(Object.keys(mem.otherTeams()).length >= 3 ? mem.letters.length + 1 : mem.step)
    else if (!correct) await mem.startStep(mem.step, { wrong: true })
    else if (open < mem.letters.length) await mem.startStep(open)
    else if (!mem.received().includes("final")) await mem.startStep(mem.letters.length)
    else mem.finish()
}

// A letter's look and answer sheet: the final one on black paper in a black and gold envelope,
// with the passwords already taken written above the line; the secret one in the team's color
// each letter's envelope in its file icon's color: the second step's teal for spades and clubs,
// purple for hearts and diamonds, to sit well with their stamp; its "Incorrecto" plain white,
// without stamp or seal. The final and secret ones dress themselves.
mem.secondColor = ["spades", "clubs"].includes(mem.team) ? "teal" : "purple"
const envelopes = [["#f2d27e", "#e0525c"], [mem.secondColor === "teal" ? "#1f6f78" : "#7660A9", "#f4f2ee"]]
mem.dressLetter = (step, wrong = false) => {
    const color = envelopes[step]?.[wrong ? 1 : 0]
    mem.stage.classList.toggle("plain", step === 1 && wrong)
    if (color) mem.stage.style.setProperty("--env", color)
    else mem.stage.style.removeProperty("--env")
    if (mem.isFinal(step)) mem.stage.style.setProperty("--env", "#1a1a20")
    if (mem.isSecret(step)) mem.stage.style.setProperty("--env", "var(--team-color)")
    if (mem.isQueen(step)) mem.stage.style.setProperty("--env", "#6e0f22")
    mem.letter.classList.toggle("rose", mem.isQueen(step))
    mem.stage.classList.toggle("velvet", mem.isQueen(step))
    mem.setWriting(mem.writing(step))
    mem.buildAnswer(mem.writing(step) === "password" ? mem.answerLength(step) : 0)
    mem.writeHistory(mem.isFinal(step) ? Object.values(mem.otherTeams()) : [])
    mem.letter.classList.toggle("noir", mem.isFinal(step))
    mem.stage.classList.toggle("premium", mem.isFinal(step))
    mem.stage.classList.toggle("secret", mem.isSecret(step))
}

mem.finish = () => {
    mem.view = "done"
    mem.busy = false
    mem.doneNote.textContent = mem.finished
    mem.stage.classList.add("done", "mail-gone")
    mem.setStepCategory(mem.letters.length - 1)
}
