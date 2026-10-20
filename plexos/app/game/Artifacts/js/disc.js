import {getTask} from "/plexos/lib/functions/dll.js"
import {codes, teamColors} from "/plexos/app/game/StarDisc/disc.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 2. Clubs' artifact, the disc and the star: lined up with the player's team's line, the
// star's marked tips read the team's code. The screen shows the artifact and that line's color,
// and takes the three digits (entry.js).
mem.buildDisc = (solved) => {
    const hint = mem.el("div", "disc-hint")
    const artifact = mem.el("img")
    artifact.src = "/plexos/app/game/StarDisc/icon.svg"
    artifact.alt = ""
    hint.append(artifact)
    hint.insertAdjacentHTML("beforeend", `<svg viewBox="0 0 48 10" class="disc-line"><line x1="5" y1="5" x2="43" y2="5" stroke="${teamColors[mem.routeTeam]}" stroke-width="6" stroke-linecap="round"/></svg>`)
    const { slots, pad } = mem.codeEntry(codes[mem.routeTeam], solved)
    mem.screen.append(hint, slots, pad)
}
