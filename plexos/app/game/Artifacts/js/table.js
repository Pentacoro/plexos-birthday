import {getTask} from "/plexos/lib/functions/dll.js"
import {players} from "/plexos/app/game/Party/players.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 3. Spades' artifact, four papers, a team's players on each with their own 3-digit
// code. The screen shows the papers and the player's name, to find on them, and takes their
// code (entry.js).
mem.buildTable = (solved) => {
    const self = players.find(player => player.name === mem.route) || players.find(player => player.team === mem.routeTeam)
    const hint = mem.el("div", "table-hint")
    const artifact = mem.el("img")
    artifact.src = "/plexos/app/game/CodeTable/icon.svg"
    artifact.alt = ""
    hint.append(artifact, mem.el("span", "table-name", self?.name || ""))
    const { slots, pad } = mem.codeEntry(self?.code || "000", solved)
    mem.screen.append(hint, slots, pad)
}
