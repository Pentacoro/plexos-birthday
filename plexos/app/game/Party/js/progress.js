import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Lives in the player's own core, so it saves with it
mem.progressPath = "@/plexos/cfg/party/progress.json"

mem.loadProgress = () => {
    let saved = {}
    try { saved = JSON.parse(File.at(mem.progressPath)?.data || "{}") } catch { /* start over */ }
    mem.progress = { spawned: [], steps: {}, flags: {}, ...saved }
}

mem.saveProgress = async () => {
    await task.cmd("file.write", { path: mem.progressPath, data: JSON.stringify(mem.progress, null, "\t") })
}

// How many steps of a puzzle this player has solved
mem.stepsSolved = (id) => mem.progress.steps[id] || 0

mem.solveStep = async (id, step) => {
    if (mem.stepsSolved(id) >= step) return
    mem.progress.steps[id] = step
    await mem.saveProgress()
    // a team's item comes once its phone code and its artifact's puzzle are both solved
    mem.deliverItem()
}

// Anything else a puzzle needs to remember, such as whether a line was already called
mem.flag = (id, key) => mem.progress.flags[id]?.[key]

mem.setFlag = async (id, key, value) => {
    mem.progress.flags[id] = { ...mem.progress.flags[id], [key]: value }
    await mem.saveProgress()
}
