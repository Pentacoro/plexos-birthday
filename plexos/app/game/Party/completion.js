// Where a player is in each game, from their progress (the Party's mem): what to show, and how far
// it counts. "pending" while it is being played, "done" once won, "complete" once everything in
// it is found. Estado shows it, and the desktop's game icons wear it as a sticker.
import {mazes} from "/plexos/app/game/Labyrinth/mazes.js"

const teams = ["spades", "hearts", "clubs", "diamonds"]

const states = {
    // the call to their own team, then the nine digits; complete with every team's number and the
    // Fibonacci line found. The secret number isn't counted: it stays a secret
    fibonacci(steps, flag) {
        const found = (flag("fibonacci", "contacts") || []).map(contact => contact.who)
        if (steps("fibonacci") >= 2 && [...teams, "intro"].every(who => found.includes(who))) return ["complete", "Completo"]
        if (steps("fibonacci") >= 2) return ["done", "Hecho"]
        if (steps("fibonacci") >= 1) return ["pending", "Número pendiente"]
        return ["pending", "Llamada pendiente"]
    },
    // the letters that count, then won with the third answered; complete with the secret letter
    webdetective(steps, flag) {
        const received = flag("webdetective", "received") || []
        if (received.includes("secret")) return ["complete", "Completo"]
        if (steps("webdetective") >= 3) return ["done", "Hecho"]
        const count = ["0", "1", "2", "final"].filter(key => received.includes(key)).length
        return ["pending", `Cartas ${count}/4`]
    },
    // the maze they are in; complete with every maze passed, every package picked up and delivered
    labyrinth(steps, flag) {
        const passed = flag("labyrinth", "passed") || [], packages = flag("labyrinth", "packages") || []
        const delivered = flag("labyrinth", "delivered") || []
        const every = Object.entries(mazes).flatMap(([name, maze]) => Object.keys(maze.packages || {}).map(team => name + ":" + team))
        const allTeams = ["spades", "hearts", "clubs", "diamonds"]
        if (flag("labyrinth", "done") && Object.keys(mazes).every(name => passed.includes(name)) && every.every(key => packages.includes(key)) && allTeams.every(t => delivered.includes(t))) return ["complete", "Completo"]
        if (flag("labyrinth", "done")) return ["done", "Hecho"]
        const names = { first: "Laberinto 1", artifact: "Laberinto del Artefacto", second: "Laberinto 2", third: "Laberinto 3" }
        return ["pending", names[flag("labyrinth", "leg")?.maze || "first"]]
    },
    // synced with one team, then with all four
    sync(steps, flag) {
        const pairs = flag("sync", "pairs") || {}
        const done = teams.filter(team => pairs[team]?.done).length
        if (done === teams.length) return ["complete", "Completo"]
        if (done) return ["done", "Hecho"]
        return ["pending", "Pendiente"]
    },
    // the step they are on, of six; complete once another player's route is gone through too
    artifacts(steps, flag) {
        const solved = steps("artifacts")
        if (solved >= 6 && Object.values(flag("artifacts", "routes") || {}).some(step => step >= 6)) return ["complete", "Completo"]
        if (solved >= 6) return ["done", "Hecho"]
        return ["pending", `Paso ${solved + 1}/6`]
    },
}

export function gameState(party, id) {
    return states[id]?.((game) => party.stepsSolved(game), (game, key) => party.flag(game, key)) || ["pending", ""]
}
