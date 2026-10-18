// After the secret number wipes a player, the next load starts like a machine coming back from
// nothing: a black screen and a boot log, typed out line by line, of what Plexos really does as it
// starts (boot.js, system.js, the managers, mounting the core, init.js, the Party installing its
// apps). The numbers are real where they can be: the core's size, its nodes, its apps.
import { puzzles, tools } from "../plexos/app/game/Party/puzzles.js"

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const jitter = (base, spread) => base + Math.random() * spread

const style = `
.post {
    position: fixed;
    inset: 0;
    z-index: 300000;
    box-sizing: border-box;
    padding: 18px 14px;
    overflow: hidden;
    background: #000;
    color: #bdbdbd;
    font: 12px/1.45 "Courier New", ui-monospace, monospace;
    white-space: pre-wrap;
    word-break: break-all;
}
.post .ok { color: #3ddc6a; }
.post .warn { color: #ffd83d; }
.post .bad { color: #ff4a5a; }
.post .dim { color: #6a6a74; }
.post .bright { color: #fff; }
.post .cursor::after {
    content: "_";
    animation: post-blink 0.8s steps(1) infinite;
}
@keyframes post-blink { 50% { opacity: 0; } }`

// what the core holds, read from it: size, nodes, apps
async function coreFacts() {
    try {
        const response = await fetch("/core.json")
        const text = await response.text()
        const tree = JSON.parse(text)
        let nodes = 0
        let apps = 0
        const walk = (node) => {
            if (!node || typeof node !== "object") return
            if ("name" in node && "cfg" in node) nodes++
            if (node.name === "applications.proxy") {
                try {
                    const data = typeof node.data === "string" ? JSON.parse(node.data) : node.data
                    apps = Object.keys(data.SYSTEM || {}).length + Object.keys(data.STANDALONE || {}).length
                } catch { /* counted as none */ }
            }
            for (const value of Object.values(node)) if (typeof value === "object") walk(value)
        }
        walk(tree)
        return { kb: Math.round(text.length / 1024), nodes, apps }
    } catch {
        return { kb: 0, nodes: 0, apps: 0 }
    }
}

export async function showPost() {
    const sheet = document.createElement("style")
    sheet.textContent = style
    document.head.append(sheet)
    const screen = document.createElement("div")
    screen.className = "post"
    document.body.append(screen)

    let line = null
    const newLine = () => {
        line?.classList.remove("cursor")
        line = document.createElement("div")
        line.className = "cursor"
        screen.append(line)
        // the oldest lines scroll off the top, as on a real screen
        while (screen.scrollHeight > screen.clientHeight && screen.children.length > 1) screen.firstChild.remove()
        return line
    }
    const span = (text, cls) => {
        const node = document.createElement("span")
        if (cls) node.className = cls
        node.textContent = text
        line.append(node)
        return node
    }
    // a line typed fast, then its result after the dots
    const say = async (text, cls = "", pause = 90) => {
        newLine()
        span(text, cls)
        await wait(jitter(pause, pause))
    }
    const task = async (label, result = "OK", cls = "ok", work = 260) => {
        newLine()
        span(label)
        const dots = span("", "dim")
        const width = Math.max(3, 34 - label.length)
        for (let i = 0; i < width; i++) {
            dots.textContent += "."
            if (i % 4 === 0) await wait(jitter(work / width * 3, 20))
        }
        span(" " + result, cls)
        await wait(jitter(60, 80))
    }

    const facts = coreFacts()
    await wait(900)
    await say("PLEXOS BIOS v2.4.1   (C) Pentacoro Systems", "bright", 300)
    await say("Build 2026.10.24  //  The Internet's Desktop", "dim", 400)
    await say("")
    await say("CPU0: Browser Virtual Core, " + (navigator.hardwareConcurrency || 4) + " threads", "", 150)
    // the memory count running up
    newLine()
    span("Memory test: ")
    const count = span("0", "bright")
    for (let kb = 0; kb <= 65536; kb += 2048) {
        count.textContent = kb + " KB"
        await wait(18)
    }
    span(" OK", "ok")
    await wait(300)
    await say("")
    await task("Detecting storage", "IndexedDB \"plexos\"", "bright")
    await task("  store Config", "found")
    await task("  store Users", "found")
    await task("  user core", "NOT FOUND", "bad", 600)
    await say("WARNING: last session ended abnormally (0x0000000)", "warn", 500)
    await say("WARNING: a new core will be cloned from /core.json", "warn", 500)
    await say("")
    await say("Loading /boot/boot.js", "bright", 200)
    await task("  import /boot/system.js")
    await task("  new Task(\"System\")")
    await task("  new Task(\"Core\")")
    await task("  plexos.System.bus", "listening")
    await task("  read Config", "theme \"Plexos Hyper\"", "bright")
    await task("Starting Theme Manager", "face: landing", "bright", 400)
    await task("  loadThemeConstructors", "11 kinds")
    await task("  applyThemeFace(\"landing\")")
    await task("Starting Window Manager", "OK", "ok", 400)
    await task("  window stack", "0 windows", "dim")
    await say("")
    const { kb, nodes, apps } = await facts
    await task("Fetching /core.json", kb + " KB", "bright", 700)
    await task("Parsing virtual filesystem", nodes + " nodes", "bright", 600)
    await task("  mountTree(@)", "mounted")
    await task("  @/plexos", "mounted")
    await task("  @/plexos/cfg/settings.json", "read")
    await task("  @/plexos/reg/applications.proxy", "read")
    await task("  @/plexos/reg/files.proxy", "read")
    await task("  @/home", "mounted")
    await task("  @/home/desks/desktop", "empty", "dim")
    await task("  @/trash", "empty", "dim")
    await say("")
    await say("Running /plexos/ini/init.js", "bright", 200)
    await task("  ensureSettingsFile")
    await task("  new Registry")
    await task("  upgradeRegistry", "catalog current")
    await task("  issueSessionAppIDs", apps + " apps")
    await task("  applyThemeFace(\"session\")")
    await say("")
    await say("Installing game apps", "bright", 200)
    for (const app of [{ name: "Party" }, ...puzzles, ...tools]) await task("  " + app.name, "installed", "ok", 350)
    await task("Creating @/Inventario", "empty", "dim", 400)
    await task("Integrity check", "0 files recovered", "bad", 1200)
    await say("")
    await say("null", "dim", 1400)
    await say("")
    await say("Starting Plexos...", "bright", 900)
    line?.classList.remove("cursor")
    await wait(700)
    // no fade: the text goes, three seconds of black, then the login
    screen.replaceChildren()
    await wait(3000)
    screen.remove()
    sheet.remove()
}
