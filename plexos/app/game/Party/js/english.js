import {getTask} from "/plexos/lib/functions/dll.js"
import {lang, t} from "/plexos/app/game/Party/lang.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// For a player who plays in English: the game's text is translated as it shows up, in its
// windows and its notices, labels and buttons alike (lang.js). Names stay as they are: window
// titles (each app's name), the desktop's icons, and Explorer and the other system windows,
// where everything shown is a file or a folder. What is typed out letter by letter (dialogue,
// letters) is translated before it starts (dialogue.js, paper.js).
const attributes = ["aria-label", "placeholder", "title"]

function leftAlone(node) {
    const element = node.nodeType === 1 ? node : node.parentElement
    if (!element) return true
    if (element.closest("#desktopLayer, .header, .dialogue-text")) return true
    const win = element.closest(".window")
    return !!win && !win.classList.contains("party-app")
}

function translateText(node) {
    if (leftAlone(node)) return
    const english = t(node.data)
    if (english !== node.data) node.data = english
}

function translateTree(root) {
    if (root.nodeType === 3) return translateText(root)
    if (root.nodeType !== 1 || leftAlone(root)) return
    for (const element of [root, ...root.querySelectorAll("*")]) {
        for (const name of attributes) {
            const value = element.getAttribute(name)
            if (value) { const english = t(value); if (english !== value) element.setAttribute(name, english) }
        }
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) translateText(node)
}

if (lang.current === "en") {
    const watch = new MutationObserver(changes => {
        for (const change of changes) {
            if (change.type === "characterData") translateText(change.target)
            else if (change.type === "attributes") translateTree(change.target)
            else for (const node of change.addedNodes) translateTree(node)
        }
    })
    watch.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: attributes })
    translateTree(document.body)
    mem.englishWatch = watch
}
