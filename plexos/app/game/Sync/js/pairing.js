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
        option.append(mem.el("span", "", team.name))
        if (done(key)) option.insertAdjacentHTML("beforeend", check)
        return option
    })
    choose("¿Con qué equipo te emparejás?", options, async (partner) => {
        if (partner !== mem.team || pairState(mem.party, partner).role) return startWith(partner)
        mem.showRoles()
    })
}

// Each role's icon, drawn in white like the suits: a keyboard for the Tecleador, a face
// thinking with its hand on its chin for the Pensador
const roleIcons = {
    tecleador: `<svg viewBox="0 0 48 48" class="role-icon" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="13" width="40" height="24" rx="4"/><path d="M11 20h2M17.5 20h2M24 20h2M30.5 20h2M37 20h0M11 25.5h0M15 25.5h2M21.5 25.5h2M28 25.5h2M34.5 25.5h2.5M15 31h18"/></svg>`,
    pensador: `<svg viewBox="0 0 48 48" class="role-icon" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="25" cy="21" r="16"/><path d="M27.5 12.5q3.5-2.5 7 0"/><path d="M15.5 15.5h5"/><circle cx="18" cy="20" r="1.6" fill="currentColor"/><circle cx="31" cy="19" r="1.6" fill="currentColor"/><path d="M21 29.5l7-1"/><path d="M8 46l4.5-8.5q1.5-3 5-2.6l9 1.2q2.4.4 2 2.6t-2.8 1.8l-6.2-.6"/></svg>`,
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
        option.innerHTML = roleIcons[key]
        option.append(mem.el("span", "", name), mem.el("small", "", about))
        return option
    })
    choose("Elijan uno cada uno", roles, async (role) => {
        await setPairState(mem.party, mem.team, { role })
        await startWith(mem.team)
    })
    // the two side by side
    mem.screen.querySelector(".pair-list").classList.add("pair-roles")
}
