import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 1. The player's equation, its unknowns drawn as the other teams' items, and the number
// pad for its answer (entry.js).

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
    const { slots, pad } = mem.codeEntry(mem.equation.answer, solved)
    mem.screen.append(drawEquation(mem.equation.text), slots, pad)
}
