import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Estado: who the player is (team, name, card, the team's code) and how far they are in each
// game, one row per game, read from what the Party keeps
mem.party = Task.get("Party").mem
mem.player = mem.party.player
mem.team = mem.party.teams[mem.player?.team] || null

mem.root  = task.node.querySelector(".status")
mem.games = mem.root.querySelector(".games")
