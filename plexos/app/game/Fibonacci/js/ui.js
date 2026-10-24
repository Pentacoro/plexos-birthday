import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {teamIcon, teamOrder} from "/plexos/app/game/Party/teams.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"
import {storyButton, tellStory} from "/plexos/app/game/Party/story.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badge = categoryBadge("solo")
mem.hint = hintButton(mem.hintEntry)
// A call that was actually answered, other than the plain line. A wrong number used to be
// remembered as retired; that flag alone no longer hides the hint.
const answered = (mem.party.flag(mem.id, "contacts") || []).some(contact => contact.who !== "intro")
mem.hint.hidden = answered
mem.root.querySelector(".badge-row").append(mem.badge, storyButton(task, mem.id), mem.hint)
mem.tellStory = () => tellStory(task, mem.id)

// The hint is for working out the numbers: it goes for good once a real number answers,
// anything but the plain Fibonacci line. A number that leads nowhere leaves it.
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
        for (let i = 0; i < group.length; i++) {
            const span = document.createElement("span")
            if (group.labels?.[i]) span.dataset.symbol = group.labels[i]
            digits.append(span)
        }
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
    buildSlots(mem.codeParts[team].map(part => ({
        length: 3,
        icon: part === "artifact" ? artifactIcon() : teamIcon(part),
        labels: part === "artifact" ? mem.artifactSymbols : undefined,
    })))
    mem.teamRow.replaceChildren()
    // the player's own symbol with their card's code beside it: the code is made of codes like it
    if (!mem.team) return
    const own = document.createElement("div")
    own.className = "team own-code"
    const code = document.createElement("span")
    code.textContent = mem.party.teams[mem.team].code
    own.append(teamIcon(mem.team), code)
    mem.teamRow.append(own)
}
