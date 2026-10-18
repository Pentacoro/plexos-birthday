import plexos from "/boot/plexos.js"
import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import Task from "/plexos/lib/classes/system/task.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The secret number's second call. The screen flashes black and every window is gone; the desktop
// flickers, and between flickers its icons have shifted into a spiral sinking into the middle.
// Then, still, the transfer window opens and everything the player has goes to the bin, one item
// at a time; when nothing is left it keeps going with system files, alone in a black void, faster
// and faster, until the page reloads with all progress gone. It isn't: the player's core is kept
// aside first, and the code in boot/password.js brings it back.
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const fileImage = "/THEME/icons/files/images/file.svg"
const fakeFiles = [
    "kernel.plx", "boot.sys", "core.json", "registry.proxy", "settings.json", "users.db", "shell.ls",
    "window.manager", "theme.icon", "plexos.sys", "drivers.cfg", "memory.map", "tasks.lst", "session.key",
    "desktop.ini", "system32", "loader.bin", "init.js", "fs.table", "config.db", "audio.drv", "display.drv",
    "input.drv", "network.cfg", "clock.sys", "bus.sys", "cache.tmp", "swap.img", "boot.log", "plexos.core",
]

// The player's core as it is now, kept under another name for the restore code
async function keepAside() {
    const name = plexos.System.user.name
    const saved = await plexos.db.getUser(name)
    await plexos.db.saveUser({ ...saved, name: "void:" + name })
    plexos.Config.voided = name
    await plexos.db.setConfig(plexos.Config)
}

// Their core gone: nothing saves any more, the next boot makes them a new one
async function wipe() {
    plexos.Core.mem.saveCore = async () => {}
    const user = await plexos.db.getUser(plexos.System.user.name)
    user.localCores = []
    user.config = { ...user.config, bootCore: null, lastOpenedCore: null }
    await plexos.db.saveUser(user)
    // the next load boots from nothing (boot/post.js)
    plexos.Config.voidBoot = true
    await plexos.db.setConfig(plexos.Config)
    location.reload()
}

function veil() {
    const node = document.createElement("div")
    node.style.cssText = "position:fixed;inset:0;z-index:200000;background:#000;pointer-events:all"
    document.body.append(node)
    return node
}

// Every file the player has: the desktop's and everything in Inventario, deepest first
function everything() {
    const out = []
    const walk = (folder) => {
        for (const file of File.children(File.at(folder) || {}) || []) {
            if (file.cfg.class === "DirectoryFile") walk(file.cfg.path)
            out.push(file.cfg.path)
        }
    }
    walk("@/Inventario")
    walk(mem.desktopPath)
    return out
}

const iconOf = (file) => {
    try { return file?.cfg?.icon?.getImage?.() || fileImage } catch { return fileImage }
}

mem.collapse = async () => {
    await keepAside()
    const black = veil()
    await wait(260)
    // back to the desktop
    for (const node of document.querySelectorAll("#windowLayer .window")) node.style.display = "none"

    // the flickers: the icons only move while the screen is dark
    const icons = [...document.querySelectorAll("#iconLayer .icon")]
    const cx = innerWidth / 2, cy = innerHeight / 2
    const starts = icons.map(node => { const r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })
    const flicks = 22
    for (let k = 0; k < flicks; k++) {
        black.style.opacity = "0"
        await wait(60 + Math.random() * 140)
        black.style.opacity = "1"
        // the dark stretches grow longer as it goes on
        const t = (k + 1) / flicks
        icons.forEach((node, i) => {
            const angle = i * 2.4 + t * 5
            const radius = (1 - t) * Math.min(cx, cy) * 0.9 * (0.4 + 0.6 * ((i + 1) / icons.length))
            const [sx, sy] = starts[i]
            const x = sx + (cx + Math.cos(angle) * radius - sx) * Math.min(1, t * 1.6)
            const y = sy + (cy + Math.sin(angle) * radius - sy) * Math.min(1, t * 1.6)
            node.style.transition = "none"
            node.style.transform = `translate(${x - sx}px, ${y - sy}px) scale(${1 - t * 0.75})`
        })
        await wait(120 + Math.random() * 260 + k * 25)
    }
    black.style.opacity = "0"
    black.style.pointerEvents = "all"
    await wait(1600)

    // the transfer window, sending everything to the bin
    const real = everything()
    const total = real.length + fakeFiles.length * 4
    // its buttons work: pause holds it; cancel, like closing it, ends it at once
    let ended = false
    const job = {
        total, delay: 520, fraction: 0, worked: 0, workedBase: 0, index: 0,
        label: "", icon: fileImage, from: "Inventario", to: "Trash",
        fromPath: "@/Inventario", toPath: File.trashPath,
        listeners: new Set(), revealed: true, finished: false, cancelled: false, paused: false, progress: null,
        touch() { for (const fn of job.listeners) fn() },
        togglePause() { job.paused = !job.paused; job.touch() },
        cancel() { ended = true },
    }
    black.style.pointerEvents = "none"
    const win = await plexos.System.persistentWindow({
        name: "Moving", app: "System",
        url: "/plexos/app/sys/System/File Management/progress.html",
        args: { job },
        onClose: () => { ended = true },
        appParams: { initialDrawPosition: "center" },
    })
    // one item: its name on the window, the bar across it, then it goes
    const send = async (index, label, icon, from, path) => {
        job.index = index
        job.label = label
        job.icon = icon
        job.fromPath = from
        const steps = Math.max(1, Math.round(job.delay / 40))
        for (let s = 1; s <= steps && !ended; s++) {
            while (job.paused && !ended) await wait(60)
            job.fraction = (index + s / steps) / total
            job.touch()
            await wait(job.delay / steps)
        }
        if (!ended && path && File.at(path)) await plexos.System.cmd("file.move", { path, to: File.trashPath }).catch(() => {})
    }
    let index = 0
    for (const path of real) {
        if (ended) break
        const file = File.at(path)
        if (file) await send(index, file.name, iconOf(file), File.dirname(path), path)
        index++
    }
    // nothing of theirs is left: the void, and the system itself going
    document.getElementById("desktopLayer").style.background = "#000"
    document.getElementById("iconLayer").style.visibility = "hidden"
    document.getElementById("gridLayer").style.visibility = "hidden"
    document.body.style.background = "#000"
    for (let round = 0; index < total && !ended; round++) {
        for (const name of fakeFiles) {
            if (index >= total || ended) break
            await send(index, name, fileImage, "@/plexos/" + ["sys", "core", "boot", "cfg"][round % 4])
            index++
            job.delay = Math.max(12, job.delay * 0.86)
        }
    }
    // at the end, or as soon as the window is closed: three seconds of black, then the login
    // screen's violet saying null, then gone
    veil()
    if (win) Task.id(win.task)?.end()
    await wait(3000)
    const nothing = veil()
    nothing.style.cssText += ";background:#1c1730;display:flex;align-items:center;justify-content:center;color:#4a4a55;font:600 30px system-ui,sans-serif"
    nothing.textContent = "null"
    await wait(10000)
    await wipe()
}
