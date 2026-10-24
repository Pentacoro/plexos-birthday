import {getTask} from "/plexos/lib/functions/dll.js"
import {wrong} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A number typed into one dash per digit on a number pad, checked once every dash is filled:
// wrong shakes and clears, right turns green and clears the stage. Each stage that asks for a
// number uses it.
mem.codeEntry = (answer, solved, labels = []) => {
    const target = String(answer)
    const slots = mem.el("div", "slots")
    const cells = [...target].map((_, i) => {
        const span = mem.el("span")
        if (labels[i]) span.dataset.symbol = labels[i]
        return slots.appendChild(span)
    })
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
    return { slots, pad }
}
