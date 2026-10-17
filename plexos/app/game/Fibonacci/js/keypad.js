import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The code is typed on a plain number pad: 1 to 9, then 0 alone under the 8.
// Only one of the dial and the pad shows at a time, by mode.
mem.keypad = mem.root.querySelector(".keypad")
for (const digit of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
    const key = document.createElement("button")
    key.type = "button"
    key.textContent = digit
    key.dataset.digit = digit
    mem.keypad.append(key)
}
