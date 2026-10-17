import File from "/plexos/lib/classes/filesystem/file.js"
import Task from "/plexos/lib/classes/system/task.js"
import {runLauncher} from "/plexos/lib/functions/dll.js"
import {shortcutById} from "/plexos/app/game/Party/puzzles.js"
import {reopen} from "/plexos/app/game/Party/puzzleWindow.js"

// Opens a puzzle or a tool from its desktop shortcut. The .game file holds its id.
export default {
    app: `Party`,
    run: async function({args}){
        const app = shortcutById(File.at(args.path)?.data)
        if (!app) return
        const open = Task.get(app.name)
        if (open) return reopen(open)
        await runLauncher(app.launcher)
    }
}
