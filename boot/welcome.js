import { el } from "./state.js"
import { teams } from "../plexos/app/game/Party/teams.js"

// Between the password and the desktop: the player's suit in their team color, their card
// beside it, and their name. It sits over everything while the core mounts and the theme
// changes face behind it, so it keeps its own stylesheet, apart from the theme's faces.

// Loaded ahead, when the password bar opens, so the welcome never shows before its styles
let styled = null
export function loadWelcomeStyle() {
    if (styled) return styled
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "/boot/welcome.css"
    styled = new Promise(resolve => {
        link.onload = resolve
        link.onerror = resolve
    })
    document.head.append(link)
    return styled
}

export async function showWelcome(player) {
    await loadWelcomeStyle()
    const screen = el("div", "welcome")
    const card = el("div", "welcome-card")
    const team = teams[player.team]
    if (team) {
        card.innerHTML = `<svg viewBox="0 0 24 24"><path d="${team.path}" fill="none" stroke="${team.color}" stroke-width="1.6" stroke-linejoin="round"/></svg>`
        card.append(el("span", "welcome-number", player.card))
    }
    screen.append(card, el("p", "welcome-name", `${player.greeting || "Bienvenido"}, ${player.name}`))
    document.body.append(screen)

    return {
        // fades out, then leaves
        dismiss() {
            screen.classList.add("leaving")
            setTimeout(() => screen.remove(), 600)
        },
    }
}
