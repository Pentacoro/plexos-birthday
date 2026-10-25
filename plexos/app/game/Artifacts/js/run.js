import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// once the safe is done, the drawing slide is due — clear it from seen so tellStory shows it
if (mem.ownDone() && !mem.party.flag("story", "drawingShown")) {
    await mem.party.setFlag("story", "drawingShown", true)
    const seen = mem.party.flag("story", "artifacts") || []
    await mem.party.setFlag("story", "artifacts", seen.filter(p => p !== "drawing"))
}

// Picks up at the first stage not yet solved; with the own route done, at the routes
if (mem.ownDone()) mem.showRoutes()
else mem.showStage(Math.min(mem.routeSteps(), mem.stages.length - 1))
task.focus()
