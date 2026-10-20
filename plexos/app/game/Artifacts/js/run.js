import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Picks up at the first stage not yet solved; with the own route done, at the routes
if (mem.ownDone()) mem.showRoutes()
else mem.showStage(Math.min(mem.routeSteps(), mem.stages.length - 1))
task.focus()
