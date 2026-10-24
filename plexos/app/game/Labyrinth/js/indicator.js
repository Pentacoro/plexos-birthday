import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.pkgInventory = mem.root.querySelector(".pkg-inventory")
mem.pkgDelivered = mem.root.querySelector(".pkg-delivered")

const NS = "http://www.w3.org/2000/svg"
const sv = (tag, a = {}) => {
    const e = document.createElementNS(NS, tag)
    for (const [k, v] of Object.entries(a)) e.setAttribute(k, v)
    return e
}

// a team-colored rounded square (matching the delivery zone shape) with a checkmark hole cut through it
function deliveredBox(team, color) {
    const id = "chk-" + /TASKID/ + "-" + team
    const s = sv("svg", { viewBox: "0 0 20 20", width: "18", height: "18" })
    const defs = sv("defs")
    const mask = sv("mask", { id })
    mask.append(sv("rect", { width: "20", height: "20", fill: "white" }))
    const chk = sv("polyline", {
        points: "4,11.5 8,15.5 16,5.5",
        stroke: "black", "stroke-width": "2.8", fill: "none",
        "stroke-linecap": "round", "stroke-linejoin": "round"
    })
    mask.append(chk)
    defs.append(mask)
    s.append(defs)
    s.append(sv("rect", { x: "1", y: "1", width: "18", height: "18", rx: "4",
        fill: color, mask: `url(#${id})` }))
    return s
}

const teamOrder = ["spades", "hearts", "clubs", "diamonds"]

mem.updateIndicator = () => {
    if (!mem.pkgInventory || !mem.pkgDelivered) return
    const picked    = mem.party.flag(mem.id, "packages") || []
    const delivered = mem.party.flag(mem.id, "delivered") || []
    const pickedTeams = new Set(picked.map(k => k.split(":")[1]))

    mem.pkgInventory.replaceChildren()
    mem.pkgDelivered.replaceChildren()

    for (const team of teamOrder) {
        const color = mem.party.teams[team]?.color || "#fff"
        if (pickedTeams.has(team) && !delivered.includes(team)) {
            const c = document.createElement("div")
            c.className = "pkg-circle"
            c.style.background = color
            mem.pkgInventory.append(c)
        }
        if (delivered.includes(team)) {
            mem.pkgDelivered.append(deliveredBox(team, color))
        }
    }
}
