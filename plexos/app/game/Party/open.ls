import plexos from "/boot/plexos.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import Task from "/plexos/lib/classes/system/task.js"
import {runLauncher} from "/plexos/lib/functions/dll.js"
import {shortcutById} from "/plexos/app/game/Party/puzzles.js"
import {reopen} from "/plexos/app/game/Party/puzzleWindow.js"
import {t} from "/plexos/app/game/Party/lang.js"

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// The app with this id, brought up or started, and its mem once its scripts have all run
async function openApp(id, ready) {
    const app = shortcutById(id)
    if (!app) return null
    const open = Task.get(app.name)
    if (open) reopen(open)
    else await runLauncher(app.launcher)
    for (let i = 0; i < 50; i++) {
        const mem = Task.get(app.name)?.mem
        if (mem && ready(mem)) return mem
        await wait(100)
    }
    return null
}

// Opens what the party game made: a desktop shortcut (.game, holding its puzzle's id), or a
// file it kept. A contact opens the phone and dials it, a letter shows in Detective Web, a
// maze opens the labyrinth.
export default {
    app: `Party`,
    run: async function({args}){
        const file = File.at(args.path)
        if (!file) return
        const exte = file.cfg.exte
        // the secret number's contact: deleted first, so opening it finds nothing
        if (exte === "contact" && file.data === "0000000") {
            await Task.get("Party").cmd("file.delete", { path: args.path })
            File.open(args.path)
            if (!File.at(args.path)) plexos.System.popup(null, [["OK"]], { name: "Error", type: false, title: t("Archivo no encontrado"), description: t("El archivo ya no existe."), icon: "" })
        } else if (exte === "contact") {
            const mem = await openApp("fibonacci", mem => mem.dialContact && mem.mode)
            if (!mem) return
            if (mem.mode !== "dial") mem.hangUp()
            mem.dialContact(file.data)
        } else if (exte === "carta") {
            const mem = await openApp("webdetective", mem => mem.showLetter && mem.view && !mem.busy)
            mem?.showLetter(file.data)
        } else if (exte === "item") {
            // an item is only proof of what was given: nothing opens
        } else if (exte === "maze") {
            const mem = await openApp("labyrinth", mem => mem.showMaze && mem.leg && !mem.busy)
            mem?.showMaze(file.data)
        } else {
            await openApp(file.data, () => true)
        }
    }
}
