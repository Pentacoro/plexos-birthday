import {getTask} from "/plexos/lib/functions/dll.js"
import {teams} from "/plexos/app/game/Party/teams.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A suit written as text, in a file's name, a window's title or anywhere else, shows in its team's
// color. Each one (with the U+FE0E that keeps it plain) gets a span of its own as it shows up.
// Text being typed into is left alone, so renaming edits the plain name.
const suitTeams = { "♠": "spades", "♥": "hearts", "♣": "clubs", "♦": "diamonds" }
const suitPattern = /[♠♥♣♦]︎?/g

function leftAlone(text) {
    const element = text.parentElement
    if (!element || element.classList.contains("suit-text")) return true
    return !!element.closest("script, style, title, textarea, input, [contenteditable='true']")
}

function colorText(text) {
    if (!/[♠♥♣♦]/.test(text.data) || leftAlone(text)) return
    const parts = document.createDocumentFragment()
    let last = 0
    for (const match of text.data.matchAll(suitPattern)) {
        if (match.index > last) parts.append(text.data.slice(last, match.index))
        const suit = document.createElement("span")
        suit.className = "suit-text"
        suit.style.color = teams[suitTeams[match[0][0]]].color
        suit.textContent = match[0]
        parts.append(suit)
        last = match.index + match[0].length
    }
    if (last < text.data.length) parts.append(text.data.slice(last))
    text.replaceWith(parts)
}

function colorTree(root) {
    if (root.nodeType === 3) return colorText(root)
    if (root.nodeType !== 1) return
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const found = []
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/[♠♥♣♦]/.test(node.data)) found.push(node)
    found.forEach(colorText)
}

const watch = new MutationObserver(changes => {
    for (const change of changes) {
        if (change.type === "characterData") colorText(change.target)
        // an edit just finished: what was typed is colored now
        else if (change.type === "attributes") colorTree(change.target)
        else for (const node of change.addedNodes) colorTree(node)
    }
})
watch.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["contenteditable"] })
colorTree(document.body)
mem.suitWatch = watch
