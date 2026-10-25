import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"
import {storyButton, tellStory} from "/plexos/app/game/Party/story.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badgeRow = mem.root.querySelector(".badge-row")
mem.badge = categoryBadge("teams")
mem.badgeRow.append(mem.badge, storyButton(task, mem.id))
mem.tellStory = () => {
    if (mem.ownDone() && !mem.party.flag("story", "drawingShown")) {
        mem.party.setFlag("story", "drawingShown", true)
        const seen = mem.party.flag("story", "artifacts") || []
        mem.party.setFlag("story", "artifacts", seen.filter(p => p !== "drawing"))
    }
    tellStory(task, mem.id)
}
mem.hint = null

// Every stage needs the other teams; some need a team's artifact too, which waits where it was
// hidden (def.js). Each stage has its own entry in the hint book, once written.
mem.setStageBadges = (stage) => {
    const artifact = mem.stageArtifacts[mem.stages[stage]]
    if (artifact) setCategory(mem.badge, "artifact", artifact)
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

// One dot per stage: the ones passed filled, the current one ringed
mem.drawDots = (stage) => {
    mem.dots.replaceChildren(...mem.stages.map((_, i) => el("span", i < stage ? "done" : i === stage ? "current" : "")))
}
