import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Each view names the one the button switches to, drawn with that view's icon
mem.views = {
    legend: {
        next: "picture",
        button: "Foto",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg>`,
    },
    picture: {
        next: "legend",
        button: "Leyenda",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="7" r="1.6" fill="currentColor"/><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="5" cy="17" r="1.6" fill="currentColor"/><path d="M10 7h10M10 12h10M10 17h10"/></svg>`,
    },
}
mem.view = "legend"

mem.root   = task.node.querySelector(".map")
mem.switch = mem.root.querySelector(".map-switch")
