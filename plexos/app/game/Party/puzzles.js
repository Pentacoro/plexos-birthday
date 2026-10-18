// Every puzzle in unlock order. The first opens at 20:00 Buenos Aires time on the party night,
// and each next one half an hour later.
export const firstUnlock = Date.parse("2026-10-24T20:00:00-03:00")
export const unlockInterval = 30 * 60 * 1000

// For development: true unlocks every puzzle now
export const unlockAll = true

export const puzzles = [
    {
        id: "fibonacci",
        name: "Teléfono Fibonacci",
        launcher: "/plexos/app/game/Fibonacci/fibonacci.ls",
        icon: "/plexos/app/game/Fibonacci/icon.svg",
    },
    {
        id: "webdetective",
        name: "Detective Web",
        launcher: "/plexos/app/game/WebDetective/webDetective.ls",
        icon: "/plexos/app/game/WebDetective/icon.svg",
    },
    {
        id: "labyrinth",
        name: "Laberinto Yuxtapuesto",
        launcher: "/plexos/app/game/Labyrinth/labyrinth.ls",
        icon: "/plexos/app/game/Labyrinth/icon.svg",
    },
    {
        id: "sync",
        name: "Sincronización Emparejada",
        launcher: "/plexos/app/game/Sync/sync.ls",
        icon: "/plexos/app/game/Sync/icon.svg",
    },
]

export function unlockTime(puzzle) {
    return firstUnlock + puzzles.indexOf(puzzle) * unlockInterval
}

// For testing (the Entrenador app): a clock moved ahead, and unlockAll overridden either way.
// Both are kept in this browser only.
const stored = (key) => { try { return localStorage.getItem(key) } catch { return null } }
export const clockOffset = () => Number(stored("party-clock")) || 0
export const clock = () => Date.now() + clockOffset()
export const allUnlocked = () => { const forced = stored("party-unlock-all"); return forced === null ? unlockAll : forced === "true" }

export function isUnlocked(puzzle, now = clock()) {
    return allUnlocked() || now >= unlockTime(puzzle)
}

export function puzzleById(id) {
    return puzzles.find(puzzle => puzzle.id === id) || null
}

// Apps everyone has from the start, each in a corner of the desktop ("only": just that player;
// "folder": in that folder instead, as the root beside Inventario)
export const tools = [
    {
        id: "map",
        name: "Mapa",
        launcher: "/plexos/app/game/Map/map.ls",
        icon: "/plexos/app/game/Map/icon.svg",
        corner: "bottom-right",
    },
    // only Pentacoro has it: it opens Mariana's answer
    {
        id: "decoder",
        name: "Descifrador",
        launcher: "/plexos/app/game/Decoder/decoder.ls",
        icon: "/plexos/app/game/Decoder/icon.svg",
        folder: "@",
        only: "Pentacoro",
    },
    // only the test users have it: the clock, unlocks, teams and resets, for trying things
    {
        id: "trainer",
        name: "Entrenador",
        launcher: "/plexos/app/game/Trainer/trainer.ls",
        icon: "/plexos/app/game/Trainer/icon.svg",
        folder: "@",
        testers: true,
    },
]

// What a desktop shortcut opens: a tool, or a puzzle once its time has come
export function shortcutById(id) {
    const tool = tools.find(tool => tool.id === id)
    if (tool) return tool
    const puzzle = puzzleById(id)
    return puzzle && isUnlocked(puzzle) ? puzzle : null
}
