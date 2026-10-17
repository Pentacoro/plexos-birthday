import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Both pictures stay loaded on top of each other, so switching is a crossfade
mem.showView = (view) => {
    mem.view = view
    mem.root.dataset.view = view
    const next = mem.views[view]
    mem.switch.innerHTML = next.icon
    const label = document.createElement("span")
    label.textContent = next.button
    mem.switch.append(label)
}

mem.toggleView = () => mem.showView(mem.views[mem.view].next)
