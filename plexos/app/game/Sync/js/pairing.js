import {getTask} from "/plexos/lib/functions/dll.js"
import {pairState, setPairState} from "/plexos/app/game/Sync/pairs.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The team to play with: picked, then confirmed. Teams already played to the end show a check
// and can be visited again. The own team only shows once the other three are done; then the two
// players of it pick opposite roles, the Tecleador (who types the right inputs first) and the
// Pensador.
const check = `<svg viewBox="0 0 24 24" class="pair-done"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`

function choose(title, options, onConfirm) {
    mem.screen.replaceChildren()
    let chosen = null
    const list = mem.el("div", "pair-list")
    for (const option of options) list.append(option)
    const confirm = mem.el("button", "pair-confirm", "Emparejar")
    confirm.type = "button"
    confirm.disabled = true
    mem.pressKeys(list, option => {
        chosen = option.dataset.key
        for (const other of list.children) other.classList.toggle("chosen", other === option)
        confirm.disabled = false
    })
    confirm.addEventListener("pointerdown", async e => {
        e.preventDefault()
        if (!chosen || mem.busy) return
        mem.busy = true
        await onConfirm(chosen)
        mem.busy = false
    })
    mem.screen.append(mem.el("p", "pair-title", title), list, confirm)
}

async function startWith(partner) {
    await mem.party.setFlag(mem.id, "pair", partner)
    mem.pairWith(partner)
    mem.showStage(Math.min(mem.state().stage || 0, mem.stages.length - 1))
}

mem.showPairing = () => {
    mem.root.dataset.stage = "pairing"
    mem.root.classList.remove("finished")
    mem.next.hidden = true
    mem.lightSet()
    mem.setStageBadges(-1)
    const done = (team) => !!pairState(mem.party, team).done
    const others = Object.keys(mem.party.teams).filter(team => team !== mem.team)
    const shown = others.every(done) ? [...others, mem.team] : others
    const options = shown.map(key => {
        const team = mem.party.teams[key]
        const option = mem.el("button", "pair-team")
        option.type = "button"
        option.dataset.key = key
        option.style.setProperty("--team", team.color)
        option.innerHTML = `<svg viewBox="0 0 24 24"><path d="${team.path}" fill="currentColor"/></svg>`
        option.append(mem.el("span", "", key === mem.team ? team.name + " (tu equipo)" : team.name))
        if (done(key)) option.insertAdjacentHTML("beforeend", check)
        return option
    })
    choose("¿Con qué equipo te emparejás?", options, async (partner) => {
        if (partner !== mem.team || pairState(mem.party, partner).role) return startWith(partner)
        mem.showRoles()
    })
}

// With the own team: which of the two this player is
mem.showRoles = () => {
    const roles = [
        ["tecleador", "Tecleador", "Encuentra primero lo que hay que teclear"],
        ["pensador", "Pensador", "Le dice al otro qué buscar"],
    ].map(([key, name, about]) => {
        const option = mem.el("button", "pair-team pair-role")
        option.type = "button"
        option.dataset.key = key
        option.style.setProperty("--team", mem.party.teams[mem.team].color)
        option.append(mem.el("span", "", name), mem.el("small", "", about))
        return option
    })
    choose("Elijan uno cada uno", roles, async (role) => {
        await setPairState(mem.party, mem.team, { role })
        await startWith(mem.team)
    })
}
