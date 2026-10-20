import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.drawPlayer()
mem.drawGames()
// kept current while open: progress moves in the other games, and games open with the clock
mem.refresh = setInterval(() => { if (task.window?.node?.style.display !== "none") mem.drawGames() }, 2000)
task.focus()
