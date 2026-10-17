// The phone's back button steps back through the game: each screen that opens adds a
// browser history entry with what undoing it means. Pressing back runs the newest one.
// Past the last entry the page stays put, so nobody leaves the game by accident.
const stack = []
let silent = 0
let started = false

export function startBackStack() {
    if (started) return
    started = true
    history.pushState({ plexosBack: "guard" }, "")
    window.addEventListener("popstate", () => {
        // a step we took back ourselves, for a screen that closed on its own
        if (silent > 0) return silent--
        const entry = stack.pop()
        if (!entry) return history.pushState({ plexosBack: "guard" }, "")
        // a screen that closed while another was above it: skip on to the next one
        if (entry.dead) return history.back()
        entry.onBack()
    })
}

// Returns the entry, to hand to leave() if the screen closes some other way
export function pushBack(onBack) {
    const entry = { onBack, dead: false }
    stack.push(entry)
    history.pushState({ plexosBack: stack.length }, "")
    return entry
}

// A screen closed without the back button: its history entry goes too
export function leave(entry) {
    if (!entry || entry.dead || !stack.includes(entry)) return
    if (stack.at(-1) === entry) {
        stack.pop()
        silent++
        history.back()
    } else {
        entry.dead = true
    }
}

// A window hidden while screens inside it were open: their entries are set aside, so back
// does not run them from the desktop. Their places in history are skipped from then on.
export function suspendAbove(entry) {
    const at = stack.indexOf(entry)
    if (at < 0) return []
    const above = []
    for (let i = at + 1; i < stack.length; i++) {
        if (stack[i].dead) continue
        above.push(stack[i])
        stack[i] = { dead: true }
    }
    return above
}

// The window back: the screens set aside go back above it, in their order
export function resume(entries) {
    for (const entry of entries) {
        stack.push(entry)
        history.pushState({ plexosBack: stack.length }, "")
    }
}

// The screen changed in place: back now undoes the new one
export function replaceBack(entry, onBack) {
    if (entry) entry.onBack = onBack
    return entry
}
