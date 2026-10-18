import {getTask} from "/plexos/lib/functions/dll.js"
import {wrong} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The dot matrix: only the dots, the border line with its three plugs, and the openings. The
// walls and the player stay hidden. Drawn in cell units, so it scales to any screen. The border
// runs in a margin around the dots, as the guide line does on the cards, so plugs never sit
// under a dot.
const NS = "http://www.w3.org/2000/svg"
const BAND = 0.2, TIP = 0.2, GAP = 0.09, OFF = 0.42, HALF = 0.42
const svg = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n }

// a lattice point on one side of the maze's edge, moved out onto that side's band. The side
// must be given: a corner point lies on two sides.
function onBand([x, y], maze, side) {
    if (side === "top") return [x, -OFF]
    if (side === "bottom") return [x, maze.h + OFF]
    if (side === "left") return [-OFF, y]
    return [maze.w + OFF, y]
}

// The border band, built as separate pieces rather than painted over: it runs clockwise round
// the maze and breaks only at its plugs. A piece too short to read is left out.
function drawBorder(maze) {
    const W = maze.w + OFF * 2, H = maze.h + OFF * 2, L = 2 * (W + H)
    // distance along the band, clockwise from its top-left corner, of a point on a given side
    const along = ([x, y], side) =>
        side === "top" ? x + OFF : side === "right" ? W + y + OFF : side === "bottom" ? W + H + (maze.w - x) + OFF : 2 * W + H + (maze.h - y) + OFF
    const pointAt = (s) => {
        s = ((s % L) + L) % L
        if (s <= W) return [s - OFF, -OFF]
        if (s <= W + H) return [maze.w + OFF, s - W - OFF]
        if (s <= 2 * W + H) return [maze.w + OFF - (s - W - H), maze.h + OFF]
        return [-OFF, maze.h + OFF - (s - 2 * W - H)]
    }
    const corners = [W, W + H, 2 * W + H, L]
    // breaks only at the plugs: the openings are marked by their arrows, not cut into the band
    const breaks = []
    for (const p of maze.plugs) {
        const side = p.dir[1] === 0 ? (p.at[1] === 0 ? "top" : "bottom") : (p.at[0] === 0 ? "left" : "right")
        const s = along(p.at, side)
        // the border runs clockwise: the piece before the point ends male, the one after starts female
        if (p.kind === "square") breaks.push({ from: s - GAP, to: s + GAP })
        else breaks.push({ from: s - TIP, to: s, endCap: { kind: p.kind, at: s }, startCap: { kind: p.kind, at: s } })
    }
    breaks.sort((a, b) => a.from - b.from)
    const g = svg("g", { class: "border-band" })
    // no plugs: one unbroken loop
    if (!breaks.length) {
        g.append(svg("polygon", { points: corners.map(c => pointAt(c).join(",")).join(" "), class: "band-line" }))
        return g
    }
    for (let i = 0; i < breaks.length; i++) {
        const prev = breaks[i], next = breaks[(i + 1) % breaks.length]
        let s0 = prev.to, s1 = next.from
        if (i === breaks.length - 1) s1 += L
        if (s1 - s0 < 0.25) continue
        // the piece itself, turning at any corners it passes
        const pts = [pointAt(s0)]
        for (const c of [...corners, ...corners.map(c => c + L)]) if (c > s0 && c < s1) pts.push(pointAt(c))
        pts.push(pointAt(s1))
        g.append(svg("polyline", { points: pts.map(p => p.join(",")).join(" "), class: "band-line" }))
        // a male tip past its end, a female notch cut into its start
        if (next.endCap) cap(g, next.endCap.kind, "male", pointAt(next.endCap.at), pointAt(next.endCap.at - 1))
        if (prev.startCap) cap(g, prev.startCap.kind, "female", pointAt(prev.startCap.at), pointAt(prev.startCap.at + 1))
    }
    return g
}

// A plug end at point p, its piece lying towards q: the male tip reaches p, the female notch
// opens at p into its own piece
function cap(g, kind, gender, p, q) {
    const angle = Math.atan2(p[1] - q[1], p[0] - q[0]) * 180 / Math.PI
    const h = BAND / 2
    const group = svg("g", { transform: `translate(${p[0]} ${p[1]}) rotate(${angle})` })
    if (gender === "male") {
        // the tip spans the last TIP of distance before the point
        const d = kind === "cross" ? `M ${-TIP} ${-h} L 0 0 L ${-TIP} ${h} Z` : `M ${-TIP} ${-h} A ${TIP} ${h} 0 0 1 ${-TIP} ${h} Z`
        group.append(svg("path", { d, class: "band" }))
    } else {
        // the notch is cut into the piece's first TIP of distance
        const d = kind === "cross" ? `M 0 ${-h - 0.01} L ${-TIP} 0 L 0 ${h + 0.01} Z` : `M 0 ${-h - 0.01} A ${TIP} ${h + 0.01} 0 0 0 0 ${h + 0.01} Z`
        group.append(svg("path", { d, class: "notch" }))
    }
    g.append(group)
}

// An arrow beyond an opening: always pointing in for a way in, out for a way out
function arrow(group, maze, edge, inward) {
    const t = edge[0], [x, y] = edge.slice(1).split(",").map(Number)
    const far = OFF + 0.5
    let cx, cy, angle
    if (t === "h") { cx = x + 0.5; cy = y === 0 ? -far : maze.h + far; angle = y === 0 ? 90 : -90 }
    else { cy = y + 0.5; cx = x === 0 ? -far : maze.w + far; angle = x === 0 ? 0 : 180 }
    if (!inward) angle += 180
    const g = svg("g", { transform: `translate(${cx} ${cy}) rotate(${angle})`, class: "arrow" })
    g.append(svg("path", { d: "M -0.24 -0.18 L 0.2 0 L -0.24 0.18 Z" }))
    group.append(g)
}

mem.drawMatrix = () => {
    const leg = mem.leg, maze = mem.mazes[leg.maze]
    const m = mem.matrix
    m.replaceChildren()
    const pad = OFF + 0.9
    m.setAttribute("viewBox", `${-pad} ${-pad} ${maze.w + pad * 2} ${maze.h + pad * 2}`)
    m.append(drawBorder(maze))
    // only the opening come in by, plus this team's way out of the first maze; every opening
    // once the maze is passed
    for (const o of maze.openings) {
        const shown = mem.shows(leg.maze) || o.role === leg.enter || (leg.maze === "first" && o.role === mem.firstExit)
        if (shown) arrow(m, maze, o.edge, o.role.startsWith("entry"))
    }
    // once this maze is passed, its walls and the player show
    if (mem.shows(leg.maze)) {
        const walls = svg("g", { class: "walls" })
        // the maze's own edge too, open only at its openings
        const edge = []
        for (let x = 0; x < maze.w; x++) edge.push(`h${x},0`, `h${x},${maze.h}`)
        for (let y = 0; y < maze.h; y++) edge.push(`v0,${y}`, `v${maze.w},${y}`)
        const open = maze.openings.map(o => o.edge)
        for (const k of [...maze.walls, ...edge.filter(k => !open.includes(k))]) {
            const [x, y] = k.slice(1).split(",").map(Number)
            const [x2, y2] = k[0] === "h" ? [x + 1, y] : [x, y + 1]
            walls.append(svg("line", { x1: x + (x2 - x) * 0.18, y1: y + (y2 - y) * 0.18, x2: x2 - (x2 - x) * 0.18, y2: y2 - (y2 - y) * 0.18 }))
        }
        m.append(walls)
    }
    const dots = svg("g", { class: "dots" })
    for (let y = 0; y <= maze.h; y++) for (let x = 0; x <= maze.w; x++) dots.append(svg("circle", { cx: x, cy: y, r: 0.085 }))
    m.append(dots)
    if (mem.shows(leg.maze)) {
        mem.playerDot = svg("circle", { r: 0.26, class: "player", fill: mem.party.teams[mem.team]?.color || "#fff" })
        m.append(mem.playerDot)
        mem.drawPlayer()
    }
}

mem.drawPlayer = () => {
    if (!mem.playerDot || !mem.at) return
    mem.playerDot.setAttribute("cx", mem.at[0] + 0.5)
    mem.playerDot.setAttribute("cy", mem.at[1] + 0.5)
}

// A bump: the dots go red and the matrix shakes, then all is white again
mem.bump = () => {
    wrong()
    mem.matrix.classList.remove("bump", "flash")
    void mem.matrix.getBoundingClientRect()
    mem.matrix.classList.add("bump")
}
// A package picked up: the dots flash its team's color. A leftover bump class would leave
// them red once the flash ends, so both go.
mem.flash = (color) => {
    mem.matrix.style.setProperty("--flash", color || "#fff")
    mem.matrix.classList.remove("bump", "flash")
    void mem.matrix.getBoundingClientRect()
    mem.matrix.classList.add("flash")
}
