import {getTask} from "/plexos/lib/functions/dll.js"
import {numbers} from "/plexos/app/game/Labyrinth/numbers.js"
import {t} from "/plexos/app/game/Party/lang.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// What the maze has to say. Messages show between the maze and the pad, a moment each, then
// fade: a maze's name the first time it is entered, and "Te faltó algo..." for coming on
// without the package. In diamonds' maze, standing on a cell with a digit (numbers.js) shows
// the digit above the maze, where that shorter maze leaves room, and stepping off clears it.
mem.note = mem.root.querySelector(".maze-note")
mem.digit = mem.root.querySelector(".maze-digit")

const hold = 1600, fade = 600

// The message halfway between what is drawn of the maze (its arrows too) and the pad's
// diamond, the digit halfway between the badges and the maze, rather than wherever the maze's
// stretch leaves them: placed again when the maze is drawn and when the window changes size
mem.placeNote = () => {
    const drawn = [...mem.matrix.children].map(node => node.getBoundingClientRect()).filter(box => box.height)
    if (!drawn.length) return
    const top = mem.root.getBoundingClientRect().top
    const mazeTop = Math.min(...drawn.map(box => box.top))
    const mazeBottom = Math.max(...drawn.map(box => box.bottom))
    mem.note.style.top = (mazeBottom + mem.pad.getBoundingClientRect().top) / 2 - top + "px"
    mem.digit.style.top = (mem.root.querySelector(".badge-row").getBoundingClientRect().bottom + mazeTop) / 2 - top + "px"
}
new ResizeObserver(() => mem.placeNote()).observe(mem.root)

// the cell the player is on: its digit, or nothing
mem.noteCell = () => {
    const digit = mem.leg?.maze === "artifact" && mem.at ? numbers[mem.at.join(",")] : null
    mem.digit.textContent = digit || ""
}

// Each message in turn, a moment each, then faded out, once no story covers the maze. A new
// arrival cuts the last one short.
let saying = 0
const storyOpen = () => task.node.querySelector(".story-viewer")
async function say(texts) {
    const run = ++saying
    mem.note.textContent = ""
    // the story, when there is one, opens just after the arrival
    await new Promise(resolve => setTimeout(resolve, 0))
    while (storyOpen()) {
        await new Promise(resolve => setTimeout(resolve, 200))
        if (run !== saying) return
    }
    for (const text of texts) {
        mem.note.textContent = t(text)
        mem.note.classList.remove("faded")
        await new Promise(resolve => setTimeout(resolve, hold))
        if (run !== saying) return
        mem.note.classList.add("faded")
        await new Promise(resolve => setTimeout(resolve, fade))
        if (run !== saying) return
    }
    mem.note.textContent = ""
}

// Into a maze: its name the first time, then, past the first without their own package,
// that they missed something
const entered = () => mem.party.flag(mem.id, "entered") || []
mem.noteArrival = () => {
    mem.noteCell()
    const texts = []
    const maze = mem.leg.maze
    if (!entered().includes(maze)) {
        texts.push(mem.mazeNames[maze])
        mem.party.setFlag(mem.id, "entered", [...entered(), maze])
    }
    if (["second", "third"].includes(maze) && !mem.carried() && !mem.revealed) texts.push("Te faltó algo...")
    if (texts.length) say(texts)
    else { saying++; mem.note.textContent = "" }
}
