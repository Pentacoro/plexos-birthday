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
const pages = ["preview", "intro", "done", "complete"]

// the pages reached: a preview's, for a game that has one, once every team's preview is heard
// (Fibonacci's); the intro once the game is open for play, then however far it is
function reached(id) {
    if (!stories[id]) return []
    const previewed = !!stories[id].preview && (party().flag(id, "previewed") || []).length >= 4
    const before = previewed ? ["preview"] : []
    if (!isUnlocked(puzzleById(id))) return before
    const state = gameState(party(), id)[0]
    return [...before, ...pages.filter(page => page === "intro" || (page === "done" && ["done", "complete"].includes(state)) || (page === "complete" && state === "complete"))]
}

// Types a slide's text out as the dialogue boxes do (dialogue.js): letter by letter, a longer
// pause after "." and ",", in silence. A tap shows the rest at once. Its button
// shows once the text is all there. Following the text down while the reader hasn't scrolled up.
const speed = 30
function typer(node, text, button) {
    let shown = 0, timer = null, started = false
    const done = () => {
        clearTimeout(timer)
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
        start() { if (started) return; started = true; type() },
        // swiped away while typing: the rest is there to come back to
        finish() { if (started && shown < text.length) done() },
    }
}

function slide(task, id, page, closeViewer) {
    const story = stories[id]
    const node = document.createElement("div")
    node.className = "photo-slide story-slide"
    const text = document.createElement("div")
    text.className = "story-text"
    const button = document.createElement("button")
    button.type = "button"
    button.className = "story-continue"
    button.textContent = page === "intro" ? story.button : "Continuar"
    // the intro opens the game; the others are an ending, and go back to the desktop
    button.onclick = () => {
        closeViewer()
        if (page !== "intro") task.end()
    }
    node.append(text, button)
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
}

// Shows what is due, if anything, starting at the first not seen yet. Returns whether it did.
// hold: pages a game shows itself, at a moment of its own (showStory), never by themselves.
export function tellStory(task, id, { hold = [] } = {}) {
    const all = reached(id)
    task.mem.storyButton?.toggleAttribute("hidden", !all.length)
    const seen = party().flag("story", id) || []
    const due = all.filter(page => !seen.includes(page) && !hold.includes(page))
    if (!due.length) return false
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
