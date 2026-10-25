import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The stages go in order: each one solved is a step of the route, and the next one opens. The
// last one done, the routes to choose from come (route.js).
const builders = { equation: () => mem.buildEquation, disc: () => mem.buildDisc, table: () => mem.buildTable, cells: () => mem.buildCells, symbols: () => mem.buildSymbols, password: () => mem.buildPassword }

mem.showStage = (stage) => {
    mem.stage = stage
    mem.root.dataset.stage = mem.stages[stage]
    mem.screen.replaceChildren()
    mem.drawDots(stage)
    mem.setStageBadges(stage)
    mem.tellStory()
    builders[mem.stages[stage]]()(mem.routeSteps() > stage)
    // the pad keeps one place on every stage: what the stage shows sits in the room above it
    const pad = mem.screen.querySelector(":scope > .keypad")
    if (pad) {
        const prompt = mem.el("div", "prompt")
        prompt.append(...[...mem.screen.children].filter(node => node !== pad))
        mem.screen.prepend(prompt)
    }
    // once the own route is done, any route leads back to the others
    if (!mem.ownDone()) return
    const routes = mem.el("button", "route-back", "Rutas")
    routes.type = "button"
    routes.onclick = () => mem.showRoutes()
    mem.screen.append(routes)
}

// Solved: kept as a step, a moment to see it right, then the next stage
mem.clearStage = async () => {
    await mem.solveRouteStep(mem.stage + 1)
    await new Promise(resolve => setTimeout(resolve, 1100))
    if (mem.stage < mem.stages.length - 1) mem.showStage(mem.stage + 1)
    else {
        mem.party.deliverDrawing?.()
        mem.showRoutes()
    }
}
