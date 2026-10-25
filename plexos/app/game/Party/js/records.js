import plexos from "/boot/plexos.js"
import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import Icon from "/plexos/lib/classes/interface/icon.js"
import {notify} from "/plexos/app/game/Party/notify.js"
import {codeRank} from "/plexos/app/game/Sync/pairs.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// What the game keeps for the player, as files in the folders of their Inventario: contacts dialed,
// letters received, mazes revealed, codes written down. Each one is made once, with a notice
// that opens its folder. Opening a file goes back to its puzzle (open.ls).
mem.records = {
    contacts: { folder: "@/Inventario/Contactos", exte: "contact", notice: "Añadido a Contactos", view: "tiles" },
    letters:  { folder: "@/Inventario/Cartas", exte: "carta", notice: "Carta Guardada", view: "tiles" },
    mazes:    { folder: "@/Inventario/Laberintos", exte: "maze", notice: "Laberinto Revelado", view: "icons", image: "/plexos/app/game/Labyrinth/icon.svg" },
    // what a team's Fibonacci character sends, kept in Inventario itself, after its folders
    items:    { folder: "@/Inventario", exte: "item", notice: "Objeto Recibido" },
    codes:    { folder: "@/Inventario/Códigos", exte: "txt", notice: "Código Anotado", view: "details", showData: true },
    drawing:  { folder: "@/Inventario", exte: "dibujo", notice: "Premio Desbloqueado" },
}

// Inventario sits at the root of the core, the one folder the player can see there (windows.js)
mem.inventoryPath = "@/Inventario"

async function ensureInventoryFolder() {
    if (!File.at(mem.inventoryPath)) {
        const icon = new Icon({ name: "Inventario", class: "DirectoryFile", state: 0 })
        await task.cmd("file.create", { path: "@", Type: "DirectoryFile", name: "Inventario", icon })
        const files = plexos.Core.registry?.fileFile()?.data
        if (files) files[mem.inventoryPath].applications.Explorer.view = "details"
    }
}

// A kind's folder only appears with its first file
async function ensureFolder(kind) {
    const { folder, view } = mem.records[kind]
    if (File.at(folder)) return
    await ensureInventoryFolder()
    const name = File.basename(folder)
    const icon = new Icon({ name, class: "DirectoryFile", state: 0 })
    await task.cmd("file.create", { path: File.dirname(folder), Type: "DirectoryFile", name, icon })
    // each kind has its own view: contacts as tiles with the number under each name, letters
    // in a list, mazes as icons
    const files = plexos.Core.registry?.fileFile()?.data
    if (view && files) files[folder].applications.Explorer.view = view
}

// Inventario, empty, from the start, and on the desktop, in the bottom right corner, a folder that
// opens it (a file drawn as a folder: windows.js opens where it points)
mem.ensureInventory = async () => {
    await ensureInventoryFolder()
    if (mem.progress.spawned.includes("inventory")) return
    const name = "Inventario.dir"
    if (!File.at(mem.desktopPath + "/" + name)) {
        const icon = new Icon({ name, class: "StringFile", exte: "dir", state: 0 })
        const coords = mem.cornerCoords("bottom-right")
        if (coords) icon.coords = coords
        await task.cmd("file.create", { path: mem.desktopPath, Type: "StringFile", name, icon, content: mem.inventoryPath })
        File.refreshViews()
    }
    mem.progress.spawned.push("inventory")
    await mem.saveProgress()
}

// Items were kept with the contacts before: brought out to Inventario, with when they came
mem.moveItemsOut = async () => {
    const contacts = File.at(mem.inventoryPath + "/Contactos")
    if (!contacts) return
    for (const file of File.children(contacts).filter(file => file.cfg.exte === "item")) {
        if (File.at(mem.inventoryPath + "/" + file.name)) continue
        await task.cmd("file.move", { path: file.cfg.path, to: mem.inventoryPath })
        await task.cmd("file.modify", { path: mem.inventoryPath + "/" + file.name, cfg: { detail: mem.stamp() } })
    }
    File.refreshViews()
}

// title: the file's name without its extension. data: what it holds. detail: a line Explorer
// shows in place of the file type (codes show what they say). image: its picture, when not the
// kind's own. Resolves true when the file is new. One at a time, so two
// arriving together never both make the folder.
const stamp = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
// now, as Inventario writes when something was last kept
mem.stamp = () => stamp.format(new Date())
let queue = Promise.resolve()
mem.record = (...args) => queue = queue.then(() => record(...args)).catch(error => (console.error(error), false))

async function record(kind, title, data, { detail = mem.records[kind].showData ? data : undefined, image = mem.records[kind].image, quiet = false } = {}) {
    const { folder, exte, notice } = mem.records[kind]
    const name = title + "." + exte
    const path = folder + "/" + name
    if (File.at(path)) return false
    await ensureFolder(kind)
    const icon = new Icon({ name, class: "StringFile", exte, state: 0 })
    await task.cmd("file.create", { path: folder, Type: "StringFile", name, icon, content: data })
    const cfg = {}
    if (image) cfg.icon = { image }
    if (detail) cfg.detail = detail
    if (Object.keys(cfg).length) await task.cmd("file.modify", { path, cfg })
    // the folder shows in Inventario when it last got something
    await task.cmd("file.modify", { path: folder, cfg: { detail: stamp.format(new Date()) } })
    File.refreshViews()
    if (!quiet) notify(notice, folder)
    return true
}

// A kept file's detail line changed after it was made (what a letter was answered with)
mem.updateDetail = (kind, title, detail) => queue = queue.then(async () => {
    const path = mem.records[kind].folder + "/" + title + "." + mem.records[kind].exte
    if (!File.at(path) || File.at(path).cfg.detail === detail) return
    await task.cmd("file.modify", { path, cfg: { detail } })
    File.refreshViews()
}).catch(error => console.error(error))

// A folder's badge, a sticker in its corner, only ever going up: 1 silver, the game's last item
// is in (it is won); 2 gold, everything it gives toward the end is in, so it needn't be opened
// again; 3 complete, absolutely everything it holds was found.
const badges = [null, "silver", "gold", "complete"]
mem.setBadge = (kind, level) => queue = queue.then(async () => {
    if (level <= (mem.flag("inventory", kind) || 0)) return
    await ensureFolder(kind)
    await mem.setFlag("inventory", kind, level)
    const url = "/plexos/app/game/Party/img/badge-" + badges[level] + ".svg"
    await task.cmd("file.modify", { path: mem.records[kind].folder, cfg: { icon: { stickers: { se: { url, render: "auto" } } } } })
    File.refreshViews()
}).catch(error => console.error(error))

// The order things are kept in, the game's own: first what the main path gives, then the extras.
// Contacts: Fibonacci, the own team, the other three, the items, the unknown number last. Letters
// by step, each with its "Incorrecto", then the final, secret and Mariana's. Mazes 1, 2, 3, then
// diamonds'. Codes by stage, each through the suits. A file this doesn't place goes after.
const suits = ["spades", "hearts", "clubs", "diamonds"]
const teamRank = (team) => team === mem.player?.team ? 0 : 1 + suits.indexOf(team)
const letterOrder = ["0", "1", "wrong", "final", "secret", "queen"]
const mazeOrder = ["first", "second", "third", "artifact"]
mem.inventoryRank = (file) => {
    const exte = file.cfg.exte, data = String(file.data ?? "")
    const image = file.cfg.icon?.image || ""
    if (exte === "contact") {
        if (data === "1123581") return 0
        if (data === "0000000") return 99
        const team = suits.find(each => image.includes("contact-" + each))
        return team ? 1 + teamRank(team) : 50
    }
    // in Inventario, items come after its folders
    if (exte === "item") return 200 + teamRank(data)
    if (exte === "dibujo") return 500
    if (exte === "carta") return letterOrder.includes(data) ? letterOrder.indexOf(data) : 50
    if (exte === "maze") return mazeOrder.includes(data) ? mazeOrder.indexOf(data) : 50
    return codeRank(file.name) ?? 100
}
