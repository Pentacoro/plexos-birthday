import {getTask} from "/plexos/lib/functions/dll.js"
import {pushBack} from "/plexos/app/game/Party/backStack.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Walking blind: each move either goes through or bumps. Every opening joined to another maze
// lets the player through, either way. Only the labyrinth's end waits for their own package.
const STEPS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }

function edgeOf([x, y], dir) {
    if (dir === "up") return `h${x},${y}`
    if (dir === "down") return `h${x},${y + 1}`
    if (dir === "left") return `v${x},${y}`
    return `v${x + 1},${y}`
}

// Where an opening of the current maze leads, if anywhere
mem.wayOut = (role) => mem.ways[mem.leg.maze + ":" + role]

// Whether this team has its own package, picked up in any visit
mem.carried = () => (mem.party.flag(mem.id, "packages") || []).some(key => key.endsWith(":" + mem.team))

mem.startLeg = (leg) => {
    mem.leg = leg
    const maze = mem.mazes[leg.maze]
    mem.at = [...maze.openings.find(o => o.role === leg.enter).cell]
    mem.picked = new Set()
    mem.setStageBadges()
    mem.drawMatrix()
}

mem.move = (dir) => {
    if (mem.busy || mem.at === null) return
    const leg = mem.leg, maze = mem.mazes[leg.maze]
    const edge = edgeOf(mem.at, dir)
    const [nx, ny] = [mem.at[0] + STEPS[dir][0], mem.at[1] + STEPS[dir][1]]
    const outside = nx < 0 || ny < 0 || nx >= maze.w || ny >= maze.h
    if (outside) {
        const opening = maze.openings.find(o => o.edge === edge)
        const way = opening && mem.wayOut(opening.role)
        if (way === "end" && mem.carried() && !mem.revealed) return mem.leaveMaze(opening.role)
        if (way && way !== "end") return mem.leaveMaze(opening.role)
        return mem.bump()
    }
    if (maze.walls.includes(edge)) return mem.bump()
    mem.at = [nx, ny]
    mem.drawPlayer()
    mem.pickUp(leg.maze, maze)
}

// Any team's package can be picked up, and each one is kept for a completionist tally. Only
// this team's own package opens the way out at the end.
mem.pickUp = (name, maze) => {
    for (const [team, [px, py]] of Object.entries(maze.packages || {})) {
        if (px !== mem.at[0] || py !== mem.at[1] || mem.picked.has(team)) continue
        mem.picked.add(team)
        mem.flash(mem.party.teams[team]?.color)
        const key = name + ":" + team, got = mem.party.flag(mem.id, "packages") || []
        if (!got.includes(key)) mem.party.setFlag(mem.id, "packages", [...got, key])
    }
}

// Out of one maze and into the one that opening joins. Back returns to the maze left, at the
// opening left by. Where the player stands is kept, so they come back to it.
mem.leaveMaze = async (role) => {
    mem.busy = true
    const way = mem.wayOut(role), from = { maze: mem.leg.maze, enter: role }
    const next = way === "end" ? null : { maze: way.split(":")[0], enter: way.split(":")[1] }
    if (next) await mem.party.setFlag(mem.id, "leg", next)
    else {
        await mem.party.setFlag(mem.id, "done", true)
        await mem.party.solveStep(mem.id, 1)
    }
    await mem.fadeTo(() => next ? mem.startLeg(next) : mem.finish())
    if (next) pushBack(() => mem.goBack(from))
    mem.busy = false
}

mem.goBack = async (leg) => {
    mem.busy = true
    await mem.party.setFlag(mem.id, "leg", leg)
    await mem.fadeTo(() => mem.startLeg(leg))
    mem.busy = false
}

mem.fadeTo = async (show) => {
    mem.matrix.classList.add("leaving")
    await new Promise(resolve => setTimeout(resolve, 450))
    mem.matrix.classList.remove("leaving")
    show()
}

// Finished: from then on every maze shows its walls, and the player's dot in their team's
// color stands at the end, free to walk all of them again
mem.finish = () => {
    mem.revealed = true
    mem.startLeg({ maze: "third", enter: "exit" })
    if (mem.hint) mem.hint.hidden = true
    mem.root.classList.add("done")
}
