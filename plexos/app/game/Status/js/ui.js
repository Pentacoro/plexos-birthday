import {getTask} from "/plexos/lib/functions/dll.js"
import {puzzles, isUnlocked} from "/plexos/app/game/Party/puzzles.js"

let task = getTask(/TASKID/)
let mem  = task.mem

const el = (tag, className, text) => {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
}

// The player: their card (suit in the team's color, its rank), name, team and group code
mem.drawPlayer = () => {
    const card = mem.root.querySelector(".player-card")
    if (mem.team) {
        card.style.setProperty("--team", mem.team.color)
        card.innerHTML = `<svg viewBox="0 0 24 24"><path d="${mem.team.path}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`
        card.append(el("span", "rank", mem.player?.card || ""))
    }
    mem.root.querySelector(".player-name").textContent = mem.player?.name || ""
    mem.root.querySelector(".player-team").textContent = mem.team?.name || ""
    mem.root.querySelector(".player-code .code").textContent = mem.team?.code || "—"
    mem.root.querySelector(".player-code").style.setProperty("--team", mem.team?.color || "#fff")
    mem.drawPassword()
}

// The login password, as dots until the eye shows it
const eye = (open) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>${open ? "" : '<path d="M4 20 20 4"/>'}</svg>`
mem.passwordShown = false
mem.drawPassword = () => {
    const password = mem.player?.password || ""
    const row = mem.root.querySelector(".player-password")
    row.querySelector(".code").textContent = mem.passwordShown ? password : "•".repeat(password.length)
    const button = row.querySelector(".reveal")
    button.innerHTML = eye(!mem.passwordShown)
    button.setAttribute("aria-label", mem.passwordShown ? "Ocultar contraseña" : "Mostrar contraseña")
    button.onclick = () => {
        mem.passwordShown = !mem.passwordShown
        mem.drawPassword()
    }
}

// A question mark in place of a game's icon, until that game's time
const hiddenIcon = () => {
    const icon = el("span", "game-icon censored")
    icon.innerHTML = `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="48" height="48" rx="10"/><path d="M26.5 26a5.5 5.5 0 1 1 7.2 5.2c-1.5.8-2.2 1.8-2.2 3.8"/><circle cx="32" cy="43" r="1.8" fill="currentColor" stroke="none"/></svg>`
    return icon
}

// One row per game, its icon on the left and where the player is on the right.
// Name and icon stay hidden until the game's own date and time. The phone is a preview, so it shows from the start.
mem.drawGames = () => {
    mem.games.replaceChildren(...puzzles.map(puzzle => {
        const [state, text] = mem.stateOf(puzzle)
        const shown = puzzle.preview || isUnlocked(puzzle)
        const row = el("div", "game " + state)
        const icon = shown ? el("img", "game-icon") : hiddenIcon()
        if (shown) { icon.src = puzzle.icon; icon.alt = "" }
        row.append(icon, el("span", "game-name" + (shown ? "" : " censored"), shown ? puzzle.name : ""), el("span", "game-state", text))
        return row
    }))
}
