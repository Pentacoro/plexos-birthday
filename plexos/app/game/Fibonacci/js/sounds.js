import {getTask} from "/plexos/lib/functions/dll.js"
import {phone} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The phone's sounds live with every other sound, in Party's sound.js
mem.sound = phone
