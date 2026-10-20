import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Artifact 4 on the desktop: hearts' card. The numbers 0 to 9 stay put on the left; the column
// beside them is one team's symbols, and the suits along the top pick which, sliding the
// columns across as on a strip.
mem.root    = task.node.querySelector(".artifact")
mem.suits   = mem.root.querySelector(".suits")
mem.numbers = mem.root.querySelector(".numbers")
mem.peek    = mem.root.querySelector(".peek")
mem.strip   = mem.root.querySelector(".strip")
mem.column  = 0
