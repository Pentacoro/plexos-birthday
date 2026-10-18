import plexos from "../../boot/plexos.js"
import Registry from "/plexos/lib/classes/system/registry.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import ProxyFile from "/plexos/lib/classes/filesystem/proxy.js"
import Task from "/plexos/lib/classes/system/task.js"
import {runLauncher} from "/plexos/lib/functions/dll.js"
import { ensureSystemApp, ensureSystemEntry } from "/plexos/app/sys/System/system.js"

const settingsPath = "@/plexos/cfg/settings.json"

async function ensureSettingsFile() {
    const file = File.at(settingsPath)
    if (!file?.data) throw new Error("This core has no settings.json")
    plexos.Settings = JSON.parse(file.data)
    plexos.Settings.system.transfer ??= { pace: "slowest", override: "" }
    // what the party game keeps opens back in its puzzle
    for (const exte of ["game", "contact", "carta", "maze", "item"]) plexos.Settings.apps[exte] ??= "/plexos/app/game/Party/open.ls"
}

export async function saveSettings() {
    const data = JSON.stringify({
        system: plexos.Settings.system,
        audio: plexos.Settings.audio,
        desktop: plexos.Settings.desktop,
        apps: plexos.Settings.apps,
    }, null, 2)
    const system = plexos.System
    if (system?.cmd) await system.cmd("file.write", { path: settingsPath, data })
    else writeSettingsFile()
    if (plexos.Core?.mem?.saveCore) {
        try { await plexos.Core.mem.saveCore() } catch (error) { console.error(error) }
    }
}

export function writeSettingsFile() {
    const file = File.at(settingsPath)
    if (!file || !plexos.Settings?.system) return
    file.data = JSON.stringify({
        system: plexos.Settings.system,
        audio: plexos.Settings.audio,
        desktop: plexos.Settings.desktop,
        apps: plexos.Settings.apps,
    }, null, 2)
}

export async function openDesktop(address) {
    await runLauncher("./plexos/app/sys/Desktop/desktop.ls", {path: address})
    let desktop = Task.get("Desktop")
    if (desktop?.mem?.grid?.evaluateIconGrid) {
        desktop.mem.grid.evaluateIconGrid()
        desktop.mem.renderIcons()
    }
}

const monacoEntry = {
    windowDrawParameters: { default: { minimizeable: true, maximizeable: true, resizeable: true, sizeDrawMethod: "window", saveDrawParameters: "app" } },
    installationDirectory: "@/plexos/app/data/Monaco",
    launcherScriptFilePath: "/plexos/app/data/Monaco/monaco.ls",
    instantiable: true,
    systemPermissions: ["file", "task", "event"],
    systemProhibitions: [],
}

const partyEntry = {
    installationDirectory: "@/plexos/app/game/Party",
    launcherScriptFilePath: "/plexos/app/game/Party/party.ls",
    launcherDependents: ["/plexos/app/game/Party/open.ls"],
    instantiable: false,
    systemPermissions: ["file", "task", "event"],
    systemProhibitions: [],
}

const fibonacciEntry = {
    windowDrawParameters: { default: { minimizeable: false, maximizeable: false, resizeable: false, initialDrawSize: "maximized", sizeDrawMethod: "window", saveDrawParameters: "disabled" } },
    installationDirectory: "@/plexos/app/game/Fibonacci",
    launcherScriptFilePath: "/plexos/app/game/Fibonacci/fibonacci.ls",
    instantiable: false,
    systemPermissions: ["task", "event"],
    systemProhibitions: [],
}

const mapEntry = {
    ...fibonacciEntry,
    installationDirectory: "@/plexos/app/game/Map",
    launcherScriptFilePath: "/plexos/app/game/Map/map.ls",
}

const webDetectiveEntry = {
    ...fibonacciEntry,
    installationDirectory: "@/plexos/app/game/WebDetective",
    launcherScriptFilePath: "/plexos/app/game/WebDetective/webDetective.ls",
}

const labyrinthEntry = {
    ...fibonacciEntry,
    installationDirectory: "@/plexos/app/game/Labyrinth",
    launcherScriptFilePath: "/plexos/app/game/Labyrinth/labyrinth.ls",
}

const syncEntry = {
    ...fibonacciEntry,
    installationDirectory: "@/plexos/app/game/Sync",
    launcherScriptFilePath: "/plexos/app/game/Sync/sync.ls",
}

const decoderEntry = {
    ...fibonacciEntry,
    installationDirectory: "@/plexos/app/game/Decoder",
    launcherScriptFilePath: "/plexos/app/game/Decoder/decoder.ls",
}

const trainerEntry = {
    ...fibonacciEntry,
    installationDirectory: "@/plexos/app/game/Trainer",
    launcherScriptFilePath: "/plexos/app/game/Trainer/trainer.ls",
}

// A saved core keeps the app catalog it was made with. This brings an older one up to date before the session
// ids are issued. Each step leaves a core that already has it untouched.
function upgradeRegistry(registry) {
    const data = registry.appFile()?.data
    if (!data) return
    ensureSystemEntry(data)
    if (!("Monaco" in data.STANDALONE)) data.STANDALONE.Monaco = monacoEntry
    if (!("Party" in data.SYSTEM)) data.SYSTEM.Party = partyEntry
    if (!("Fibonacci" in data.STANDALONE)) data.STANDALONE.Fibonacci = fibonacciEntry
    if (!("Map" in data.STANDALONE)) data.STANDALONE.Map = mapEntry
    if (!("WebDetective" in data.STANDALONE)) data.STANDALONE.WebDetective = webDetectiveEntry
    if (!("Labyrinth" in data.STANDALONE)) data.STANDALONE.Labyrinth = labyrinthEntry
    if (!("Sync" in data.STANDALONE)) data.STANDALONE.Sync = syncEntry
    if (!("Decoder" in data.STANDALONE)) data.STANDALONE.Decoder = decoderEntry
    if (!("Trainer" in data.STANDALONE)) data.STANDALONE.Trainer = trainerEntry
}

export default async function initialize() {
    plexos.Core.mem.booting = true
    await ensureSettingsFile()
    plexos.Core.registry = new Registry("@/plexos/reg/files.proxy", "@/plexos/reg/applications.proxy")
    upgradeRegistry(plexos.Core.registry)
    plexos.Core.registry.issueSessionAppIDs()
    plexos.Core.mem.booting = false
    ensureSystemApp()

    console.log(plexos)
    console.log(plexos.Core.file)
    console.log(ProxyFile.unwrapProxy(File.at("@/plexos/reg/applications.proxy")))
}
