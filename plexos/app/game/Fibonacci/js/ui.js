import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {teamIcon, teamOrder} from "/plexos/app/game/Party/teams.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badge = categoryBadge("solo")
mem.hint = hintButton(mem.hintEntry)
mem.hint.hidden = !!mem.party.flag(mem.id, "hintRetired")
mem.root.querySelector(".badge-row").append(mem.badge, mem.hint)

// The hint is for working out the numbers: it goes for good once the player dials one
// of their own, anything but the plain Fibonacci line
mem.retireHint = async () => {
    if (mem.hint.hidden) return
    mem.hint.classList.remove("open")
    mem.hint.hidden = true
    await mem.party.setFlag(mem.id, "hintRetired", true)
}

mem.slots = mem.root.querySelector(".slots")
mem.teamRow = mem.root.querySelector(".teams")

function artifactIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.classList.add("team-icon", "artifact")
    svg.innerHTML = `<path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z" fill="none" stroke="#ffd23f" stroke-width="1.8" stroke-linejoin="round"/>`
    return svg
}

// Each group of slots can carry an icon underneath, naming whose code goes there
function buildSlots(groups) {
    mem.slots.replaceChildren()
    for (const group of groups) {
        const column = document.createElement("div")
        column.className = "slot-group"
        const digits = document.createElement("div")
        digits.className = "slot-digits"
        for (let i = 0; i < group.length; i++) digits.append(document.createElement("span"))
        column.append(digits)
        if (group.icon) column.append(group.icon)
        mem.slots.append(column)
    }
    mem.digitSlots = [...mem.slots.querySelectorAll(".slot-digits span")]
    mem.entryLength = mem.digitSlots.length
    mem.entry = ""
}

mem.showDial = () => {
    mem.mode = "dial"
    mem.root.className = "puzzle mode-dial"
    setCategory(mem.badge, "solo")
    buildSlots([{ length: mem.numberLength }])
    mem.renderContacts()
    mem.teamRow.replaceChildren()
    for (const team of teamOrder) {
        const cell = document.createElement("div")
        cell.className = "team"
        const hint = document.createElement("span")
        hint.textContent = mem.seeds[team].hint
        cell.append(teamIcon(team), hint)
        mem.teamRow.append(cell)
    }
}

mem.showCode = (team) => {
    mem.mode = "code"
    mem.codeTeam = team
    mem.root.className = "puzzle mode-code"
    if (mem.codeParts[team].includes("artifact")) setCategory(mem.badge, "artifact", { photos: mem.artifactPhotos, place: mem.artifactPlace })
    else setCategory(mem.badge, "teams")
    buildSlots(mem.codeParts[team].map(part => ({ length: 3, icon: part === "artifact" ? artifactIcon() : teamIcon(part) })))
    mem.teamRow.replaceChildren()
}
