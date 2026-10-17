import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"
import {letters, wrong, finished} from "./letters.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party = Task.get("Party").mem
mem.id    = "webdetective"
// Where each team's hint for the second step is in the hint book. Spades has the artifact
// hunt on that step instead, so no hint. Placeholder numbers: set them to the book's.
mem.hintEntries = { hearts: 2, clubs: 3, diamonds: 4 }
mem.hintStep = 1
mem.team  = mem.party.player?.team || null

mem.letters  = letters
mem.wrong    = wrong
mem.finished = finished

// Each step's password for each team. For testing, the team's name: replace them.
// Letters (Ñ included) and digits only, as the typewriter has no other keys.
mem.passwords = [
    { spades: "PICAS", hearts: "CORAZONES", clubs: "TREBOLES", diamonds: "DIAMANTES" },
    { spades: "PICAS", hearts: "CORAZONES", clubs: "TREBOLES", diamonds: "DIAMANTES" },
]

// Spades finds an artifact for the second step; everything else is solved alone
mem.categoryOf = (step) => step === 1 && mem.team === "spades" ? "artifact" : "solo"
mem.artifactPlace = "kitchen"   // where the artifact is hidden, for its badge
mem.artifactPhotos = [
    "/plexos/app/game/WebDetective/img/artifact-1.png",
    "/plexos/app/game/WebDetective/img/artifact-2.png",
]

// A player without a team (only while testing) gets the first team's
const teamOf = (entry) => entry[mem.team] ?? Object.values(entry)[0]
mem.passwordOf = (step) => teamOf(mem.passwords[step])
mem.letterOf = (step) => teamOf(mem.letters[step])

mem.step  = 0
mem.view  = "mail"
mem.busy  = false
mem.entry = ""

mem.root  = task.node.querySelector(".puzzle")
mem.stage = mem.root.querySelector(".stage")
