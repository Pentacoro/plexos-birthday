import {getTask} from "/plexos/lib/functions/dll.js"
import {steps, width, stackPuzzle} from "/plexos/app/game/Sync/generate.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 2. Side 1 has three strips of blocks, each scrolled step by step, and below them a
// button that drops the three into a stack, to check against side 2's description. Side 2 has the stack to reach and a code to type. Once the stack matches,
// the strips' step numbers are side 2's code. Each strip has at most one block per column,
// so no stack is over three.
// A strip is a loop of 10 columns, all of them in view, so every block always shows and the
// stack holds as many as the three strips together. It scrolls through steps 0 to 9.
mem.stackPuzzle = () => stackPuzzle(mem.rand("stack"))

// Columns of unit blocks, bottom aligned. Dropped, they fall into place a level at a time,
// the bottom one first, each block fading in a little above its place.
const fall = 140
function blocks(heights, max, className) {
    const ns = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("viewBox", `0 0 ${width * 10} ${max * 10}`)
    svg.setAttribute("class", "blocks " + className)
    svg.draw = (list, dropped = false) => {
        svg.replaceChildren()
        list.forEach((h, c) => {
            for (let k = 0; k < h; k++) {
                const r = document.createElementNS(ns, "rect")
                if (dropped) {
                    r.classList.add("dropped")
                    r.style.animationDelay = k * fall + "ms"
                }
                r.setAttribute("x", c * 10 + 1)
                r.setAttribute("y", (max - k - 1) * 10 + 1)
                r.setAttribute("width", 8)
                r.setAttribute("height", 8)
                r.setAttribute("rx", 1.5)
                svg.append(r)
            }
        })
    }
    svg.draw(heights)
    return svg
}

const chevron = (flip) => `<svg viewBox="0 0 24 24"><path d="${flip ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const dropIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11M7.5 9.5 12 14l4.5-4.5M5 19h14"/></svg>`

mem.buildStack = (solved) => {
    const p = mem.stackPuzzle()
    if (mem.side === 2) {
        const field = mem.entryField(3, p.solution.join(""))
        if (solved) field.solve()
        mem.screen.append(blocks(p.target, 3, "target"), field.node, mem.keypad(field))
        return
    }
    const at = solved ? [...p.solution] : [0, 0, 0]
    let done = solved
    const rows = mem.el("div", "strips")
    const views = [0, 1, 2].map(i => {
        const row = mem.el("div", "strip-row")
        const back = mem.el("button", "strip-arrow")
        back.type = "button"
        back.dataset.key = i + ":1"
        back.innerHTML = chevron(false)
        const forward = mem.el("button", "strip-arrow")
        forward.type = "button"
        forward.dataset.key = i + ":-1"
        forward.innerHTML = chevron(true)
        const step = mem.el("span", "strip-step")
        const strip = blocks([], 1, "strip")
        row.append(back, step, strip, forward)
        rows.append(row)
        return { step, strip }
    })
    // the stack, empty until dropped, under the strips: the button where their arrow and step
    // are, the stack where their blocks are, room where their other arrow is
    const result = blocks([], 3, "result")
    const bottom = mem.el("div", "strip-result")
    const drop = mem.el("button", "strip-drop")
    drop.type = "button"
    drop.dataset.key = "drop"
    drop.setAttribute("aria-label", "Apilar")
    drop.innerHTML = dropIcon
    bottom.append(drop, result, mem.el("span", "strip-room"))
    const render = () => views.forEach(({ step, strip }, i) => {
        step.textContent = at[i]
        strip.draw(Array.from({ length: width }, (_, c) => p.strips[i][(at[i] + c) % steps]))
    })
    render()
    if (solved) result.draw(p.stack(at))
    // A strip moved, the stack dropped before no longer holds: it clears
    mem.pressKeys(rows, key => {
        if (done || mem.busy) return
        const [i, by] = key.dataset.key.split(":").map(Number)
        // the arrows move the blocks their way, and past either end the loop carries on
        at[i] = (at[i] + by + steps) % steps
        render()
        result.draw([])
    })
    // Dropped, the stack falls into place, right or wrong; only the right one lights up white
    mem.pressKeys(bottom, async () => {
        if (done || mem.busy) return
        mem.busy = true
        const heights = p.stack(at)
        result.draw(heights, true)
        await new Promise(resolve => setTimeout(resolve, 2 * fall + 350))
        if (heights.join() === p.target.join()) {
            done = true
            await mem.clearStage()
        } else await mem.lightFail()
        mem.busy = false
    })
    mem.screen.append(rows, bottom)
}
