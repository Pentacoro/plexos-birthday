import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"
import {mazes} from "./mazes.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party = Task.get("Party").mem
mem.id    = "labyrinth"
mem.team  = mem.party.player?.team || null
mem.mazes = mazes

// The openings joined to each other, both ways: walking out of one comes in by the other. The
// first maze's way in leads nowhere, and the third's way out ends the labyrinth, once this
// team's own package is in hand. Diamonds' waits in their maze on the artifact.
const links = [
    ["first:exit", "second:entry"],
    ["first:exit-diamonds", "artifact:entry"],
    ["artifact:exit", "second:entry-diamonds"],
    ["second:exit", "third:entry"],
]
mem.ways = {}
for (const [a, b] of links) { mem.ways[a] = b; mem.ways[b] = a }
mem.ways["third:exit"] = "end"
mem.start = { maze: "first", enter: "entry" }

// The whole puzzle needs the teams together. Diamonds' own maze is on an artifact, whose
// hint photos show while they are in it. The hint book only covers the first maze.
mem.hintEntry = 5          // placeholder: set it to the book's number
mem.artifactPlace = "dining"   // where the artifact is hidden, for its badge
mem.artifactPhotos = [
    "/plexos/app/game/Labyrinth/img/artifact-1.png",
    "/plexos/app/game/Labyrinth/img/artifact-2.png",
]

mem.leg     = null       // the maze being walked and the way it was entered
mem.at      = null       // the player's cell, never shown
mem.picked  = new Set()  // packages picked up on this visit to the maze, any team's
mem.busy    = false

mem.root   = task.node.querySelector(".puzzle")
mem.matrix = mem.root.querySelector(".matrix")
mem.pad    = mem.root.querySelector(".pad")
