import Task from "/plexos/lib/classes/system/task.js"
import Window from "/plexos/lib/classes/interface/window.js"
import {displayComponent} from "/plexos/lib/functions/dll.js"
import {hideOnClose} from "/plexos/app/game/Party/puzzleWindow.js"

export default {
    application: `Premio`,
    run: async function({taskid,appid,args,path,root}){
        let html = root + "/drawing.html"

        let task = new Task(
            {
                appID: /APPID/,
                name : "Premio",
                node : null,
                id   : taskid
            }
        )
        if (!task.id) return
        hideOnClose(task)

        new Window(
            {
                name : "Premio",
                task : task.id,
            }
        )

        await displayComponent({
            url:html,
            taskid:task.id,
            container:task.node
        })
    }
}
