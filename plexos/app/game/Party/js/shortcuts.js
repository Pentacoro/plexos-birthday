import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import Icon from "/plexos/lib/classes/interface/icon.js"
import Task from "/plexos/lib/classes/system/task.js"
import {puzzles, tools, onDesktop, toolOpen} from "./puzzles.js"
import {cardIcon} from "/plexos/app/game/Status/card.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.desktopPath = "@/home/desks/desktop"

// Icon coordinates for a desktop cell, by column and row (negative counts from the right or
// the bottom): its place on the grid and where it sits
mem.cellCoords = ([column, row]) => {
    const grid = Task.get("Desktop")?.mem?.grid?.gridArr
    if (!grid?.length || !grid[0]?.length) return null
    const ax = column < 0 ? grid.length + column : column
    const ay = row < 0 ? grid[0].length + row : row
    const cell = grid[ax]?.[ay]
    if (!cell) return null
    return { px: cell.posX, py: cell.posY, tx: cell.posX, ty: cell.posY, ax, ay }
}
// the cell in a corner, or atop or below the middle column ("top-center", "bottom-center"; left
// of the middle when even)
mem.cornerCoords = (corner) => {
    const columns = Task.get("Desktop")?.mem?.grid?.gridArr?.length || 1
    const column = corner.endsWith("right") ? -1 : corner.endsWith("center") ? Math.floor((columns - 1) / 2) : 0
    return mem.cellCoords([column, corner.startsWith("bottom") ? -1 : 0])
}
// the first free cell from one down its column (the artifacts, one under the other)
mem.freeCellCoords = ([column, row]) => {
    const grid = Task.get("Desktop")?.mem?.grid?.gridArr
    const ax = column < 0 ? (grid?.length || 0) + column : column
    for (let y = row; grid?.[ax]?.[y]; y++) if (!grid[ax][y].used) return mem.cellCoords([column, y])
    return mem.cellCoords([column, row])
}

// The cell in the same row as a puzzle's icon, in the entry's column
mem.besideCell = (entry) => {
    const puzzle = entry.beside && puzzles.find(each => each.id === entry.beside)
    if (!puzzle) return null
    const path = mem.desktopPath + "/" + puzzle.name + ".game"
    const icon = Task.get("Desktop")?.mem?.iconArr?.find(each => each.file === path)
    return Number.isInteger(icon?.coords?.ay) ? [entry.cell[0], icon.coords.ay] : null
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
        const coords = entry.corner ? mem.cornerCoords(entry.corner) : entry.cell && mem.freeCellCoords(mem.besideCell(entry) || entry.cell)
        if (coords) icon.coords = coords
        await task.cmd("file.create", { path: folder, Type: "StringFile", name, icon, content: entry.id })
        // a new file's configuration always starts without a picture, so it gets one after
        await task.cmd("file.modify", { path, cfg: { icon: { image: entry.id === "status" ? cardIcon(mem.player) : entry.icon } } })
        File.refreshViews()
    }
    mem.progress.spawned.push(entry.id)
    await mem.saveProgress()
}

// one check at a time: the clock's and a solved step's could otherwise make a shortcut twice
let checking = Promise.resolve()
mem.checkUnlocks = () => checking = checking.then(checkUnlocks).catch(error => console.error(error))

async function checkUnlocks() {
    for (const entry of [...tools, ...puzzles]) {
        // a tool that now lives in a folder leaves the desktop it was first put on
        const stray = entry.folder && mem.desktopPath + "/" + entry.name + ".game"
        if (stray && File.at(stray)) await task.cmd("file.move", { path: stray, to: entry.folder })
        if (mem.progress.spawned.includes(entry.id)) continue
        if (puzzles.includes(entry) ? !onDesktop(entry) : !toolOpen(entry)) continue
        if (entry.only && entry.only !== mem.player?.name && !mem.player?.everything) continue
        if (entry.testers && !mem.player?.tester) continue
        // an artifact comes to its own team with its puzzle, and to anyone with its step of the safe
        const ownTeam = !entry.team || entry.team === mem.player?.team || mem.player?.everything
        const earned = ownTeam && (!entry.after || mem.stepsSolved(entry.after[0]) >= entry.after[1])
        if (!earned && !(entry.safe && mem.stepsSolved("artifacts") >= entry.safe)) continue
        await mem.spawnShortcut(entry)
    }
    await mem.wearCard()
}

// Estado's picture is the player's own card, including one already on the desktop
mem.wearCard = async () => {
    const path = mem.desktopPath + "/Estado.game"
    const file = File.at(path)
    if (!file?.cfg?.icon) return
    const image = cardIcon(mem.player)
    if (file.cfg.icon.image === image) return
    await task.cmd("file.modify", { path, cfg: { icon: { image } } })
    File.refreshViews()
    Task.get("Estado")?.window?.setImage(image)
}
