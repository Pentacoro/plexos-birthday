import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Each team's item: what their character on the phone sends once the 9 digits are right. The
// order is on its way, and it arrives with the team's artifact, where the real one waits as a
// prop: it is only kept once the puzzle that needs that artifact is solved too. For clubs that
// is the phone itself.
mem.items = {
    spades:   { name: "5 Lapiceras" },
    hearts:   { name: "12 Bombones" },
    clubs:    { name: "7 Pesos" },
    diamonds: { name: "3 Piezas de Cubo Rubik" },
}

// the puzzle that needs each team's artifact, and the step that solves it
const artifactPuzzle = {
    clubs:    ["fibonacci", 2],
    spades:   ["webdetective", 2],
    diamonds: ["labyrinth", 1],
    hearts:   ["sync", 1],
}

// Checked whenever a step is solved (progress.js): kept once, with its notice. The safe's first
// stage, whose equation asks for them, brings every team's.
mem.deliverItem = () => {
    if (mem.stepsSolved("artifacts") >= 1) for (const [each, item] of Object.entries(mem.items)) {
        mem.record("items", item.name, each, { detail: mem.stamp(), image: "/plexos/app/game/Party/img/item-" + each + ".svg" })
    }
    const team = mem.player?.team
    if (!mem.items[team]) return
    const [id, step] = artifactPuzzle[team]
    if (mem.stepsSolved("fibonacci") < 2 || mem.stepsSolved(id) < step) return
    const item = mem.items[team]
    // beside Inventario's folders, with when it came, as they show when they last changed
    mem.record("items", item.name, team, { detail: mem.stamp(), image: "/plexos/app/game/Party/img/item-" + team + ".svg" })
}
