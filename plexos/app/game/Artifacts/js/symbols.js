import {getTask} from "/plexos/lib/functions/dll.js"
import {encode} from "/plexos/app/game/SymbolCard/card.js"
import {teamIcon} from "/plexos/app/game/Party/teams.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 5. Hearts' artifact, the card of symbols: the player's own code (perPlayer.js) written
// in their team's column, under its suit to say which column, decoded into three digits (entry.js)
mem.buildSymbols = (solved) => {
    const hint = mem.el("div", "symbols-hint")
    hint.append(teamIcon(mem.routeTeam))
    const word = mem.el("div", "symbols-word")
    for (const symbol of encode(mem.routeTeam, mem.mine.symbols)) word.append(mem.el("span", "", symbol))
    hint.append(word)
    const { slots, pad } = mem.codeEntry(mem.mine.symbols, solved)
    mem.screen.append(hint, slots, pad)
}
