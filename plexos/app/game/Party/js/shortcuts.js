import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import Icon from "/plexos/lib/classes/interface/icon.js"
import Task from "/plexos/lib/classes/system/task.js"
import {puzzles, tools, isUnlocked} from "./puzzles.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.desktopPath = "@/home/desks/desktop"

// Icon coordinates for the desktop cell in a corner: its column and row, and where it sits
mem.cornerCoords = (corner) => {
    const grid = Task.get("Desktop")?.mem?.grid?.gridArr
    if (!grid?.length || !grid[0]?.length) return null
    const ax = corner.endsWith("right") ? grid.length - 1 : 0
    const ay = corner.startsWith("bottom") ? grid[0].length - 1 : 0
    const cell = grid[ax][ay]
    return { px: cell.posX, py: cell.posY, tx: cell.posX, ty: cell.posY, ax, ay }
}

// Shortcuts are .game files holding the id that open.ls reads. Each one appears once:
// a tool at the first login, a puzzle when its time comes.
mem.spawnShortcut = async (entry) => {
    const name = entry.name + ".game"
    const folder = entry.folder || mem.desktopPath
    const path = folder + "/" + name
    if (!File.at(path)) {
        const icon = new Icon({ name, class: "StringFile", exte: "game", state: 0 })
        // The desktop places an icon by the coordinates it comes with. They have to be there
        // before the file exists, because creating it already draws the icon.
        const coords = entry.corner && mem.cornerCoords(entry.corner)
        if (coords) icon.coords = coords
        await task.cmd("file.create", { path: folder, Type: "StringFile", name, icon, content: entry.id })
        // a new file's configuration always starts without a picture, so it gets one after
        await task.cmd("file.modify", { path, cfg: { icon: { image: entry.icon } } })
        File.refreshViews()
    }
    mem.progress.spawned.push(entry.id)
    await mem.saveProgress()
}

mem.checkUnlocks = async () => {
    for (const entry of [...tools, ...puzzles]) {
        // a tool that now lives in a folder leaves the desktop it was first put on
        const stray = entry.folder && mem.desktopPath + "/" + entry.name + ".game"
        if (stray && File.at(stray)) await task.cmd("file.move", { path: stray, to: entry.folder })
        if (mem.progress.spawned.includes(entry.id)) continue
        if (puzzles.includes(entry) && !isUnlocked(entry)) continue
        if (entry.only && entry.only !== mem.player?.name && !mem.player?.everything) continue
        if (entry.testers && !mem.player?.tester) continue
        await mem.spawnShortcut(entry)
    }
}
