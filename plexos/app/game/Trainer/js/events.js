import {getTask} from "/plexos/lib/functions/dll.js"
import {clockOffset} from "/plexos/app/game/Party/puzzles.js"

let task = getTask(/TASKID/)
let mem  = task.mem

const actions = {
    // the clock moves, and what it opens or closes shows on the desktop at once
    clock: async ({ by }) => {
        if (by === "null") mem.store("party-clock", null)
        else if (by === "party") mem.store("party-clock", String(mem.partyTime() - Date.now()))
        else mem.store("party-clock", String(clockOffset() + Number(by) * 60000))
        await mem.party.applySchedule()
    },
    mode: async ({ value }) => {
        mem.store("party-unlock-all", value === "null" ? null : value)
        await mem.party.applySchedule()
    },
    team: ({ team }) => mem.party.setTeam(team),
    reset: ({ id }) => mem.party.resetPuzzle(id),
    "reset-all": () => mem.party.resetAll(),
}

mem.root.addEventListener("pointerdown", async e => {
    const node = e.target.closest("button[data-action]")
    if (!node || mem.busy) return
    e.preventDefault()
    mem.busy = true
    node.classList.add("pressed")
    await actions[node.dataset.action]?.(node.dataset)
    node.classList.remove("pressed")
    mem.busy = false
    mem.render()
})
