import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badgeRow = mem.root.querySelector(".badge-row")
mem.badge = categoryBadge("teams")
mem.badgeRow.append(mem.badge)
mem.hint = null

// The whole game needs the other team. Hearts' last stage needs their artifact too, to read
// the code they are given.
// Each stage has its own entry in the hint book; picking a partner has none.
mem.setStageBadges = (stage) => {
    if (stage === 2 && mem.team === "hearts") setCategory(mem.badge, "artifact", { photos: mem.artifactPhotos, place: mem.artifactPlace })
    else setCategory(mem.badge, "teams")
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
