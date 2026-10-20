// No core yet. Config in IndexedDB names the landing face; Theme Manager and
// Window Manager start on that face, and the stage below draws on #windowLayer.
// The landing is a single password bar. Each player's 3 character password, letters and digits, picks their
// profile, which boots its own writable local clone of the core. Mounting it
// closes this stage, swaps in the core's session face from settings.json, and
// only then opens the desktop. The profile and core landing (users.js, cores.js) stays unused.
import "./version.js"
import "../plexos/lib/functions/prototype.js"
import "./system.js"
import "../plexos/ini/events.js"
import plexos from "./plexos.js"
import Task from "../plexos/lib/classes/system/task.js"
import { runLauncher } from "../plexos/lib/functions/dll.js"
import { bootLocalPlexos } from "./cores.js"
import { showPasswordBar } from "./password.js"
import { showPost } from "./post.js"

// For development: true skips the landing and opens the local Plexos clone.
const bootLocalClone = false

async function loadConfig() {
    // Landing theme and the last user live in IndexedDB, before any core is mounted.
    plexos.Config = await new Promise((resolve) => {
        plexos.db.getConfig()
            .then(config => resolve(config))
            .catch(async error => {
                console.log(error)
                await plexos.db.setConfig({
                    defaultUser: null,
                    lastUserLog: null,
                    bootRoutine: "default",
                    theme: "Plexos Hyper",
                    colorScheme: "Purple",
                })
                resolve(await plexos.db.getConfig())
            })
    })
}

async function prepareConfig() {
    await loadConfig()
    let dirty = false
    if (!plexos.Config.theme || plexos.Config.theme === "default") {
        plexos.Config.theme = "Plexos Hyper"
        dirty = true
    }
    if (!plexos.Config.colorScheme) {
        plexos.Config.colorScheme = "Purple"
        dirty = true
    }
    if (dirty) await plexos.db.setConfig(plexos.Config)
    plexos.System.mem.cfg = plexos.Config
}

async function boot() {
    plexos.Boot.basePath = window.location
    document.body.classList.add("booting")
    plexos.Core.mem.booting = true
    plexos.Theme = { face: "landing" }
    await prepareConfig()
    // right after the secret number wiped a player: the machine coming back from nothing
    if (plexos.Config.voidBoot) {
        await showPost()
        plexos.Config.voidBoot = false
        await plexos.db.setConfig(plexos.Config)
    }
    await runLauncher("./plexos/app/sys/Theme Manager/themeManager.ls", { face: "landing" })
    await runLauncher("./plexos/app/sys/Window Manager/windowManager.ls")
    if (!Task.get("Window Manager")?.mem?.windows) {
        throw new Error("Window Manager did not start")
    }
    if (bootLocalClone) {
        await bootLocalPlexos()
        return
    }
    showPasswordBar()
}

boot().catch(error => console.error(error))
