import {getTask} from "/plexos/lib/functions/dll.js"
import {wrong} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.renderSlots = () => {
    mem.digitSlots.forEach((slot, i) => slot.textContent = mem.entry[i] || "")
    mem.guide?.()
}

mem.clearEntry = () => {
    mem.entry = ""
    mem.renderSlots()
}

// Whatever is being entered is sent as soon as it is complete. If it leads nowhere,
// the slots shake and clear.
mem.press = async (digit) => {
    if (mem.mode !== "dial" && mem.mode !== "code") return
    if (mem.entry.length >= mem.entryLength) return
    mem.slots.classList.remove("wrong")
    mem.entry += digit
    mem.renderSlots()
    if (mem.entry.length < mem.entryLength) return
    const accepted = mem.mode === "dial" ? await mem.dial(mem.entry) : await mem.submitCode(mem.entry)
    if (accepted) return
    void mem.slots.offsetWidth
    mem.slots.classList.add("wrong")
    wrong()
    setTimeout(mem.clearEntry, 350)
}
