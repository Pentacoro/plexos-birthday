import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The stages go in order: each one solved is a step of the puzzle, and the next one opens.
// A stage not designed yet only says so.
const builders = { equation: () => mem.buildEquation, soon: () => buildSoon }

function buildSoon() {
    mem.screen.append(mem.el("p", "soon", "Próximamente"))
}

mem.showStage = (stage) => {
    mem.stage = stage
    mem.root.dataset.stage = mem.stages[stage]
    mem.screen.replaceChildren()
    mem.drawDots(stage)
    mem.setStageBadges(stage)
    builders[mem.stages[stage]]()(mem.party.stepsSolved(mem.id) > stage)
}

// Solved: kept as a step, a moment to see it right, then the next stage
mem.clearStage = async () => {
    await mem.party.solveStep(mem.id, mem.stage + 1)
    await new Promise(resolve => setTimeout(resolve, 1100))
    if (mem.stage < mem.stages.length - 1) mem.showStage(mem.stage + 1)
}
