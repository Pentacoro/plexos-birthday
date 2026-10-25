import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Each team's item: what their character on the phone sends once the 9 digits are right. The
// own item arrives once Fibonacci is finished; all four arrive together on the safe's first stage.
mem.items = {
    spades:   { name: "5 Lapiceras" },
    hearts:   { name: "12 Bombones" },
    clubs:    { name: "7 Pesos" },
    diamonds: { name: "3 Piezas de Cubo Rubik" },
}

// Checked whenever a step is solved (progress.js): kept once, with its notice.
mem.deliverItem = () => {
    if (mem.stepsSolved("artifacts") >= 1) for (const [each, item] of Object.entries(mem.items)) {
        mem.record("items", item.name, each, { detail: mem.stamp(), image: "/plexos/app/game/Party/img/item-" + each + ".svg" })
    }
    const team = mem.player?.team
    if (!mem.items[team]) return
    if (mem.stepsSolved("fibonacci") < 2) return
    const item = mem.items[team]
    // beside Inventario's folders, with when it came, as they show when they last changed
    mem.record("items", item.name, team, { detail: mem.stamp(), image: "/plexos/app/game/Party/img/item-" + team + ".svg" })
}

// The drawing reward: delivered once the safe is finished (all 6 stages solved)
mem.deliverDrawing = () => {
    if (mem.stepsSolved("artifacts") < 6) return
    const name = mem.player?.name || ""
    mem.record("drawing", "Mi Dibujo", name, { detail: mem.stamp(), image: "/plexos/app/game/Drawing/icon.svg" })
}
