import { el, landing } from "./state.js"
import { landingContent } from "./window.js"
import { bootLocalPlexos } from "./cores.js"
import plexos from "./plexos.js"
import { playerByPassword, playerByName } from "../plexos/app/game/Party/players.js"
import { teams } from "../plexos/app/game/Party/teams.js"
import { showWelcome, loadWelcomeStyle } from "./welcome.js"
import { wrong } from "../plexos/app/game/Party/sound.js"
import { lang } from "../plexos/app/game/Party/lang.js"

// Typed in place of a password, this brings back whoever the secret number wiped (Party's
// void.js kept their core aside). PLACEHOLDER: set it to the real code; no player may have it.
const restoreCode = "000"

async function restoreVoided() {
    const name = plexos.Config?.voided
    if (!name) return null
    const kept = await plexos.db.getUser("void:" + name).catch(() => null)
    if (!kept) return null
    await plexos.db.saveUser({ ...kept, name })
    await plexos.db.deleteUser("void:" + name)
    plexos.Config.voided = null
    await plexos.db.setConfig(plexos.Config)
    return playerByName(name)
}

export function showPasswordBar() {
    loadWelcomeStyle()
    const content = landingContent()
    content.replaceChildren()
    landing.stage = el("div", "landing-stage landing-password")
    const input = el("input", "landing-password-input")
    input.type = "password"
    // letters and digits, typed in either case
    input.autocapitalize = "characters"
    input.spellcheck = false
    input.maxLength = 3
    input.autocomplete = "off"
    input.placeholder = "• • •"
    input.setAttribute("aria-label", "Password")

    input.oninput = async () => {
        input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
        input.classList.remove("wrong")
        if (input.value.length < 3) return
        const player = input.value === restoreCode ? await restoreVoided() : playerByPassword(input.value)
        if (!player) {
            // Restart the shake even when the same wrong code comes twice in a row
            void input.offsetWidth
            input.classList.add("wrong")
            wrong()
            input.value = ""
            return
        }
        input.disabled = true
        lang.current = player.lang || "es"
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
