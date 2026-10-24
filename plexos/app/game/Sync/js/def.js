import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"
import {sideOf, pairName, random, pairState, setPairState} from "/plexos/app/game/Sync/pairs.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party = Task.get("Party").mem
mem.id    = "sync"
// a player without a team (only while testing) plays as spades
mem.team  = mem.party.player?.team || "spades"

// Three stages, each with both partners on their own side of it, then done
mem.stages = ["path", "stack", "call"]
// Each stage's entry in the hint book. Placeholders: set them to the book's numbers.
mem.hintEntries = [6, 7, 8]
// Artifact 4, in the storage room: hearts needs it to read the code they are told on the phone
mem.artifactPlace = "galpon"
mem.artifactPhotos = [
    "/plexos/app/game/Sync/img/artifact-1.png",
    "/plexos/app/game/Sync/img/artifact-2.png",
]
mem.doneText = "Lorem ipsum: sincronización completa."

// The team being played with, and what follows from it: this player's side, and the seed both
// phones build the puzzles from. Every team played with keeps its own progress (pairs.js). With
// the own team, each player picks a role instead: the Tecleador plays side 1.
mem.player  = mem.party.player?.name || ""
mem.partner = mem.party.flag(mem.id, "pair") || null
mem.state = () => pairState(mem.party, mem.partner)
mem.setState = (patch) => setPairState(mem.party, mem.partner, patch)
mem.pairWith = (partner) => {
    mem.partner = partner
    mem.side = partner === mem.team ? (mem.state().role === "tecleador" ? 1 : 2) : sideOf(mem.team, partner)
    mem.pair = pairName(mem.team, partner)
    mem.rand = (label) => random(mem.pair + ":" + label)
}
if (mem.partner) mem.pairWith(mem.partner)

mem.stage = 0
mem.busy  = false

mem.root   = task.node.querySelector(".puzzle")
mem.light  = mem.root.querySelector(".light")
mem.screen = mem.root.querySelector(".screen")
mem.next   = mem.root.querySelector(".next")
