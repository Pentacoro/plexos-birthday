import {getTask} from "/plexos/lib/functions/dll.js"
import {showStory} from "/plexos/app/game/Party/story.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Where each team's package lands for delivery once it is picked up. Placed in the second or
// third maze, away from the direct path between their entry and exit openings.
const zones = {
    spades:   { maze: "second", cell: [4, 2] },
    clubs:    { maze: "second", cell: [0, 6] },
    hearts:   { maze: "third",  cell: [5, 5] },
    diamonds: { maze: "third",  cell: [4, 2] },
}

mem.dropZone     = (team) => zones[team] || null
mem.allDropTeams = () => Object.keys(zones)

mem.drops     = () => mem.party.flag(mem.id, "drops") || {}
mem.delivered = () => mem.party.flag(mem.id, "delivered") || []

// Spawn the delivery point for a team the first time their package is picked up
mem.spawnDrop = (team) => {
    const drops = mem.drops()
    if (drops[team] || !zones[team]) return
    mem.party.setFlag(mem.id, "drops", { ...drops, [team]: zones[team] })
}

// Pending (undelivered) drop points for a given maze
mem.pendingDrops = (maze) => {
    const drops = mem.drops()
    const done  = mem.delivered()
    return Object.entries(drops)
        .filter(([team, zone]) => zone.maze === maze && !done.includes(team))
        .map(([team, zone]) => ({ team, cell: zone.cell }))
}

// Called after each step: deliver a package if the player is standing on its drop cell
mem.checkDelivery = () => {
    for (const { team, cell } of mem.pendingDrops(mem.leg.maze)) {
        if (cell[0] !== mem.at[0] || cell[1] !== mem.at[1]) continue
        mem.party.setFlag(mem.id, "delivered", [...mem.delivered(), team])
        mem.drawMatrix()
        mem.sayTop(["Paquete entregado"])
        mem.updateIndicator?.()
        if (mem.complete()) showStory(task, mem.id, "complete")
    }
}
