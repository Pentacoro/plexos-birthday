import Task from "/plexos/lib/classes/system/task.js"
import Window from "/plexos/lib/classes/interface/window.js"
import {displayComponent} from "/plexos/lib/functions/dll.js"
import {hideOnClose} from "/plexos/app/game/Party/puzzleWindow.js"
import {cardIcon} from "/plexos/app/game/Status/card.js"

export default {
    application: `Estado`,
    run: async function({taskid,appid,args,path,root}){
        let html = root + "/status.html"

        //task creation
        let task = new Task(
            {
                appID: /APPID/,
                name : "Estado",
                node : null,
                id   : taskid
            }
        )
        if (!task.id) return
        hideOnClose(task)

        //window generation
        new Window(
            {
                name : "Estado",
                task : task.id,
                icon : cardIcon(Task.get("Party")?.mem?.player),
            }
        )

        await displayComponent({
            url:html,
            taskid:task.id,
            container:task.node
        })
    }
}
