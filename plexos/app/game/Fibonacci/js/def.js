import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party = Task.get("Party").mem
mem.id    = "fibonacci"
// where this puzzle's hints are in the hint book
mem.hintEntry = 1
mem.team  = mem.party.player?.team || null

// Step 1: dial a 7 digit number. Each team's number is the sequence that starts from one
// number of the birthday: age, day, month, year.
mem.numberLength = 7
mem.seeds = {
    spades:   { hint: "ee", seed: "27" },
    hearts:   { hint: "dd", seed: "19" },
    clubs:    { hint: "mm", seed: "10" },
    diamonds: { hint: "aa", seed: "99" },
}
// The plain Fibonacci sequence reaches a character who points at the hints
mem.introNumber = "1123581"
// A secret number nobody answers (void.js)
mem.voidNumber = "0000000"

// Step 2: the team's character asks for 9 digits, three ID card codes in this order.
// "artifact" is the code clubs finds hidden in the house instead of on a card.
mem.artifactCode = "357"
// Artifact 1: the hint photos for finding it
mem.artifactPlace = "living"   // where the artifact is hidden, for its badge
mem.artifactPhotos = [
    "/plexos/app/game/Fibonacci/img/artifact-1.png",
    "/plexos/app/game/Fibonacci/img/artifact-2.png",
]
mem.codeParts = {
    spades:   ["hearts", "diamonds", "clubs"],
    hearts:   ["clubs", "diamonds", "spades"],
    clubs:    ["artifact", "spades", "diamonds"],
    diamonds: ["spades", "hearts", "clubs"],
}

mem.mode  = "dial"
mem.entry = ""

mem.root = task.node.querySelector(".puzzle")
