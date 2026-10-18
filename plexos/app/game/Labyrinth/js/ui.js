import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badge = categoryBadge("teams")
mem.hint = hintButton(mem.hintEntry)
mem.root.querySelector(".badge-row").append(mem.badge, mem.hint)

// Per maze: diamonds' own maze is their artifact, with its photos and room; the hint only
// shows in the first maze
mem.setStageBadges = () => {
    const leg = mem.leg
    if (leg.maze === "artifact" && mem.team === "diamonds") setCategory(mem.badge, "artifact", { photos: mem.artifactPhotos, place: mem.artifactPlace })
    else setCategory(mem.badge, "teams")
    mem.hint.classList.remove("open")
    mem.hint.hidden = leg.maze !== "first"
}

// The direction pad: an arrow on each of the four buttons
const arrow = `<svg viewBox="0 0 24 24"><path d="M12 5l7 8h-4.5v6h-5v-6H5z" fill="currentColor"/></svg>`
for (const button of mem.pad.querySelectorAll(".move")) button.innerHTML = arrow
