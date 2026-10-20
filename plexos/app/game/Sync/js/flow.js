import {getTask} from "/plexos/lib/functions/dll.js"
import {codeName} from "/plexos/app/game/Sync/pairs.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Each player goes through the stages at their own pace. A stage cleared stays cleared, with
// the bar white and "Siguiente" waiting, so there is time to pass on what it showed. Moving on
// is the step saved. The last stage cleared ends the game with this team, and another can be
// picked. Each code is kept under the team it came from.
const builders = { path: () => mem.buildPath, stack: () => mem.buildStack, call: () => mem.buildCall }
const cleared = () => mem.state().cleared ?? -1
const codeTitle = (stage) => codeName(mem.team, mem.partner, stage)
const last = () => mem.stages.length - 1

mem.showStage = (stage) => {
    mem.stage = stage
    mem.root.dataset.stage = mem.stages[stage]
    mem.root.classList.remove("finished")
    mem.screen.replaceChildren()
    mem.next.hidden = true
    mem.lightSet()
    mem.setStageBadges(stage)
    const solved = cleared() >= stage
    builders[mem.stages[stage]]()(solved)
    if (solved) afterClear(stage)
}

mem.clearStage = async () => {
    await mem.lightWin()
    await mem.setState({ cleared: mem.stage })
    // the first two stages' codes are kept; the third is kept when the phone gives it
    if (mem.stage === 0) mem.party.record("codes", codeTitle(0), mem.pathPuzzle().code)
    if (mem.stage === 1) mem.party.record("codes", codeTitle(1), mem.stackPuzzle().solution.join(""))
    if (mem.stage === last()) {
        await mem.setState({ done: true })
        await mem.party.solveStep(mem.id, 1)
        // synced with every team, own included: the codes hold everything
        if (Object.keys(mem.party.teams).every(team => mem.party.flag(mem.id, "pairs")?.[team]?.done)) mem.party.setBadge("codes", 3)
    }
    afterClear(mem.stage)
}

function afterClear(stage) {
    mem.lightSet("#fff")
    if (stage < last()) return mem.next.hidden = false
    mem.root.classList.add("finished")
    mem.tellStory()
    const another = mem.el("button", "pair-confirm", "Emparejar con otro equipo")
    another.type = "button"
    mem.pressKeys(another, () => !mem.busy && mem.showPairing())
    another.dataset.key = "another"
    // the first tap only asks, so a stray one doesn't throw the pairing away
    const reset = mem.el("button", "pair-confirm pair-reset", "Reiniciar emparejamiento")
    reset.type = "button"
    reset.dataset.key = "reset"
    mem.pressKeys(reset, () => {
        if (mem.busy) return
        if (!reset.classList.contains("asking")) {
            reset.classList.add("asking")
            reset.textContent = "¿Seguro? Tocá otra vez"
            return
        }
        mem.resetPair()
    })
    mem.screen.append(mem.el("p", "done-note", mem.doneText), another, reset)
}

// This pairing from the start: every stage, the code heard on the phone, and with the own team
// the roles too. The codes already kept stay in the Inventario.
mem.resetPair = async () => {
    mem.busy = true
    const pairs = { ...mem.party.flag(mem.id, "pairs") }
    delete pairs[mem.partner]
    await mem.party.setFlag(mem.id, "pairs", pairs)
    mem.busy = false
    if (mem.partner === mem.team) return mem.showRoles()
    mem.pairWith(mem.partner)
    mem.showStage(0)
}

mem.advance = async () => {
    if (mem.busy || mem.next.hidden) return
    mem.busy = true
    await mem.setState({ stage: mem.stage + 1 })
    mem.busy = false
    mem.showStage(mem.stage + 1)
}
