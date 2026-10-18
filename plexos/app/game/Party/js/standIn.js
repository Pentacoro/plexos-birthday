import plexos from "/boot/plexos.js"
import {getTask} from "/plexos/lib/functions/dll.js"
import {themeConstruct} from "/plexos/lib/functions/theme.js"
import {puzzles, shortcutById} from "/plexos/app/game/Party/puzzles.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Opening an app takes a moment on a phone: its launcher, then its page, come over the network.
// From the tap, a window stands in for it with the app's own title bar, white, or dark for the
// game's apps, until the real window is up (a new one, or a hidden one shown again). Its X
// takes it away, and it gives up by itself if nothing comes.
const layer = document.getElementById("windowLayer")
let current = null

function remove() {
    if (!current) return
    current.watch.disconnect()
    clearTimeout(current.timer)
    current.node.remove()
    current = null
}

function show({ name, icon, dark }) {
    remove()
    const win = {
        task: "stand-in", wid: "", _windowIndex: "stand-in", name, icon,
        keyNodes: { dragElements: [], buttons: {} },
        appParams: { buttons: [], minimizeable: false, maximizeable: false, resizeable: false },
    }
    themeConstruct("window", win)
    const node = win.node
    // Window Manager reads a stacking number from every window's id: this one's is past any it moves
    node.id = "window_100000"
    node.classList.remove("building")
    node.classList.add("party-stand-in")
    if (dark) node.classList.add("party-app")
    node.style.zIndex = 1
    // drawn as the real one will be: filling the desktop, maximized
    const desk = document.getElementById("desktopLayer")
    const inner = win.keyNodes.innerDrawing
    node.style.left = desk.offsetLeft - inner.offsetLeft + "px"
    node.style.top = desk.offsetTop - inner.offsetTop + "px"
    node.style.width = desk.offsetWidth - inner.offsetWidth + node.offsetWidth + "px"
    node.style.height = desk.offsetHeight - inner.offsetHeight + node.offsetHeight + "px"
    win.keyNodes.buttons.close.addEventListener("click", remove)
    // gone once a real window is up: a new one done building (it is added unseen first), or a
    // hidden one shown again. Restacking restyles every window, so only those hidden now count.
    const hidden = [...layer.children].filter(each => each.style.display === "none")
    const added = new Set()
    const watch = new MutationObserver(changes => {
        for (const change of changes) for (const each of change.addedNodes) if (each !== node && each.classList?.contains("window")) added.add(each)
        const up = [...added].some(each => each.isConnected && !each.classList.contains("building"))
            || hidden.some(each => each.isConnected && each.style.display !== "none")
        if (up) remove()
    })
    watch.observe(layer, { childList: true, attributes: true, attributeFilter: ["style", "class"], subtree: true })
    current = { node, watch, timer: setTimeout(remove, 15000) }
}

// What a file opens, if it opens a window: the game's shortcuts and kept things open its apps
// (Party's open.ls), folders Explorer, the rest whatever app their type has
const keptIn = { contact: "fibonacci", carta: "webdetective", maze: "labyrinth" }
mem.standInFor = (file) => {
    const exte = file.cfg.exte
    if (exte === "item" || (exte === "contact" && file.data === "0000000")) return
    const game = exte === "game" ? shortcutById(file.data) : keptIn[exte] ? puzzles.find(each => each.id === keptIn[exte]) : null
    if (game) return show({ name: game.name, icon: game.icon, dark: true })
    if (exte === "game") return
    const folder = file.cfg.class === "DirectoryFile"
    const launcher = folder ? plexos.Settings.apps.dir : plexos.Settings.apps[exte]
    if (!launcher) return
    const name = folder ? file.name : launcher.includes("/Notepad/") ? file.name + " - Notepad" : file.name
    show({ name, icon: file.cfg.icon?.getImage?.(), dark: launcher.startsWith("/plexos/app/game/") })
}
