import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

const frame = () => new Promise(resolve => requestAnimationFrame(resolve))

// Every move of the first letter is measured from where the pieces sit, so nothing starts until
// the window has its size, its fonts and a steady layout: opened the first time, on a slow phone,
// it is still settling for a moment, and a letter set out in that moment lands all wrong.
async function settled() {
    await document.fonts?.ready
    let last = null
    for (let i = 0; i < 60; i++) {
        await frame()
        const size = mem.stage.clientWidth + "x" + mem.stage.clientHeight
        if (mem.stage.clientHeight && size === last) return
        last = size
    }
}

// Picks up at the first letter not yet answered
mem.machine.style.transform = "translateY(110%)"
task.focus()
mem.busy = true
await settled()
mem.busy = false
const solved = mem.party.stepsSolved(mem.id)
if (solved >= mem.letters.length) mem.finish()
else mem.startStep(solved)
