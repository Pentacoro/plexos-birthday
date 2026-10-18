import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The nine symbols on the first stage's pad, drawn as paths so phones never swap them for emoji
mem.symbols = [
    "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
    "M15 3a9 9 0 1 0 6 15.5A8 8 0 0 1 15 3z",
    "M13 2 5 14h6l-1 8 8-12h-6z",
    "M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z",
    "M12 4l9 16H3z",
    "M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z",
    "M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16zm0 4a4 4 0 1 1 0 8 4 4 0 1 1 0-8z",
    "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    "M12 2l8.7 5v10L12 22l-8.7-5V7z",
]

mem.symbolSvg = (index) => `<svg viewBox="0 0 24 24"><path d="${mem.symbols[index]}" fill="currentColor" fill-rule="evenodd"/></svg>`
