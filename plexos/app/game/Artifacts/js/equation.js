import {getTask} from "/plexos/lib/functions/dll.js"
import {wrong} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 1. The player's equation, its unknowns drawn as the other teams' items, and a number
// pad. The answer fills one dash per digit and is checked once all are filled: wrong shakes and
// clears, right clears the stage.

// The equation's text drawn: {team} as that team's item, √[ ... ] as a root with its bar over
// what it covers, ² raised, the rest as written
function drawEquation(text) {
    const line = mem.el("div", "equation")
    let into = line
    for (const part of text.match(/\{\w+\}|√\[|\]|²|[^{}√\]²]+/g)) {
        if (part.startsWith("{")) {
            const item = mem.el("img", "item")
            item.src = mem.itemIcon(part.slice(1, -1))
            item.alt = ""
            into.append(item)
        } else if (part === "√[") {
            const root = mem.el("span", "root")
            const under = mem.el("span", "radicand")
            root.append(mem.el("span", "radical", "√"), under)
            into.append(root)
            into = under
        } else if (part === "]") into = line
        else if (part === "²") into.append(mem.el("sup", "", "2"))
        else for (const token of part.trim().split(/\s+/).filter(Boolean)) into.append(mem.el("span", /^[\d()]+$/.test(token) ? "term" : "op", token))
    }
    return line
}

mem.buildEquation = (solved) => {
    const { text, answer } = mem.equation
    const target = String(answer)
    const slots = mem.el("div", "slots")
    const cells = [...target].map(() => slots.appendChild(mem.el("span")))
    let entry = solved ? target : ""
    const render = () => cells.forEach((cell, i) => cell.textContent = entry[i] || "")
    render()
    if (solved) slots.classList.add("solved")

    const pad = mem.el("div", "keypad")
    for (const digit of "1234567890") {
        const key = mem.el("button", "", digit)
        key.type = "button"
        key.dataset.digit = digit
        pad.append(key)
    }
    pad.addEventListener("pointerdown", async e => {
        const key = e.target.closest("button")
        if (!key) return
        e.preventDefault()
        key.classList.add("pressed")
        if (mem.busy || slots.classList.contains("solved") || entry.length >= target.length) return
        entry += key.dataset.digit
        render()
        if (entry.length < target.length) return
        mem.busy = true
        if (entry === target) {
            slots.classList.add("solved")
            await mem.clearStage()
        } else {
            wrong()
            slots.classList.remove("wrong")
            void slots.offsetWidth
            slots.classList.add("wrong")
            await new Promise(resolve => setTimeout(resolve, 450))
            entry = ""
            render()
        }
        mem.busy = false
    })
    for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
        pad.addEventListener(type, () => { for (const key of pad.querySelectorAll(".pressed")) key.classList.remove("pressed") })
    }

    mem.screen.append(drawEquation(text), slots, pad)
}
