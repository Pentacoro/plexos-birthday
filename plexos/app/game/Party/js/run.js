import {getTask} from "/plexos/lib/functions/dll.js"
import {startBackStack} from "./backStack.js"

let task = getTask(/TASKID/)
let mem  = task.mem

startBackStack()
mem.loadProgress()
mem.applyTrainerTeam()
await mem.checkUnlocks()
await mem.ensureInventory()
await mem.unlockEverything()
// A short poll rather than one long timer, because phones pause timers while the screen is off
mem.unlockTimer = setInterval(mem.checkUnlocks, 10000)
task.onEnd = () => clearInterval(mem.unlockTimer)
