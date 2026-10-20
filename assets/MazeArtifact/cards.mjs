// Diamonds' maze as two cards, drawn as the other teams' maze cards are (assets/Labyrinth), and
// laid as they are, one over the other. Their own card, the back of every diamonds player's
// card, holds columns 0-3 of mazes.js "artifact", with its ways in and out; the artifact lies
// over its columns 2-3 and holds 2-5, with their package. So their own card shows only two
// columns of the maze, and the two it hides are walls of another maze. Each card stops just past
// its dots on the side with no guide line. Drawn in pixels of the 400 x 560 card, upright.
import {mazes} from "../../plexos/app/game/Labyrinth/mazes.js"
import {numbers} from "../../plexos/app/game/Labyrinth/numbers.js"

const maze = mazes.artifact
export const CARD = { w: 400, h: 560 }
const CELL = 80, GUIDE = 40, CUT = 6, BAND = 14, GAP = 4
const frame = "#2a2a2e", floor = "#1e1e20", band = "#4a4a54", wall = "#b4b4c0", dot = "#e6e6e6", ring = "#6e6e7a", diamond = "#c94cff"

// the columns each card holds, and the ones of their own card the artifact covers
const parts = {
    own: { from: 0, seen: 2 },
    artifact: { from: 2, seen: 4 },
}
// what their own card shows under the artifact: another maze
const decoy = ["v3,0", "v2,1", "v3,4", "v2,5", "h2,2", "h3,2", "h2,3", "h2,4", "h3,4"]

// every wall of the maze, its border too but at the openings
function mazeWalls() {
    const open = maze.openings.map(o => o.edge)
    const edges = new Set(maze.walls)
    for (let x = 0; x < maze.w; x++) edges.add(`h${x},0`), edges.add(`h${x},${maze.h}`)
    for (let y = 0; y < maze.h; y++) edges.add(`v0,${y}`), edges.add(`v${maze.w},${y}`)
    return [...edges].filter(key => !open.includes(key))
}
const parse = (key) => [key[0], ...key.slice(1).split(",").map(Number)]

export function card(name) {
    const { from, seen } = parts[name]
    const to = from + 4
    // their own card's guide line is on the left, the artifact's on the right
    const ox = name === "own" ? CARD.w - CUT - 4 * CELL : CUT - from * CELL, oy = GUIDE
    const X = (x) => ox + x * CELL, Y = (y) => oy + y * CELL
    let out = `<rect width="${CARD.w}" height="${CARD.h}" fill="${frame}"/>`
    const fx = name === "own" ? X(0) : 0
    out += `<rect x="${fx}" y="${Y(0)}" width="${4 * CELL + CUT}" height="${maze.h * CELL}" fill="${floor}"/>`

    // the guide line round the three other sides. Where the artifact's edge crosses their own
    // card's, the two join as the other teams' cards do (mazes.js, plugs), going round clockwise
    // as the Labyrinth draws them: a round plug at the top, its tip on their own card, and a
    // pointed one at the bottom, its tip on the artifact
    const left = X(from) - GUIDE / 2, right = X(to) + GUIDE / 2, top = Y(0) - GUIDE / 2, bottom = Y(maze.h) + GUIDE / 2
    const h = BAND / 2
    if (name === "own") {
        // the round tip stops just short of the artifact's edge, the notch right at it
        const end = X(2) - CUT - GAP / 2
        out += `<polyline points="${end - h},${top} ${left},${top} ${left},${bottom} ${end},${bottom}" fill="none" stroke="${band}" stroke-width="${BAND}" stroke-linejoin="miter"/>`
        out += `<path d="M${end - h} ${top - h}A${h} ${h} 0 0 1 ${end - h} ${top + h}Z" fill="${band}"/>`
        out += `<path d="M${end + 1} ${bottom - h}L${end - BAND} ${bottom}L${end + 1} ${bottom + h}Z" fill="${frame}"/>`
    } else {
        // the notch at the edge, the pointed tip reaching it
        out += `<polyline points="0,${top} ${right},${top} ${right},${bottom} ${BAND},${bottom}" fill="none" stroke="${band}" stroke-width="${BAND}" stroke-linejoin="miter"/>`
        out += `<path d="M0 ${top - h}A${h} ${h} 0 0 1 0 ${top + h}Z" fill="${frame}"/>`
        out += `<path d="M${BAND} ${bottom - h}L0 ${bottom}L${BAND} ${bottom + h}Z" fill="${band}"/>`
    }

    // the maze's walls in the columns it shows; their own card's hidden ones are the decoy's,
    // closed round by its own border
    const inSeen = ([t, x, y]) => t === "v" ? x >= from && x <= from + seen : x >= from && x < from + seen
    let walls = mazeWalls().map(parse).filter(inSeen)
    if (name === "own") {
        walls = walls.filter(([t, x]) => !(t === "v" && x === 2))
        walls.push(...decoy.map(parse))
        for (const x of [2, 3]) walls.push(["h", x, 0], ["h", x, maze.h])
        for (let y = 0; y < maze.h; y++) walls.push(["v", 4, y])
    }
    for (const [t, x, y] of walls) {
        const [x1, y1, x2, y2] = t === "v" ? [X(x), Y(y) + 16, X(x), Y(y + 1) - 16] : [X(x) + 16, Y(y), X(x + 1) - 16, Y(y)]
        out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${wall}" stroke-width="10" stroke-linecap="round"/>`
    }
    // the cells with a digit it shows, ringed but not the digit (Labyrinth/numbers.js), and the package
    const shows = (x) => x >= from && x < from + seen
    for (const cell of Object.keys(numbers)) {
        const [x, y] = cell.split(",").map(Number)
        if (shows(x)) out += `<circle cx="${X(x + 0.5)}" cy="${Y(y + 0.5)}" r="13" fill="none" stroke="${ring}" stroke-width="3"/>`
    }
    const [px, py] = maze.packages.diamonds
    if (shows(px)) out += `<circle cx="${X(px + 0.5)}" cy="${Y(py + 0.5)}" r="13" fill="${diamond}"/>`
    for (let y = 0; y <= maze.h; y++) for (let x = from; x <= to; x++) out += `<circle cx="${X(x)}" cy="${Y(y)}" r="5.5" fill="${dot}"/>`
    return { svg: out, column: (x) => X(x) }
}

// the two laid as the maze, the artifact over their own card, its dots on theirs
export function stack() {
    const own = card("own"), artifact = card("artifact")
    const shift = own.column(2) - artifact.column(2)
    return { w: shift + CARD.w, h: CARD.h, svg: own.svg + `<g transform="translate(${shift} 0)">${artifact.svg}</g>` }
}
