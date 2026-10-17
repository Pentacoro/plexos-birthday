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
]

export function unlockTime(puzzle) {
    return firstUnlock + puzzles.indexOf(puzzle) * unlockInterval
}

export function isUnlocked(puzzle, now = Date.now()) {
    return unlockAll || now >= unlockTime(puzzle)
}

export function puzzleById(id) {
    return puzzles.find(puzzle => puzzle.id === id) || null
}

// Apps everyone has from the start, each in a corner of the desktop
export const tools = [
    {
        id: "map",
        name: "Mapa",
        launcher: "/plexos/app/game/Map/map.ls",
        icon: "/plexos/app/game/Map/icon.svg",
        corner: "bottom-right",
    },
]

// What a desktop shortcut opens: a tool, or a puzzle once its time has come
export function shortcutById(id) {
    const tool = tools.find(tool => tool.id === id)
    if (tool) return tool
    const puzzle = puzzleById(id)
    return puzzle && isUnlocked(puzzle) ? puzzle : null
}
