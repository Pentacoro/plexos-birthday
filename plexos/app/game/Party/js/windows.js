import plexos from "/boot/plexos.js"
import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import Task from "/plexos/lib/classes/system/task.js"
import Window from "/plexos/lib/classes/interface/window.js"
import {reopen} from "/plexos/app/game/Party/puzzleWindow.js"
import {pushBack, leave} from "/plexos/app/game/Party/backStack.js"
import {t} from "/plexos/app/game/Party/lang.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// On a phone every window is a full screen app: it fills the screen, closing only hides it, and
// back steps through what is open. The puzzles set this up themselves. Explorer and Notepad get
// it as soon as their page has loaded, except that they really close, by their X or by back.
// Popups and dialogs stay as they are. Explorer keeps its address bar but no side panel, menubar or context
// menu, and only ever shows Inventario: at the root, the rest of the core is not drawn, and
// anywhere else leads back to Inventario. Its views are drawn bigger, for fingers.
const closing = ["Explorer", "Notepad"]

// A file's name as the player sees it: without its extension. A folder keeps its whole name,
// since a dot in it is not an extension.
function showName(icon) {
    if (!icon.keyNodes?.text) return
    icon.keyNodes.text.textContent = icon.class === "DirectoryFile" ? icon.name : icon.name.replace(/\.[^.]+$/, "") || icon.name
}

function closeOnBack(owner) {
    owner.partyWindow = true
    const entry = pushBack(() => owner.end())
    const own = owner.onEnd
    owner.onEnd = async (...args) => {
        const kept = await own?.(...args)
        if (kept !== false) leave(entry)
        return kept
    }
}

mem.phoneWindow = (win) => {
    const owner = Task.id(win?.task)
    if (!owner || owner.window !== win || owner.partyWindow) return
    // popups and dialogs keep their own size, kept inside the screen; only the apps a player opens
    // become phone apps
    if (!closing.includes(owner.name)) return contain(win)
    closeOnBack(owner)
    if (!win.drawParams.maximized) Window.maximize(win)
    for (const button of [win.keyNodes.buttons.minimize, win.keyNodes.buttons.maximize]) if (button) button.style.display = "none"
    if (owner.name !== "Explorer") return
    const ui = owner.mem.ui
    for (const node of [ui?.side?.node, ui?.menubarMount]) if (node) node.style.display = "none"
    win.node.classList.add("party-explorer")
    ensureStyle()
    const inventory = "@/Inventario"
    const inside = (path) => path === "@" || path === inventory || path.startsWith(inventory + "/")
    const create = owner.mem.createExplorerIcons
    // at the root only Inventario shows, and the tools kept there (the Entrenador, the Descifrador)
    owner.mem.createExplorerIcons = (files) => create.call(owner.mem, files.filter(file => File.dirname(file.cfg.path) !== "@" || file.cfg.path === inventory || file.cfg.exte === "game"))
        .then(() => { for (const icon of owner.mem.iconArray) showName(icon); owner.mem.applySort() })
    // names without their extension, as on the desktop, also when an icon is drawn again
    const IconDir = owner.mem.class?.IconDir
    if (IconDir && !IconDir.partyNames) {
        const render = IconDir.prototype.render
        IconDir.prototype.render = function () { render.call(this); showName(this) }
        IconDir.partyNames = true
    }
    // unless a column was picked to sort by, what the game keeps shows in the game's order
    const sort = owner.mem.applySort
    owner.mem.applySort = () => {
        sort.call(owner.mem)
        const address = String(owner.mem.address)
        if (owner.mem.sort || (address !== inventory && !address.startsWith(inventory + "/"))) return
        const list = owner.mem.ui.view.keyNodes.list
        const ranked = owner.mem.iconArray.map(icon => ({ icon, rank: File.at(icon.file) ? mem.inventoryRank(File.at(icon.file)) : 1e9 }))
        ranked.sort((a, b) => a.rank - b.rank)
        owner.mem.iconArray = ranked.map(each => each.icon)
        for (const { icon } of ranked) list.appendChild(icon.node)
    }
    const navigate = owner.mem.navigate
    owner.mem.navigate = (path) => navigate.call(owner.mem, inside(path) ? path : inventory)
    // Some folders show only two columns in details: the name, and the line each file carries in
    // place of its type (cfg.detail). Códigos shows what each code says; Inventario when each
    // folder last got a file.
    const twoColumns = { "@/Inventario": "Última Act.", "@/Inventario/Códigos": "Contenido" }
    const load = owner.mem.loadFolderView
    owner.mem.loadFolderView = (path) => {
        load.call(owner.mem, path)
        const second = twoColumns[path]
        win.node.classList.toggle("party-two-columns", !!second)
        if (!second) return
        win.node.querySelector(".detailsColumn.name").firstChild.textContent = t("Nombre")
        win.node.querySelector(".detailsColumn.type").firstChild.textContent = t(second)
    }
    // where it was opened, if that is anywhere else
    if (!inside(owner.mem.address ?? owner.mem.arg?.address ?? inventory)) owner.mem.navigate(inventory)
    // one tap opens, as on a phone; a tap that turned into a drag doesn't, and neither does the
    // second tap of a double tap, which would open it twice or open what lands under the finger
    let down = null, opened = 0
    win.node.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY } }, true)
    win.node.addEventListener("click", e => {
        const node = e.target.closest(".explorerIcon")
        const icon = node && owner.mem.iconArray?.find(each => each.node === node)
        const moved = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10
        if (!icon || moved) return
        e.stopPropagation()
        if (performance.now() - opened < 500) return
        opened = performance.now()
        icon.open()
    }, true)
    // a finger on empty space draws the select box, as the mouse does: Explorer only listens to
    // the mouse, which a phone never sends while a finger moves, so the touch is passed on as one
    // When the folder holds more than fits, a finger scrolls it instead, and there is no box.
    const area = owner.mem.ui.view.node
    const overflows = () => area.scrollHeight > area.clientHeight + 1
    area.addEventListener("pointerdown", e => {
        if (e.pointerType !== "touch" || e.target.closest(".explorerIcon")) return
        area.style.touchAction = overflows() ? "pan-y" : "none"
        if (overflows()) return
        const mouse = (type, ev, target = document) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: ev.clientX, clientY: ev.clientY, button: 0 }))
        mouse("mousedown", e, e.target)
        const move = ev => mouse("mousemove", ev)
        const up = ev => {
            mouse("mouseup", ev)
            document.removeEventListener("pointermove", move)
            document.removeEventListener("pointerup", up)
            document.removeEventListener("pointercancel", up)
        }
        document.addEventListener("pointermove", move)
        document.addEventListener("pointerup", up)
        document.addEventListener("pointercancel", up)
    })
    const fit = () => { area.style.touchAction = overflows() ? "pan-y" : "none" }
    new ResizeObserver(fit).observe(area)
    new MutationObserver(fit).observe(area, { childList: true, subtree: true })
    win.node.addEventListener("dblclick", e => {
        e.preventDefault()
        e.stopImmediatePropagation()
    }, true)
    win.node.addEventListener("contextmenu", e => {
        e.preventDefault()
        e.stopImmediatePropagation()
    }, true)
}

// Explorer and Notepad open maximized from the first frame: that is what this player has saved
// for them (Window Manager reads it), rather than being maximized once already drawn small
function openMaximized() {
    const data = plexos.Core.registry?.appFile()?.data
    const user = plexos.System.user?.name || "User"
    for (const entry of [data?.SYSTEM?.Explorer, data?.STANDALONE?.Notepad]) {
        if (entry) entry[user].windowDrawParameters.maximized = true
    }
}
openMaximized()

// Every Explorer view a size bigger, the text with it
const style = `
.window.party-app .windowInner, .window.party-app .content { background: #1b1b20; }
.window.party-contained { max-width: calc(100vw - 6px); }
.window.party-contained .transfer { width: min(440px, calc(100vw - 20px)) !important; min-width: 0; }
.window.party-explorer .background { font-size: 15px; }
.window.party-explorer .explorerIcon > .iconSize, .window.party-explorer .detailsColumn.size { display: none !important; }
.window.party-explorer .background.view-icons > .list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); width: 100%; min-width: 0; place-items: center; gap: 0; height: 100%; box-sizing: border-box; }
.window.party-explorer .background.view-icons .list > .explorerIcon { width: 80%; height: 80%; font-size: 17px; }
.window.party-explorer .background.view-icons .explorerIcon > .iconFrame { padding: 6%; box-sizing: border-box; }
.window.party-explorer .background.view-icons .explorerIcon > .iconFrame > .iconSquare,
.window.party-explorer .background.view-icons .iconSquare > .iconArt { width: 100% !important; height: 100% !important; }
.window.party-explorer .iconSticker > img { width: 100%; height: 100%; transform: translate(18%, 18%) scale(1.3); }
.window.party-two-columns .background { --details-columns: 56px minmax(0, 1fr) 7.2em !important; }
.window.party-two-columns .background.view-details > .detailsHeader,
.window.party-two-columns .background.view-details > .list { min-width: 0 !important; width: 100% !important; max-width: 100%; padding: 0 6px; box-sizing: border-box; }
.window.party-two-columns .background.view-details .explorerIcon > .explorerIconText { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.window.party-two-columns .background.view-details .list > .explorerIcon { height: 58px !important; }
.window.party-two-columns .background.view-details .explorerIcon > .iconFrame { width: 50px !important; height: 50px !important; }
.window.party-two-columns .detailsColumn.date, .window.party-two-columns .detailsColumn.size,
.window.party-two-columns .explorerIcon > .iconDate, .window.party-two-columns .explorerIcon > .iconSize { display: none !important; }
.window.party-explorer .background.view-list > .list { grid-template-rows: repeat(auto-fill, 38px); grid-auto-columns: 300px; }
.window.party-explorer .background.view-list .list > .explorerIcon { height: 38px; }
.window.party-explorer .background.view-list .explorerIcon > .iconFrame { width: 30px; height: 30px; }
.window.party-explorer .background.view-details > .detailsHeader { height: 32px; }
.window.party-explorer .background.view-details .list > .explorerIcon { height: 36px; }
.window.party-explorer .background.view-details .explorerIcon > .iconFrame { width: 28px; height: 28px; }
.window.party-explorer .background.view-tiles > .list { grid-template-columns: 1fr; grid-auto-rows: 84px; }
.window.party-explorer .background.view-tiles .list > .explorerIcon { grid-template-columns: 72px minmax(0, 1fr); }
.window.party-explorer .background.view-tiles .explorerIcon > .iconFrame { width: 68px; height: 68px; }`

// A popup or dialog no wider than the screen less 3px each side, and placed inside it
function contain(win) {
    win.node.classList.add("party-contained")
    requestAnimationFrame(() => {
        const box = win.node.getBoundingClientRect()
        const x = Math.max(3, Math.min(box.left, innerWidth - 3 - box.width))
        if (x === box.left || !win.drawParams) return
        win.drawParams.posX = x
        win.poseNode()
    })
}

function ensureStyle() {
    if (document.getElementById("party-explorer-style")) return
    const node = document.createElement("style")
    node.id = "party-explorer-style"
    node.textContent = style
    document.head.append(node)
}

ensureStyle()
task.cmd("event.on", { eventName: "window-scripted", callback: mem.phoneWindow, priority: 1 })

// Opening something already open, shown or hidden, brings that window back as it was instead of
// a second one: a folder in the Explorer already open (moving it there), a file in the app that
// has it
File.reuse = (path) => {
    const file = File.at(path)
    if (!file) return false
    // an item is only proof of what was given: opening it does nothing, and leaves Explorer open
    if (file.cfg.exte === "item") return true
    // a file drawn as a folder (Inventario on the desktop) opens the folder it points to
    if (file.cfg.exte === "dir" && file.cfg.class !== "DirectoryFile") {
        File.open(file.data)
        return true
    }
    // a file opened from Explorer brings up another app, and Explorer closes behind it, except
    // for Notepad, which closes back onto the folder it was opened from
    const opener = Task.System()?.mem.focused
    const inNotepad = plexos.Settings.apps[file.cfg.exte]?.includes("/Notepad/")
    if (opener?.name === "Explorer" && file.cfg.class !== "DirectoryFile" && !inNotepad) setTimeout(() => opener.end())
    const open = plexos.Tasks.filter(each => each.partyWindow && each.window?.node?.isConnected)
    if (file.cfg.class === "DirectoryFile") {
        const explorer = open.find(each => each.name === "Explorer" && !each.mem.arg?.mode)
        if (!explorer) return mem.standInFor(file), false
        if (explorer.mem.address !== path) explorer.mem.navigate(path)
        reopen(explorer)
        return true
    }
    const holder = open.find(each => each.mem.arg?.fileAddr === path || each.mem.arg?.path === path)
    // not open: the app starts, with a window standing in until its own is up (standIn.js)
    if (!holder) return mem.standInFor(file), false
    reopen(holder)
    return true
}
