// Every puzzle in unlock order. The first opens at 22:00 Buenos Aires time on the party night,
// and each next one half an hour later. Moving firstUnlock moves the whole night with it.
// Until then the game is its starting state: Inventario, Estado, and the phone as a preview.
// The phone characters say these times too (Fibonacci/dialogue): keep them alike.
export const firstUnlock = Date.parse("2026-10-24T22:00:00-03:00")
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
    // the fifth needs every team's artifact, and sits apart from the rest, atop the middle column
    {
        id: "artifacts",
        name: "Caja Fuerte",
        launcher: "/plexos/app/game/Artifacts/artifacts.ls",
        icon: "/plexos/app/game/Artifacts/icon.svg",
        corner: "top-center",
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
// that folder instead, as the root beside Inventario; "opensAt": not before then; "team" and
// "after": only that team's players, once that puzzle step is solved; "safe": or anyone, once
// that step of Caja Fuerte is solved; "cell": [column, row], a negative column counting from
// the right, or the first free one below it; "beside": that puzzle's row instead, wherever its
// icon is, so each artifact lines up with its game)
export const tools = [
    // where the player stands: their team, card and code, and how far they are in each game
    {
        id: "status",
        name: "Estado",
        launcher: "/plexos/app/game/Status/status.ls",
        icon: "/plexos/app/game/Status/icon.svg",
        corner: "bottom-center",
    },
    {
        id: "map",
        name: "Mapa",
        launcher: "/plexos/app/game/Map/map.ls",
        icon: "/plexos/app/game/Map/icon.svg",
        corner: "bottom-left",
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
    // artifact 1, clubs': a disc and a star, on their desktop once their phone code proves they
    // found the real one, down the right column
    {
        id: "stardisc",
        name: "Artefacto ♣︎",
        launcher: "/plexos/app/game/StarDisc/stardisc.ls",
        icon: "/plexos/app/game/StarDisc/icon.svg",
        cell: [-1, 0],
        beside: "fibonacci",
        team: "clubs",
        safe: 2,
        after: ["fibonacci", 2],
    },
    // artifact 2, spades': the table of every guest's code, once their second letter (which
    // needs it) is answered, down the right column too
    {
        id: "codetable",
        name: "Artefacto ♠︎",
        launcher: "/plexos/app/game/CodeTable/codetable.ls",
        icon: "/plexos/app/game/CodeTable/icon.svg",
        cell: [-1, 0],
        beside: "webdetective",
        team: "spades",
        safe: 3,
        after: ["webdetective", 2],
    },
    // artifact 3, diamonds': their maze, with their package and the digits in it, once they have
    // solved the Labyrinth, down the right column too
    {
        id: "mazeartifact",
        name: "Artefacto ♦︎",
        launcher: "/plexos/app/game/MazeArtifact/mazeartifact.ls",
        icon: "/plexos/app/game/MazeArtifact/icon.svg",
        cell: [-1, 0],
        beside: "labyrinth",
        team: "diamonds",
        safe: 4,
        after: ["labyrinth", 1],
    },
    // artifact 4, hearts': the card that turns symbols into numbers, once they have used it to
    // finish Sync, down the right column too
    {
        id: "symbolcard",
        name: "Artefacto ♥︎",
        launcher: "/plexos/app/game/SymbolCard/symbolcard.ls",
        icon: "/plexos/app/game/SymbolCard/icon.svg",
        cell: [-1, 0],
        beside: "sync",
        team: "hearts",
        safe: 5,
        after: ["sync", 1],
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
