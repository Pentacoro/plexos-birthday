import {getTask} from "/plexos/lib/functions/dll.js"
import File from "/plexos/lib/classes/filesystem/file.js"
import {puzzles} from "/plexos/app/game/Party/puzzles.js"
import {gameState} from "/plexos/app/game/Party/completion.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Each game's icon on the desktop wears how far it is (completion.js), as Inventario's folders
// wear theirs: silver once it is done, gold once it is complete. Checked after every save.
const stickers = { done: "silver", complete: "gold" }

let queue = Promise.resolve()
mem.updateStickers = () => queue = queue.then(async () => {
    let changed = false
    for (const puzzle of puzzles) {
        const file = File.at(mem.desktopPath + "/" + puzzle.name + ".game")
        const level = stickers[gameState(mem, puzzle.id)[0]]
        if (!file || !level) continue
        const url = "/plexos/app/game/Party/img/badge-" + level + ".svg"
        if (file.cfg.icon?.stickers?.se?.url === url) continue
        await task.cmd("file.modify", { path: file.cfg.path, cfg: { icon: { stickers: { se: { url, render: "auto" } } } } })
        changed = true
    }
    if (changed) File.refreshViews()
}).catch(error => console.error(error))
