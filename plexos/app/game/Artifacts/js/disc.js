import {getTask} from "/plexos/lib/functions/dll.js"
import {readCode, codes, teamColors} from "/plexos/app/game/StarDisc/disc.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 2. Clubs' artifact, the disc and the star: lined up with the player's team's line,
// the star's tips (each carrying a symbol) read that player's code in their personal order.
mem.buildDisc = (solved) => {
    const hint = mem.el("div", "disc-hint")
    const artifact = mem.el("img")
    artifact.src = "/plexos/app/game/StarDisc/icon.svg"
    artifact.alt = ""
    hint.append(artifact)
    hint.insertAdjacentHTML("beforeend", `<svg viewBox="0 0 48 10" class="disc-line"><line x1="5" y1="5" x2="43" y2="5" stroke="${teamColors[mem.routeTeam]}" stroke-width="6" stroke-linecap="round"/></svg>`)
    const symbols = mem.mine?.starSymbols
    const code = symbols ? readCode(mem.routeTeam, symbols) : codes[mem.routeTeam]
    const { slots, pad } = mem.codeEntry(code, solved, symbols || [])
    mem.screen.append(hint, slots, pad)
}
