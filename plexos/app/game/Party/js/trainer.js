import plexos from "/boot/plexos.js"
import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import {applyColorScheme} from "/plexos/lib/functions/theme.js"
import {leave} from "/plexos/app/game/Party/backStack.js"
import {puzzles, tools, onDesktop, toolOpen} from "./puzzles.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// What the Entrenador app (only for test users) does to the game: another team for the player,
// shortcuts that follow the clock, a puzzle or the whole game started over.

// A team picked in the Entrenador stands in for the player's own, from the moment progress loads
mem.applyTrainerTeam = () => {
    const team = mem.progress.flags.trainer?.team
    if (!team || !mem.player) return
    mem.player = { ...mem.player, team }
    applyColorScheme(mem.teams[team].scheme)
}

// The puzzles open now close, so they open again as the new team or with their progress gone
mem.restartApps = () => {
    const names = [...puzzles.map(puzzle => puzzle.name), "Explorer", "Notepad"]
    for (const other of [...plexos.Tasks]) {
        if (!names.includes(other.name)) continue
        other.onEnd = null
        leave(other.backEntry)
        other.end()
    }
}

mem.setTeam = async (team) => {
    await mem.setFlag("trainer", "team", team)
    mem.applyTrainerTeam()
    mem.restartApps()
}

// Shortcuts for puzzles and tools still locked at the clock's time go, to come back when it gets there
mem.applySchedule = async () => {
    for (const entry of [...puzzles, ...tools]) {
        if (puzzles.includes(entry) ? onDesktop(entry) : toolOpen(entry)) continue
        const path = (entry.folder || mem.desktopPath) + "/" + entry.name + ".game"
        if (File.at(path)) await task.cmd("file.delete", { path })
        mem.progress.spawned = mem.progress.spawned.filter(id => id !== entry.id)
    }
    await mem.saveProgress()
    File.refreshViews()
    await mem.checkUnlocks()
}

// One puzzle from the start: its steps and everything it remembered
mem.resetPuzzle = async (id) => {
    delete mem.progress.steps[id]
    delete mem.progress.flags[id]
    await mem.saveProgress()
    mem.restartApps()
}

// The whole game from the start, the team picked in the Entrenador kept: progress, badges and
// everything in Inventario
mem.resetAll = async () => {
    const trainer = mem.progress.flags.trainer
    mem.progress.steps = {}
    mem.progress.flags = trainer ? { trainer } : {}
    await mem.saveProgress()
    for (const file of File.children(File.at(mem.inventoryPath)) || []) await task.cmd("file.delete", { path: file.cfg.path })
    File.refreshViews()
    mem.restartApps()
}
