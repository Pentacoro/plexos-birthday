import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// For trying the game: the clock moved ahead to see the timed unlocks, unlocks forced either way,
// another team, a puzzle or everything started over. Only the test users have it.
mem.party = Task.get("Party").mem
mem.root  = task.node.querySelector(".trainer")
mem.now   = mem.root.querySelector(".trainer-now")
mem.clock = mem.root.querySelector(".clock")
mem.mode  = mem.root.querySelector(".mode")
mem.list  = mem.root.querySelector(".trainer-puzzles")
mem.teamRow  = mem.root.querySelector(".teams")
mem.progress = mem.root.querySelector(".trainer-progress")

// what the clock buttons move it by, in minutes; null is back to the real time, "party" to just
// before the first puzzle opens
mem.clockSteps = [["−30 min", -30], ["+30 min", 30], ["+1 h", 60], ["Fiesta", "party"], ["Hora real", null]]
mem.modes = [["Según archivo", null], ["Todo abierto", "true"], ["Por horario", "false"]]
