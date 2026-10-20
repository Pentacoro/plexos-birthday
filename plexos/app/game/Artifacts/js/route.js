import {getTask} from "/plexos/lib/functions/dll.js"
import {setCategory} from "/plexos/app/game/Party/categories.js"
import {wrong} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Routes. The player's own goes through the six stages, the last their own password, real only.
// Once it is done the safe opens on the routes: their own, any other started, and "Nueva ruta",
// which takes another player's password, real or the fake their second letter gave them, and
// goes through the safe as them. That other player's last stage can't be answered without
// their real password, so it lets the player go on anyway: a route of someone else's to the
// end completes the safe. Own steps are the puzzle's steps; another's are kept apart, by name.
mem.ownRoute = () => mem.route === mem.player
mem.routes = () => mem.party.flag(mem.id, "routes") || {}
mem.routeSteps = () => mem.ownRoute() ? mem.party.stepsSolved(mem.id) : (mem.routes()[mem.route] || 0)
mem.ownDone = () => mem.party.stepsSolved(mem.id) >= mem.stages.length
mem.solveRouteStep = async (step) => {
    if (mem.ownRoute()) return mem.party.solveStep(mem.id, step)
    if ((mem.routes()[mem.route] || 0) >= step) return
    await mem.party.setFlag(mem.id, "routes", { ...mem.routes(), [mem.route]: step })
}

// A three-character password typed as at the landing: letters and digits, either case. check
// says whether it's right; a wrong one shakes and clears.
function passwordInput(check, solved = "") {
    const input = mem.el("input", "route-password")
    input.type = "password"
    input.autocapitalize = "characters"
    input.spellcheck = false
    input.autocomplete = "off"
    input.maxLength = 3
    input.placeholder = "• • •"
    input.value = solved
    input.disabled = !!solved
    input.oninput = async () => {
        input.value = input.value.toUpperCase().replace(/[^A-Z0-9Ñ]/g, "")
        input.classList.remove("wrong")
        if (input.value.length < 3) return
        if (await check(input.value)) return
        void input.offsetWidth
        input.classList.add("wrong")
        wrong()
        input.value = ""
    }
    return input
}

// Stage 6: the password. On the own route, the player's real one. On another's, the input is
// there all the same, and so is the way on without it.
mem.buildPassword = (solved) => {
    const done = () => { if (!mem.busy) { mem.busy = true; mem.clearStage().finally(() => mem.busy = false) } }
    const real = mem.routePlayer?.password || ""
    const input = passwordInput(async (value) => {
        if (value !== real) return false
        input.disabled = true
        done()
        return true
    }, solved ? real : "")
    mem.screen.append(input)
    if (mem.ownRoute()) return
    const note = mem.el("p", "route-note", "Completaste la ruta de caja alternativa. Podés continuar.")
    const go = mem.el("button", "route-button", "Continuar")
    go.type = "button"
    go.onclick = done
    mem.screen.append(note, go)
}

// What every routes screen starts with: no stage dots, no hint
function clearScreen(stage) {
    mem.root.dataset.stage = stage
    mem.screen.replaceChildren()
    mem.dots.replaceChildren()
    setCategory(mem.badge, "teams")
    mem.hint?.remove()
    mem.hint = null
}

const check = `<svg viewBox="0 0 24 24" class="route-check"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`

// The routes: the own one first, then every other started, each going on where it was left
mem.showRoutes = () => {
    clearScreen("routes")
    const list = mem.el("div", "route-list")
    const row = (name, steps) => {
        const button = mem.el("button", "route-option")
        button.type = "button"
        button.append(mem.el("span", "route-name", name))
        if (steps >= mem.stages.length) button.insertAdjacentHTML("beforeend", check)
        else button.append(mem.el("span", "route-step", `Paso ${steps + 1}/${mem.stages.length}`))
        button.onclick = () => openRoute(name)
        return button
    }
    list.append(row(mem.player, mem.party.stepsSolved(mem.id)))
    for (const [name, steps] of Object.entries(mem.routes())) list.append(row(name, steps))
    const add = mem.el("button", "route-button", "Nueva ruta")
    add.type = "button"
    add.onclick = () => mem.showNewRoute()
    mem.screen.append(mem.el("p", "route-title", "¿Qué ruta querés hacer?"), list, add)
    mem.tellStory()
}

function openRoute(name) {
    mem.setRoute(name)
    mem.showStage(Math.min(mem.routeSteps(), mem.stages.length - 1))
}

// Another player's route: their password, real or fake, as long as it isn't the player's own
mem.showNewRoute = () => {
    clearScreen("new-route")
    const input = passwordInput(async (value) => {
        const other = mem.party.players.find(p => (p.password === value || p.fake === value) && p.name !== mem.player)
        if (!other) return false
        if (!(other.name in mem.routes())) await mem.party.setFlag(mem.id, "routes", { ...mem.routes(), [other.name]: 0 })
        openRoute(other.name)
        return true
    })
    const back = mem.el("button", "route-back", "Volver")
    back.type = "button"
    back.onclick = () => mem.showRoutes()
    mem.screen.append(mem.el("p", "route-title", "Contraseña de la ruta"), input, back)
    input.focus()
}
