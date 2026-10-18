// Every puzzle in unlock order. The first opens at 20:00 Buenos Aires time on the party night,
// and each next one half an hour later. Moving firstUnlock moves the whole night with it.
// Until then the game is its starting state: Inventario, and the phone as a preview.
export const firstUnlock = Date.parse("2026-10-24T20:00:00-03:00")
export const unlockInterval = 30 * 60 * 1000

// For development: true unlocks every puzzle now, for everyone
export const unlockAll = false

// Who is playing, set by the Party as it starts: the test users have everything open
export const access = { tester: false }

export const puzzles = [
    {
        id: "fibonacci",
        name: "Teléfono Fibonacci",
        // on the desktop from the start; until its time its calls are a preview (Fibonacci's call.js)
        preview: true,
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
    // the fifth needs every team's artifact
    {
        id: "artifacts",
        name: "Caja Fuerte",
        launcher: "/plexos/app/game/Artifacts/artifacts.ls",
        icon: "/plexos/app/game/Artifacts/icon.svg",
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
export const allUnlocked = () => { const forced = stored("party-unlock-all"); return forced === null ? unlockAll || access.tester : forced === "true" }

export function isUnlocked(puzzle, now = clock()) {
    return allUnlocked() || now >= unlockTime(puzzle)
}

export function puzzleById(id) {
    return puzzles.find(puzzle => puzzle.id === id) || null
}

// On the desktop: an open puzzle, or one that shows from the start as a preview
export const onDesktop = (puzzle) => puzzle.preview || isUnlocked(puzzle)

// A tool with a time of its own comes then; the rest are there from the first login
export const toolOpen = (tool, now = clock()) => !tool.opensAt || allUnlocked() || now >= tool.opensAt

// Apps everyone has, each in a corner of the desktop ("only": just that player; "folder": in
// that folder instead, as the root beside Inventario; "opensAt": not before then)
export const tools = [
    {
        id: "map",
        name: "Mapa",
        launcher: "/plexos/app/game/Map/map.ls",
        icon: "/plexos/app/game/Map/icon.svg",
        corner: "bottom-right",
        // two hours before the first puzzle, as guests arrive
        opensAt: firstUnlock - 2 * 60 * 60 * 1000,
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
    if (tool) return toolOpen(tool) ? tool : null
    const puzzle = puzzleById(id)
    return puzzle && onDesktop(puzzle) ? puzzle : null
}
