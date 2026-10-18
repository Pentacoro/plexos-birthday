import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// After the labyrinth is done completely, stepping out of the very first entrance doesn't lead
// out: the window fades away and an endless labyrinth takes the whole screen. It has no way out
// and no buttons; the player swipes to move, the screen's own gestures are held, and only
// reloading the page (from the browser's menu) ends it. It is built as it is walked, in 8x8
// blocks, each a maze of its own joined to its neighbours, so it goes on forever and never closes.
const block = 8
const across = 9          // cells across the screen
// how far the dot wanders from the middle before the view follows: [across, up and down], a
// box 3 cells wide and 5 tall, as the screen is taller than wide
const grace = [1, 2]

function hash(text) {
    let seed = 2166136261
    for (const char of text) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619)
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// one block's open passages, as edge keys: "v x,y" the left side of cell x,y, "h x,y" its top
const blocks = new Map()
function carve(bx, by) {
    const key = bx + "," + by
    if (blocks.has(key)) return blocks.get(key)
    const rand = hash("abyss:" + key)
    const open = new Set()
    const seen = new Set()
    const x0 = bx * block, y0 = by * block
    const stack = [[x0 + Math.floor(rand() * block), y0 + Math.floor(rand() * block)]]
    seen.add(stack[0].join())
    while (stack.length) {
        const [x, y] = stack.at(-1)
        const next = [[1, 0], [-1, 0], [0, 1], [0, -1]]
            .map(([dx, dy]) => [x + dx, y + dy])
            .filter(([nx, ny]) => nx >= x0 && ny >= y0 && nx < x0 + block && ny < y0 + block && !seen.has(nx + "," + ny))
        if (!next.length) { stack.pop(); continue }
        const [nx, ny] = next[Math.floor(rand() * next.length)]
        open.add(nx !== x ? "v" + Math.max(x, nx) + "," + y : "h" + x + "," + Math.max(y, ny))
        seen.add(nx + "," + ny)
        stack.push([nx, ny])
    }
    blocks.set(key, open)
    return open
}
// where a block opens into the block to its right and the one below it
const door = (bx, by, side) => Math.floor(hash("abyss-door:" + side + bx + "," + by)() * block)
const floor = (n) => Math.floor(n / block)

function isOpen(edge) {
    const [x, y] = edge.slice(1).split(",").map(Number)
    if (edge[0] === "v") {
        if (x % block === 0) return y - floor(y) * block === door(floor(x) - 1, floor(y), "e")
        return carve(floor(x), floor(y)).has(edge)
    }
    if (y % block === 0) return x - floor(x) * block === door(floor(x), floor(y) - 1, "s")
    return carve(floor(x), floor(y)).has(edge)
}

const style = `
.abyss {
    position: fixed;
    inset: 0;
    z-index: 150000;
    background: #1b1b20;
    touch-action: none;
    overscroll-behavior: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    opacity: 0;
    transition: opacity 0.8s ease;
}
.abyss.shown { opacity: 1; }
.abyss svg { width: 100%; height: 100%; display: block; }
.abyss .wall { stroke: #b4b4c0; stroke-width: 0.13; stroke-linecap: round; }
.abyss .dot { fill: #e6e6e6; transition: fill 0.25s ease; }
.abyss.bump svg { animation: abyss-shake 0.35s; }
.abyss.bump .dot { fill: #ff4a5a; transition: none; animation: abyss-back 0.6s forwards; }
@keyframes abyss-shake { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
@keyframes abyss-back { 0%, 55% { fill: #ff4a5a; } 100% { fill: #e6e6e6; } }`

mem.abyss = async () => {
    mem.busy = true
    const win = task.window.node

    const sheet = document.createElement("style")
    sheet.textContent = style
    document.head.append(sheet)
    const screen = document.createElement("div")
    screen.className = "abyss"
    const ns = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(ns, "svg")
    const world = document.createElementNS(ns, "g")
    const player = document.createElementNS(ns, "circle")
    player.setAttribute("r", "0.26")
    player.setAttribute("fill", mem.party.teams[mem.team]?.color || "#fff")
    svg.append(world, player)
    screen.append(svg)
    // the endless labyrinth is already there under the window, every other window gone, so as the
    // window goes the way a maze does when left, it is what shows behind it
    screen.style.transition = "none"
    screen.style.zIndex = "0"
    screen.classList.add("shown")
    document.getElementById("windowLayer").prepend(screen)
    for (const other of document.querySelectorAll("#windowLayer .window")) if (other !== win) other.style.display = "none"

    let at = [0, 0]
    let shown = [0.5, 0.5]            // where the dot is drawn, easing toward where it is
    let view = [0.5, 0.5]             // the middle of the screen, easing toward its target
    let target = [0.5, 0.5]
    let drawnAround = null
    const reach = 22                  // cells drawn each way around the view

    // walls and dots around a point, redrawn only once the view has moved far from the last
    function draw(cx, cy) {
        world.replaceChildren()
        const x0 = Math.floor(cx) - reach, y0 = Math.floor(cy) - reach
        const add = (tag, attrs) => {
            const node = document.createElementNS(ns, tag)
            for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
            world.append(node)
        }
        for (let x = x0; x <= x0 + reach * 2; x++) for (let y = y0; y <= y0 + reach * 2; y++) {
            if (!isOpen("v" + x + "," + y)) add("line", { x1: x, y1: y + 0.18, x2: x, y2: y + 0.82, class: "wall" })
            if (!isOpen("h" + x + "," + y)) add("line", { x1: x + 0.18, y1: y, x2: x + 0.82, y2: y, class: "wall" })
            add("circle", { cx: x, cy: y, r: 0.085, class: "dot" })
        }
        drawnAround = [cx, cy]
    }

    function frame() {
        if (!screen.isConnected) return
        shown = shown.map((v, i) => v + (at[i] + 0.5 - v) * 0.3)
        view = view.map((v, i) => v + (target[i] - v) * 0.12)
        const ratio = innerHeight / innerWidth
        const w = across, h = across * ratio
        svg.setAttribute("viewBox", `${view[0] - w / 2} ${view[1] - h / 2} ${w} ${h}`)
        player.setAttribute("cx", shown[0])
        player.setAttribute("cy", shown[1])
        if (!drawnAround || Math.hypot(view[0] - drawnAround[0], view[1] - drawnAround[1]) > reach / 2) draw(view[0], view[1])
        requestAnimationFrame(frame)
    }

    const steps = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
    function move(dir) {
        const [x, y] = at
        const edge = dir === "up" ? `h${x},${y}` : dir === "down" ? `h${x},${y + 1}` : dir === "left" ? `v${x},${y}` : `v${x + 1},${y}`
        if (!isOpen(edge)) {
            screen.classList.remove("bump")
            void screen.offsetWidth
            screen.classList.add("bump")
            return
        }
        at = [x + steps[dir][0], y + steps[dir][1]]
        // the view only follows once the dot leaves the middle
        target = target.map((t, i) => {
            const offset = at[i] + 0.5 - t
            return Math.abs(offset) > grace[i] ? at[i] + 0.5 - Math.sign(offset) * grace[i] : t
        })
    }

    // a swipe moves one cell its way; the screen's own gestures (pulling to reload, going back,
    // the press menu) are all held
    let from = null
    const hold = (e) => e.preventDefault()
    for (const type of ["touchstart", "touchmove", "touchend", "contextmenu", "gesturestart", "wheel"]) {
        screen.addEventListener(type, hold, { passive: false })
    }
    document.addEventListener("touchmove", hold, { passive: false })
    document.body.style.overscrollBehavior = "none"
    screen.addEventListener("pointerdown", e => {
        e.preventDefault()
        from = { x: e.clientX, y: e.clientY }
    })
    screen.addEventListener("pointerup", e => {
        if (!from) return
        const dx = e.clientX - from.x, dy = e.clientY - from.y
        from = null
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
        move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"))
    })
    document.addEventListener("keydown", e => {
        const dir = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[e.key]
        if (!dir) return
        e.preventDefault()
        move(dir)
    })
    draw(0.5, 0.5)
    requestAnimationFrame(frame)
    await win.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.94)" }], { duration: 600, easing: "ease", fill: "forwards" }).finished
    win.style.display = "none"
    // then over everything
    screen.style.zIndex = ""
    document.body.append(screen)
}
