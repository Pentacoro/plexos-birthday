import {getTask} from "/plexos/lib/functions/dll.js"
import {numbers} from "/plexos/app/game/Labyrinth/numbers.js"
import {mazes} from "/plexos/app/game/Labyrinth/mazes.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 4. Diamonds' artifact, their maze with digits in some of its cells: three squares
// drawn as the maze is on the phone, dots at the corners of its cells and arrows at its way in
// and way out, one square per digit, with a dot standing in the cell where it is, as the
// player's does. Each square is turned, so the arrows are what tell which way it lies. The
// printed cards (theirs and the artifact) ring the cells with digits but not the digits: they
// show on standing in those cells in the Labyrinth.
const maze = mazes.artifact
const { w, h } = maze
// the square each is drawn in: room for the maze whichever way it is turned
const size = Math.max(w, h)
// how each square is turned, clockwise
const turns = [90, 270, 180]

// an arrow beyond an opening, as the Labyrinth draws them: in for the way in, out for the way out
function arrow(opening) {
    const [x, y] = opening.edge.slice(1).split(",").map(Number)
    let cx, cy, angle
    if (opening.edge[0] === "h") { cx = x + 0.5; cy = y === 0 ? -0.6 : h + 0.6; angle = y === 0 ? 90 : -90 }
    else { cy = y + 0.5; cx = x === 0 ? -0.6 : w + 0.6; angle = x === 0 ? 0 : 180 }
    if (opening.role !== "entry") angle += 180
    return `<path d="M -0.26 -0.2 L 0.22 0 L -0.26 0.2 Z" class="arrow" transform="translate(${cx} ${cy}) rotate(${angle})"/>`
}

function cellGrid(cell, turn) {
    const [x, y] = cell.split(",").map(Number)
    let drawing = ""
    for (let row = 0; row <= h; row++) for (let column = 0; column <= w; column++) drawing += `<circle cx="${column}" cy="${row}" r="0.085"/>`
    drawing += maze.openings.map(arrow).join("")
    drawing += `<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.26" class="lit"/>`
    return `<svg viewBox="${w / 2 - size / 2 - 1.1} ${h / 2 - size / 2 - 1.1} ${size + 2.2} ${size + 2.2}" class="cell-grid"><g transform="rotate(${turn} ${w / 2} ${h / 2})">${drawing}</g></svg>`
}

mem.buildCells = (solved) => {
    const grids = mem.el("div", "cell-grids")
    // the player's own three cells (perPlayer.js), read in order
    grids.innerHTML = mem.mine.cells.map((cell, i) => cellGrid(cell, turns[i % turns.length])).join("")
    const { slots, pad } = mem.codeEntry(mem.mine.cells.map(cell => numbers[cell]).join(""), solved)
    mem.screen.append(grids, slots, pad)
}
