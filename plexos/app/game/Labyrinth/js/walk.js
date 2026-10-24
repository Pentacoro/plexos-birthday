import {getTask} from "/plexos/lib/functions/dll.js"
import {step} from "/plexos/app/game/Party/sound.js"
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

// Whether this team's own package was picked up (regardless of delivery)
mem.pickedOwn = () => (mem.party.flag(mem.id, "packages") || []).some(key => key.endsWith(":" + mem.team))

// Ready to exit: own package both picked up and delivered to its drop point
mem.carried = () => mem.pickedOwn() && (mem.party.flag(mem.id, "delivered") || []).includes(mem.team)

// A maze counts as passed once left by another opening than the one it was entered by. From
// then on it shows its walls and the player's dot, and walls no longer send them back.
mem.passed = () => mem.party.flag(mem.id, "passed") || []
// Finished, every maze shows, but diamonds' own: only once it has been walked through.
mem.shows = (name) => (mem.revealed && name !== "artifact") || mem.passed().includes(name)

// In a maze not yet passed, a wall sends the player back to the way they came in
mem.hitWall = () => {
    mem.bump()
    if (mem.shows(mem.leg.maze)) return
    mem.at = [...mem.mazes[mem.leg.maze].openings.find(o => o.role === mem.leg.enter).cell]
    mem.noteCell()
}

// Done completely: finished, every maze passed, every package picked up and delivered
mem.complete = () => mem.revealed
    && ["first", "artifact", "second", "third"].every(name => mem.passed().includes(name))
    && Object.entries(mem.mazes).every(([name, maze]) => Object.keys(maze.packages || {}).every(team => (mem.party.flag(mem.id, "packages") || []).includes(name + ":" + team)))
    && (mem.allDropTeams?.() || []).every(team => (mem.party.flag(mem.id, "delivered") || []).includes(team))

mem.startLeg = (leg) => {
    mem.leg = leg
    const maze = mem.mazes[leg.maze]
    mem.at = [...maze.openings.find(o => o.role === leg.enter).cell]
    mem.picked = new Set()
    mem.root.classList.toggle("inverted", leg.maze === "artifact")
    mem.setStageBadges()
    mem.drawMatrix()
    mem.noteArrival()
    mem.placeNote()
    mem.updateIndicator?.()
    mem.tellStory()
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
        // the very first entrance, walked out of once everything is done: there is no out (abyss.js)
        if (opening && mem.leg.maze === "first" && opening.role === "entry" && mem.complete()) return mem.abyss()
        if (way === "end" && mem.carried() && !mem.revealed) return mem.leaveMaze(opening.role)
        if (way && way !== "end") return mem.leaveMaze(opening.role)
        return mem.hitWall()
    }
    if (maze.walls.includes(edge)) return mem.hitWall()
    mem.at = [nx, ny]
    step()
    mem.nudge(dir)
    mem.drawPlayer()
    mem.noteCell()
    mem.pickUp(leg.maze, maze)
    mem.checkDelivery?.()
}

// Any team's package can be picked up, each spawning a delivery point for a completionist
// tally. Only this team's own package — picked up and delivered — opens the way out.
mem.pickUp = (name, maze) => {
    for (const [team, [px, py]] of Object.entries(maze.packages || {})) {
        if (px !== mem.at[0] || py !== mem.at[1] || mem.picked.has(team)) continue
        mem.picked.add(team)
        mem.flash(mem.party.teams[team]?.color)
        const key = name + ":" + team, got = mem.party.flag(mem.id, "packages") || []
        if (!got.includes(key)) {
            mem.party.setFlag(mem.id, "packages", [...got, key])
            mem.spawnDrop?.(team)
            mem.sayTop?.(["Paquete levantado"])
            mem.updateIndicator?.()
        }
    }
}

// Out of one maze and into the one that opening joins. Back returns to the maze left, at the
// opening left by. Where the player stands is kept, so they come back to it.
mem.leaveMaze = async (role) => {
    mem.busy = true
    const way = mem.wayOut(role), from = { maze: mem.leg.maze, enter: role }
    if (role !== mem.leg.enter && !mem.passed().includes(mem.leg.maze)) {
        await mem.party.setFlag(mem.id, "passed", [...mem.passed(), mem.leg.maze])
        // pictured by its own walls
        mem.party.record("mazes", mem.mazeNames[mem.leg.maze], mem.leg.maze, { image: "/plexos/app/game/Party/img/maze-" + mem.leg.maze + ".svg" })
    }
    const next = way === "end" ? null : { maze: way.split(":")[0], enter: way.split(":")[1] }
    // start the background transition at the same time as the matrix fade
    mem.root.classList.toggle("inverted", next?.maze === "artifact")
    if (next) await mem.party.setFlag(mem.id, "leg", next)
    else {
        await mem.party.setFlag(mem.id, "done", true)
        // the third maze passed: the labyrinth is won
        mem.party.setBadge("mazes", 1)
        await mem.party.solveStep(mem.id, 1)
    }
    await mem.fadeTo(() => next ? mem.startLeg(next) : mem.finish())
    if (next) pushBack(() => mem.goBack(from))
    mem.busy = false
}

mem.goBack = async (leg) => {
    mem.busy = true
    mem.root.classList.toggle("inverted", leg.maze === "artifact")
    await mem.party.setFlag(mem.id, "leg", leg)
    await mem.fadeTo(() => mem.startLeg(leg))
    mem.busy = false
}

// A maze kept in the Inventario, opened: the player stands at its way in (diamonds' own, in the
// second), unless they are in it already
mem.showMaze = async (name) => {
    if (mem.busy || !mem.mazes[name] || mem.leg?.maze === name) return
    const enter = name === "second" && mem.team === "diamonds" ? "entry-diamonds" : "entry"
    await mem.goBack({ maze: name, enter })
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
    // one-pass: all packages delivered before exiting — open at "complete" with "done" beside it
    if (mem.complete()) {
        const seen = mem.party.flag("story", mem.id) || []
        if (!seen.includes("done")) mem.party.setFlag("story", mem.id, [...seen, "done"])
    }
    mem.startLeg({ maze: "third", enter: "exit" })
    if (mem.hint) mem.hint.hidden = true
    mem.root.classList.add("done")
}
