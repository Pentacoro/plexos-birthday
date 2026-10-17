import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The dial follows one finger from the hole it starts in until it lets go
mem.rotary.addEventListener("pointerdown", e => {
    if (!mem.dialGrab(e)) return
    e.preventDefault()
    mem.rotary.setPointerCapture(e.pointerId)
})
mem.rotary.addEventListener("pointermove", e => mem.dialMove(e))
mem.rotary.addEventListener("pointerup", () => mem.dialRelease())
mem.rotary.addEventListener("pointercancel", () => mem.dialRelease())

// Keys type on touch down, once per finger. Clicks are ignored: a phone can send an
// extra one on a quick second tap, which typed the digit twice.
mem.keypad.addEventListener("pointerdown", e => {
    const key = e.target.closest("button[data-digit]")
    if (!key) return
    e.preventDefault()
    key.classList.add("pressed")
    mem.sound.key(key.dataset.digit)
    mem.press(key.dataset.digit)
})
for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
    mem.keypad.addEventListener(type, () => {
        for (const key of mem.keypad.querySelectorAll(".pressed")) key.classList.remove("pressed")
    })
}

mem.contactButton.addEventListener("pointerdown", e => {
    e.preventDefault()
    mem.openContacts()
})
mem.contactBackdrop.addEventListener("pointerdown", e => {
    e.preventDefault()
    mem.closeContacts()
})
mem.contactList.addEventListener("pointerdown", e => {
    const contact = e.target.closest(".contact")
    if (!contact) return
    e.preventDefault()
    mem.dialContact(contact.dataset.number)
})

task.node.addEventListener("keydown", e => {
    if (/^[0-9]$/.test(e.key)) mem.press(e.key)
})
