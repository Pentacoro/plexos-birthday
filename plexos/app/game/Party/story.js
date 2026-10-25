import Task from "/plexos/lib/classes/system/task.js"
import {openCarousel} from "./photoViewer.js"
import {stories} from "./stories.js"
import {gameState} from "./completion.js"
import {puzzleById, isUnlocked} from "./puzzles.js"
import {t} from "./lang.js"

// Each game's texts (stories.js), full screen over it in the carousel the artifact photos use:
// the intro, then done and complete as the game gets there. Each comes by itself once, the
// first time it is due (tellStory, which every game calls whenever it is at rest: opened, a call
// over, a stage cleared). The story button between the badge and the hint brings back every one
// reached so far, side by side.
const party = () => Task.get("Party").mem
// the pages reached. The intro is the first screen of a game: for the phone, already while it is
// only a preview, since that is when it is first opened. Then a preview's text, once every
// team's preview is heard, and done and complete once the game is open for play and that far.
function reached(id) {
    if (!stories[id]) return []
    const puzzle = puzzleById(id)
    const open = isUnlocked(puzzle)
    const list = []
    if (open || puzzle?.preview) list.push("intro")
    if (stories[id].preview && (party().flag(id, "previewed") || []).length >= 4) list.push("preview")
    if (!open) return list
    const state = gameState(party(), id)[0]
    if (["done", "complete"].includes(state)) list.push("done")
    if (id === "artifacts" && ["done", "complete"].includes(state)) list.push("drawing")
    if (state === "complete") list.push("complete")
    return list
}

// Types a slide's text out as the dialogue boxes do (dialogue.js): letter by letter, a longer
// pause after "." and ",", in silence. A tap shows the rest at once. Its button
// shows once the text is all there. Following the text down while the reader hasn't scrolled up.
const speed = 30
function typer(node, text, button) {
    let shown = 0, timer = null, started = false, readyTimer = null
    const done = () => {
        clearTimeout(timer)
        clearTimeout(readyTimer)
        shown = text.length
        node.textContent = text
        button.classList.add("ready")
    }
    const type = () => {
        if (!node.isConnected) return
        if (shown >= text.length) return done()
        const slide = node.parentElement
        const following = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 24
        const letter = text.charAt(shown++)
        node.textContent += letter
        if (following) slide.scrollTop = slide.scrollHeight
        timer = setTimeout(type, (letter === "." || letter === ",") ? speed * 6 : speed)
    }
    // a tap anywhere on the slide skips to the whole text; a swipe or a scroll isn't a tap
    node.parentElement.addEventListener("click", () => { if (started && shown < text.length) done() })
    return {
        start() {
            if (started) return
            started = true
            // button appears after a short wait so the screen is never stuck
            readyTimer = setTimeout(() => button.classList.add("ready"), 1200)
            type()
        },
        // swiped away while typing: the rest is there to come back to
        finish() { if (started && shown < text.length) done() },
    }
}

function slide(task, id, page, closeViewer) {
    const story = stories[id]
    const node = document.createElement("div")
    node.className = "photo-slide story-slide"
    const button = document.createElement("button")
    button.type = "button"
    button.className = "story-continue"
    button.textContent = "Continuar"
    button.onclick = () => { closeViewer(); if (page !== "intro") task.end() }

    if (page === "drawing") {
        const name = party().player?.name || ""
        node.classList.add("drawing-slide")
        const img = document.createElement("img")
        img.className = "drawing-img"
        img.src = `/assets/Dibujos/${name}.png`
        img.alt = ""
        img.onerror = () => { img.hidden = true }
        img.addEventListener("pointerdown", (e) => {
            if (img.hidden) return
            e.stopPropagation()
            const overlay = document.createElement("div")
            overlay.className = "drawing-expand"
            const big = document.createElement("img")
            big.src = img.src
            big.alt = ""
            big.className = "drawing-expand-img"
            const x = document.createElement("button")
            x.type = "button"
            x.className = "drawing-expand-close"
            x.setAttribute("aria-label", "Cerrar")
            x.textContent = "×"
            x.addEventListener("pointerdown", (ev) => { ev.stopPropagation(); overlay.remove() })
            overlay.append(big, x)
            node.closest(".story-viewer")?.append(overlay)
        })
        const msg = document.createElement("div")
        msg.className = "drawing-msg"
        msg.textContent = `¡Gracias por jugar, ${name}!`
        button.classList.add("ready")
        node.append(img, msg, button)
        node.typer = { start() {}, finish() {} }
        return node
    }

    button.textContent = page === "intro" ? story.button : "Continuar"
    const icon = document.createElement("img")
    icon.className = "story-icon"
    icon.src = puzzleById(id)?.icon || ""
    icon.alt = ""
    const text = document.createElement("div")
    text.className = "story-text"
    // the intro opens the game; the others are an ending, and go back to the desktop
    node.append(icon, text, button)
    node.typer = typer(text, t(story[page]), button)
    return node
}

function open(task, id, shown, start, closable) {
    const host = task.node.querySelector(".puzzle")?.closest(".content") || task.node
    if (host.querySelector(":scope > .story-viewer")) return
    let carousel = null
    const slides = shown.map(page => slide(task, id, page, () => carousel?.close()))
    const onShow = (index) => slides.forEach((each, i) => i === index ? each.typer.start() : each.typer.finish())
    carousel = openCarousel(slides, host, { start, closable, className: "story-viewer", onShow })
    // non-intro slides that aren't the last one advance to the next instead of closing
    slides.forEach((s, i) => {
        if (i === slides.length - 1 || shown[i] === "intro") return
        const btn = s.querySelector(".story-continue")
        if (btn) btn.onclick = () => carousel.show(i + 1)
    })
}

// Shows what is due, if anything, starting at the first not seen yet. Returns whether it did.
// hold: pages a game shows itself, at a moment of its own (showStory), never by themselves.
export function tellStory(task, id, { hold = [] } = {}) {
    const all = reached(id)
    task.mem.storyButton?.toggleAttribute("hidden", !all.length)
    const seen = party().flag("story", id) || []
    const due = all.filter(page => !seen.includes(page) && !hold.includes(page))
    if (!due.length || task.node.querySelector(".story-viewer")) return false
    party().setFlag("story", id, [...seen, ...due])
    open(task, id, all, all.indexOf(due[0]), false)
    return true
}

export const storySeen = (id, page) => (party().flag("story", id) || []).includes(page)

// One page, now, at the game's own moment, with every page reached beside it
export function showStory(task, id, page) {
    const all = reached(id)
    if (!all.includes(page)) return false
    const seen = party().flag("story", id) || []
    if (!seen.includes(page)) party().setFlag("story", id, [...seen, page])
    open(task, id, all, all.indexOf(page), false)
    return true
}

// The button in the middle of the badge row, which brings the texts back
export function storyButton(task, id) {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "story-button"
    button.setAttribute("aria-label", "Textos")
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h11a2 2 0 0 1 2 2v1h-4M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7M7 4a2 2 0 0 1 2 2v12"/><path d="M11.5 9.5h3M11.5 12.5h3M11.5 15.5h3"/></svg>`
    button.hidden = !reached(id).length
    button.onclick = () => {
        const all = reached(id)
        if (all.length) open(task, id, all, all.length - 1, true)
    }
    task.mem.storyButton = button
    return button
}
