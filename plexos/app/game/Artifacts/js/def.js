import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"
import {equations} from "/plexos/app/game/Artifacts/equations.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party  = Task.get("Party").mem
mem.id     = "artifacts"
mem.player = mem.party.player?.name || ""
// a player without a team (only while testing) plays as spades
mem.team   = mem.party.player?.team || "spades"

// The fifth puzzle needs every team's artifact, so every team gives something to it: six
// stages in a row, each opening the next. Only the first is designed so far.
mem.stages = ["equation", "soon", "soon", "soon", "soon", "soon"]
// Each stage's entry in the hint book. Placeholders: set them to the book's numbers.
mem.hintEntries = [9]

// This player's equation; one of their team's for a player not on the list (only while testing)
mem.equation = equations[mem.player]
    || Object.entries(equations).find(([name]) => mem.party.players.find(p => p.name === name)?.team === mem.team)?.[1]

// The items, as each team's phone character sends them: the unknowns in the equations
mem.itemIcon = (team) => "/plexos/app/game/Party/img/item-" + team + ".svg"

mem.busy = false

mem.root   = task.node.querySelector(".puzzle")
mem.dots   = mem.root.querySelector(".stage-dots")
mem.screen = mem.root.querySelector(".screen")
