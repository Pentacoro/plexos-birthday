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
    mem.buildAnswer(mem.passwordOf(step).length)
    mem.placeMailAbove()
    await mem.arrive()
    mem.busy = false
}

mem.readMail = async () => {
    if (mem.busy || mem.view !== "mail") return
    mem.busy = true
    await mem.openMail()
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
    if (correct) await mem.party.solveStep(mem.id, mem.step + 1)
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
    if (!correct) await mem.startStep(mem.step, { wrong: true })
    else if (open < mem.letters.length) await mem.startStep(open)
    else mem.finish()
}

mem.finish = () => {
    mem.view = "done"
    mem.busy = false
    mem.doneNote.textContent = mem.finished
    mem.stage.classList.add("done", "mail-gone")
    mem.setStepCategory(mem.letters.length - 1)
}
