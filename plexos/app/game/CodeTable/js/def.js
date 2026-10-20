import {getTask} from "/plexos/lib/functions/dll.js"
import {players} from "/plexos/app/game/Party/players.js"
import {teams, teamOrder} from "/plexos/app/game/Party/teams.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Artifact 2 on the desktop: spades' four papers, the table of every guest and their
// own 3-digit code (players.js, code), as on the printed one (assets/CodeTable/print.mjs), here
// one team after another under its suit. The test users are left out, as on the print, and so
// are the spares not yet written in, which the print has as blank lines.
mem.root  = task.node.querySelector(".artifact")
mem.table = mem.root.querySelector(".table")

const el = (tag, className, text) => {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
}

mem.drawTable = () => {
    mem.table.replaceChildren()
    for (const key of teamOrder) {
        const team = teams[key]
        const heading = el("div", "team")
        heading.style.setProperty("--team", team.color)
        heading.innerHTML = `<svg viewBox="0 0 24 24"><path d="${team.path}" fill="currentColor"/></svg>`
        heading.append(el("span", "", team.name))
        mem.table.append(heading)
        const guests = players.filter(player => player.team === key && !player.tester && !player.spare).sort((a, b) => a.name.localeCompare(b.name, "es"))
        for (const guest of guests) {
            const row = el("div", "row")
            row.append(el("span", "name", guest.name), el("span", "code", guest.code))
            mem.table.append(row)
        }
    }
}
