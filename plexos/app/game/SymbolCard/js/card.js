import {getTask} from "/plexos/lib/functions/dll.js"
import {columns, artifactSymbols} from "/plexos/app/game/SymbolCard/card.js"
import {teams} from "/plexos/app/game/Party/teams.js"
import {click} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

const el = (tag, className, text) => {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
}

// the suits along the top, each in its team's color
for (const [i, team] of columns.entries()) {
    const suit = el("button", "suit")
    suit.type = "button"
    suit.dataset.column = i
    suit.style.setProperty("--team", teams[team].color)
    suit.innerHTML = `<svg viewBox="0 0 24 24"><path d="${teams[team].path}" fill="currentColor"/></svg>`
    mem.suits.append(suit)
}
// the numbers, and every team's column of symbols beside each other on the strip
for (let n = 0; n < 10; n++) mem.numbers.append(el("span", "", String(n)))
for (const team of columns) {
    const column = el("div", "column")
    for (let n = 0; n < 10; n++) column.append(el("span", "", artifactSymbols[team][n]))
    mem.strip.append(column)
}

// The strip slides to a team's column, its suit marked above
mem.showColumn = (index, sound = true) => {
    mem.column = (index + columns.length) % columns.length
    mem.strip.style.transform = `translateX(${-mem.column * 100}%)`
    for (const suit of mem.suits.children) suit.classList.toggle("chosen", Number(suit.dataset.column) === mem.column)
    if (sound) click({ freq: 2400, q: 5, gain: 0.16, length: 0.02 })
}
