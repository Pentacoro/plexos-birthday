import {getTask} from "/plexos/lib/functions/dll.js"
import {isUnlocked, unlockTime, firstUnlock, clock} from "/plexos/app/game/Party/puzzles.js"
import {gameState} from "/plexos/app/game/Party/completion.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Where the player is in each game (Party's completion.js). Locked games say when they open.
const zone = "America/Argentina/Buenos_Aires"
const hour = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone })
const date = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "numeric", timeZone: zone })

// On the party date, 24/10, the hour is enough. Any other day, the label names the date too.
const opens = (time) => {
    const when = hour.format(time)
    return "Abre " + (date.format(clock()) === date.format(firstUnlock) ? when : date.format(time) + " " + when)
}

// A game's row: its state, or when it opens. The phone shows as a preview until its time.
mem.stateOf = (puzzle) => {
    if (!isUnlocked(puzzle)) return puzzle.preview ? ["locked", "Vista previa"] : ["locked", opens(unlockTime(puzzle))]
    return gameState(mem.party, puzzle.id)
}
