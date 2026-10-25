import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// one-time: players who won before the fix had "drawing" marked seen without actually seeing it
if (mem.ownDone() && !mem.party.flag("story", "drawingRewound")) {
    const seen = mem.party.flag("story", "artifacts") || []
    if (seen.includes("drawing")) {
        await mem.party.setFlag("story", "artifacts", seen.filter(p => p !== "drawing"))
        await mem.party.setFlag("story", "drawingRewound", true)
    }
}

// Picks up at the first stage not yet solved; with the own route done, at the routes
if (mem.ownDone()) mem.showRoutes()
else mem.showStage(Math.min(mem.routeSteps(), mem.stages.length - 1))
task.focus()
