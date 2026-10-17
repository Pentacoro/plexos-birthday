import { el, landing } from "./state.js"
import { landingContent } from "./window.js"
import { bootLocalPlexos } from "./cores.js"
import plexos from "./plexos.js"
import { playerByPassword } from "../plexos/app/game/Party/players.js"
import { teams } from "../plexos/app/game/Party/teams.js"
import { showWelcome, loadWelcomeStyle } from "./welcome.js"

export function showPasswordBar() {
    loadWelcomeStyle()
    const content = landingContent()
    content.replaceChildren()
    landing.stage = el("div", "landing-stage landing-password")
    const input = el("input", "landing-password-input")
    input.type = "password"
    input.inputMode = "numeric"
    // iOS only opens the number pad for a password field with this pattern
    input.pattern = "[0-9]*"
    input.maxLength = 3
    input.autocomplete = "off"
    input.placeholder = "• • •"
    input.setAttribute("aria-label", "Password")

    input.oninput = async () => {
        input.value = input.value.replace(/\D/g, "")
        input.classList.remove("wrong")
        if (input.value.length < 3) return
        const player = playerByPassword(input.value)
        if (!player) {
            // Restart the shake even when the same wrong code comes twice in a row
            void input.offsetWidth
            input.classList.add("wrong")
            input.value = ""
            return
        }
        input.disabled = true
        // the system takes the player's team color from the first frame of the desktop
        plexos.Boot.colorScheme = teams[player.team]?.scheme || null
        // the welcome stays up while the desktop loads behind it, and at least long enough to read
        const welcome = await showWelcome(player)
        const shown = new Promise(resolve => setTimeout(resolve, 2400))
        await bootLocalPlexos(player.name)
        await shown
        welcome.dismiss()
    }

    landing.stage.append(input)
    content.append(landing.stage)
    input.focus()
}
