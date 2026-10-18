import {getTask} from "/plexos/lib/functions/dll.js"
import {lang} from "/plexos/app/game/Party/lang.js"
import {puzzles, firstUnlock, unlockTime, isUnlocked, clock, clockOffset, allUnlocked} from "/plexos/app/game/Party/puzzles.js"

let task = getTask(/TASKID/)
let mem  = task.mem

const zone = "America/Argentina/Buenos_Aires"
// dates in the player's language, always at the party's own time
const locale = lang.current === "en" ? "en-US" : "es-AR"
const time = new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZone: zone })
const hour = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone })
const stored = (key) => { try { return localStorage.getItem(key) } catch { return null } }
mem.store = (key, value) => { try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value) } catch { /* nothing kept */ } }

const button = (label, data) => {
    const node = document.createElement("button")
    node.type = "button"
    node.textContent = label
    Object.assign(node.dataset, data)
    return node
}

mem.clock.append(...mem.clockSteps.map(([label, by]) => button(label, { action: "clock", by: String(by) })))
mem.mode.append(...mem.modes.map(([label, value]) => button(label, { action: "mode", value: String(value) })))
for (const [key, team] of Object.entries(mem.party.teams)) {
    const node = button("", { action: "team", team: key })
    node.style.setProperty("--team", team.color)
    node.innerHTML = `<svg viewBox="0 0 24 24"><path d="${team.path}" fill="currentColor"/></svg><span>${team.name}</span>`
    mem.teamRow.append(node)
}
for (const puzzle of puzzles) {
    const row = document.createElement("li")
    row.append(Object.assign(document.createElement("span"), { textContent: puzzle.name }), button("Reiniciar", { action: "reset", id: puzzle.id }))
    mem.progress.append(row)
}

// everything that changes: the time, which mode is on, each puzzle's state, the team
mem.render = () => {
    const offset = clockOffset()
    mem.now.textContent = time.format(clock()) + (offset ? ` (${offset > 0 ? "+" : "−"}${Math.round(Math.abs(offset) / 60000)} min)` : " (real)")
    const forced = stored("party-unlock-all")
    for (const node of mem.mode.children) node.classList.toggle("on", node.dataset.value === String(forced))
    mem.list.replaceChildren(...puzzles.map(puzzle => {
        const row = document.createElement("li")
        const left = unlockTime(puzzle) - clock()
        const open = isUnlocked(puzzle)
        row.innerHTML = "<b></b><span></span><em></em>"
        row.children[0].textContent = hour.format(unlockTime(puzzle))
        row.children[1].textContent = puzzle.name
        row.children[2].textContent = open ? (allUnlocked() && left > 0 ? "abierto (forzado)" : "abierto") : "en " + Math.ceil(left / 60000) + " min"
        row.classList.toggle("open", open)
        return row
    }))
    for (const node of mem.teamRow.children) node.classList.toggle("on", node.dataset.team === mem.party.player?.team)
}

// just before the first puzzle opens
mem.partyTime = () => firstUnlock - 60 * 1000
