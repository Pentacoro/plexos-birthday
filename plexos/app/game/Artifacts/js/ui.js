import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badgeRow = mem.root.querySelector(".badge-row")
mem.badge = categoryBadge("teams")
mem.badgeRow.append(mem.badge)
mem.hint = null

// Every stage needs the other teams; each has its own entry in the hint book, once written
mem.setStageBadges = (stage) => {
    setCategory(mem.badge, "teams")
    mem.hint?.remove()
    mem.hint = mem.hintEntries[stage] ? hintButton(mem.hintEntries[stage]) : null
    if (mem.hint) mem.badgeRow.append(mem.hint)
}

const el = (tag, className, text) => {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
}
mem.el = el

// One dot per stage: the ones passed filled, the current one ringed
mem.drawDots = (stage) => {
    mem.dots.replaceChildren(...mem.stages.map((_, i) => el("span", i < stage ? "done" : i === stage ? "current" : "")))
}
