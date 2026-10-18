import {getTask} from "/plexos/lib/functions/dll.js"
import {colors, cells, pathPuzzle} from "/plexos/app/game/Sync/generate.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 1. Side 1 has nine symbol keys, each typing a letter, on a pad turned at an angle.
// Side 2 has a 3x3 diagram with a path through three points, one point drawn as one of the
// symbols, and six colored buttons. The diagram is the order to press keys in, turned to
// match the pad by that symbol. The three letters typed are the initials, in English, of
// the colors side 2 must press, in order. Three keys type letters of no color.
mem.pathPuzzle = () => pathPuzzle(mem.rand("path"))

mem.buildPath = (solved) => {
    const p = mem.pathPuzzle()
    if (mem.side === 1) {
        const field = mem.entryField(3, p.code)
        const pad = mem.el("div", "symbol-pad")
        const angle = 45 + 90 * p.turn
        pad.style.setProperty("--turn", angle + "deg")
        for (const cell of cells) {
            const key = mem.el("button", "symbol-key")
            key.type = "button"
            key.dataset.key = cell
            key.innerHTML = mem.symbolSvg(p.symbols[cell])
            pad.append(key)
        }
        mem.pressKeys(pad, key => field.type(p.letters[key.dataset.key]))
        if (solved) field.solve()
        const room = mem.el("div", "symbol-room")
        room.append(pad)
        mem.screen.append(field.node, room)
        return
    }
    mem.screen.append(diagram(p), colorPanel(p, solved))
}

// The diagram: dots, the path over them with an arrow into its first point, and the anchor
function diagram(p) {
    const ns = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("viewBox", "-0.2 -0.2 3.4 3.4")
    svg.setAttribute("class", "path-diagram")
    const at = (cell) => [cell % 3 + 0.5, Math.floor(cell / 3) + 0.5]
    const add = (tag, attrs) => {
        const node = document.createElementNS(ns, tag)
        for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
        svg.append(node)
        return node
    }
    for (const cell of cells) {
        const [x, y] = at(cell)
        if (cell === p.anchor) {
            const g = add("g", { transform: `translate(${x - 0.24} ${y - 0.24}) scale(${0.48 / 24})` })
            g.innerHTML = `<path d="${mem.symbols[p.symbols[cell]]}" fill="#fff" fill-rule="evenodd"/>`
        } else add("circle", { cx: x, cy: y, r: 0.07, class: "path-dot" })
    }
    const points = p.path.map(at)
    add("polyline", { points: points.map(pt => pt.join(",")).join(" "), class: "path-line" })
    for (const [x, y] of points) add("circle", { cx: x, cy: y, r: 0.13, class: "path-node" })
    // the arrow comes in from the side away from the second point
    const [[x0, y0], [x1, y1]] = points
    const len = Math.hypot(x0 - x1, y0 - y1), dx = (x0 - x1) / len, dy = (y0 - y1) / len
    const tail = [x0 + dx * 0.55, y0 + dy * 0.55], tip = [x0 + dx * 0.2, y0 + dy * 0.2]
    add("line", { x1: tail[0], y1: tail[1], x2: tip[0], y2: tip[1], class: "path-line" })
    const angle = Math.atan2(-dy, -dx) * 180 / Math.PI
    add("path", { d: "M 0 0 L -0.14 -0.09 L -0.14 0.09 Z", transform: `translate(${tip[0]} ${tip[1]}) rotate(${angle})`, class: "path-head" })
    return svg
}

// Six colors. Each press lights the bar in its color; three make the try.
function colorPanel(p, solved) {
    const panel = mem.el("div", "color-panel")
    for (const { letter, color } of colors) {
        const key = mem.el("button", "color-key")
        key.type = "button"
        key.dataset.key = letter
        key.style.background = color
        panel.append(key)
    }
    let entry = ""
    let done = solved
    mem.pressKeys(panel, async key => {
        if (done || mem.busy) return
        mem.lightSet(key.style.background)
        entry += key.dataset.key
        if (entry.length < 3) return
        mem.busy = true
        if (entry === p.code) {
            done = true
            await mem.clearStage()
        } else {
            await mem.lightFail()
            entry = ""
        }
        mem.busy = false
    })
    return panel
}
