import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A code typed into dashes. It is checked once every dash is filled: wrong clears it after the
// bar blips red, right locks it while the bar blips white and the stage is cleared.
mem.entryField = (length, answer) => {
    const node = mem.el("div", "slots")
    const slots = Array.from({ length }, () => node.appendChild(mem.el("span")))
    const field = { node, value: "", locked: false }
    const render = () => slots.forEach((slot, i) => slot.textContent = field.value[i] || "")
    field.solve = () => {
        field.value = answer
        field.locked = true
        render()
    }
    field.type = async (char) => {
        if (field.locked || mem.busy || field.value.length >= length) return
        field.value += char
        render()
        if (field.value.length < length) return
        mem.busy = true
        if (field.value === answer) {
            field.locked = true
            await mem.clearStage()
        } else {
            node.classList.remove("wrong")
            void node.offsetWidth
            node.classList.add("wrong")
            await mem.lightFail()
            field.value = ""
            render()
        }
        mem.busy = false
    }
    return field
}

// The number pad: 1 to 9, then 0 alone under the 8
mem.keypad = (field) => {
    const pad = mem.el("div", "keypad")
    for (const digit of "1234567890") {
        const key = mem.el("button", "", digit)
        key.type = "button"
        key.dataset.key = digit
        pad.append(key)
    }
    mem.pressKeys(pad, key => field.type(key.dataset.key))
    return pad
}

// Keys act on touch down, once per finger, and show they were pressed
mem.pressKeys = (container, action) => {
    container.addEventListener("pointerdown", e => {
        const key = e.target.closest("[data-key]")
        if (!key || !container.contains(key)) return
        e.preventDefault()
        key.classList.add("pressed")
        action(key)
    })
    for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
        container.addEventListener(type, () => {
            for (const key of container.querySelectorAll(".pressed")) key.classList.remove("pressed")
        })
    }
}
