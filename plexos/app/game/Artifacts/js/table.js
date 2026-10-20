import {getTask} from "/plexos/lib/functions/dll.js"
import {players} from "/plexos/app/game/Party/players.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 3. Spades' artifact, four papers, a team's players on each with their own 3-digit
// code. The screen shows the papers and the player's name, to find on them, and takes their
// code (entry.js).
const papers = `<svg viewBox="0 0 48 48" class="papers" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><rect x="4" y="4" width="18" height="18" rx="1.5"/><rect x="26" y="4" width="18" height="18" rx="1.5"/><rect x="4" y="26" width="18" height="18" rx="1.5"/><rect x="26" y="26" width="18" height="18" rx="1.5"/><path d="M8 10h10M8 15h7M30 10h10M30 15h7M8 32h10M8 37h7M30 32h10M30 37h7" stroke-width="1.8"/></svg>`

mem.buildTable = (solved) => {
    const self = players.find(player => player.name === mem.route) || players.find(player => player.team === mem.routeTeam)
    const hint = mem.el("div", "table-hint")
    hint.innerHTML = papers
    hint.append(mem.el("span", "table-name", self?.name || ""))
    const { slots, pad } = mem.codeEntry(self?.code || "000", solved)
    mem.screen.append(hint, slots, pad)
}
