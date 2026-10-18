import File from "/plexos/lib/classes/filesystem/file.js"
import {notice as chime} from "./sound.js"

// A notice that slides up from the bottom of the screen when something is kept for later: a
// contact, a letter, a maze, a code. Above every window, in the theme's color; one at a time,
// the rest waiting. Tapping it opens the folder where the thing was kept; its X just closes it.
const queue = []
let current = null

const style = `
.party-notice {
    position: fixed;
    left: 50%;
    bottom: max(20px, env(safe-area-inset-bottom));
    z-index: 100000;
    width: min(calc(100vw - 32px), 360px);
    box-sizing: border-box;
    padding: 10px 8px 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 14px;
    background: var(--color-accent, #608BA9);
    color: #fff;
    font: 600 16px system-ui, sans-serif;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);
    transform: translate(-50%, calc(100% + 40px));
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.3, 1);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
}
.party-notice.shown {
    transform: translate(-50%, 0);
}
.party-notice > svg {
    flex: none;
    width: 30px;
    height: 30px;
}
.party-notice-text {
    flex: 1;
    min-width: 0;
}
.party-notice-close {
    flex: none;
    width: 36px;
    height: 36px;
    padding: 9px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #fff;
}
.party-notice-close svg {
    width: 100%;
    height: 100%;
    display: block;
}`

// A folder in white, its tab and front cut apart by a gap of the background, as Plexos draws them
const folder = `<svg viewBox="0 0 24 24"><path fill="#fff" fill-rule="evenodd" d="M2.5 6.5A1.5 1.5 0 0 1 4 5h5l2 2h9a1.5 1.5 0 0 1 1.5 1.5V9H2.5zM2.5 10.5h19v8A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5z"/></svg>`
const cross = `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`

function ensureStyle() {
    if (document.getElementById("party-notice-style")) return
    const node = document.createElement("style")
    node.id = "party-notice-style"
    node.textContent = style
    document.head.append(node)
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function notify(text, path) {
    queue.push({ text, path })
    if (!current) next()
}

function next() {
    const item = queue.shift()
    if (!item) return current = null
    ensureStyle()
    const notice = document.createElement("div")
    notice.className = "party-notice"
    notice.innerHTML = folder
    const label = document.createElement("span")
    label.className = "party-notice-text"
    label.textContent = item.text
    const close = document.createElement("button")
    close.type = "button"
    close.className = "party-notice-close"
    close.setAttribute("aria-label", "Cerrar")
    close.innerHTML = cross
    notice.append(label, close)
    document.body.append(notice)
    void notice.offsetWidth
    notice.classList.add("shown")
    chime()
    let gone = false
    const dismiss = async () => {
        if (gone) return
        gone = true
        clearTimeout(timer)
        notice.classList.remove("shown")
        await wait(400)
        notice.remove()
        next()
    }
    const timer = setTimeout(dismiss, 4000)
    current = notice
    close.addEventListener("pointerdown", e => {
        e.preventDefault()
        e.stopPropagation()
        dismiss()
    })
    notice.addEventListener("pointerdown", e => {
        e.preventDefault()
        if (item.path && File.at(item.path)) File.open(item.path)
        dismiss()
    })
}
