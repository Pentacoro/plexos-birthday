import Task from "/plexos/lib/classes/system/task.js"
import Window from "/plexos/lib/classes/interface/window.js"
import {displayComponent} from "/plexos/lib/functions/dll.js"
import {hideOnClose} from "/plexos/app/game/Party/puzzleWindow.js"

export default {
    application: `Artefacto ♠︎`,
    run: async function({taskid,appid,args,path,root}){
        let html = root + "/codetable.html"

        //task creation
        let task = new Task(
            {
                appID: /APPID/,
                name : "Artefacto ♠︎",
                node : null,
                id   : taskid
            }
        )
        if (!task.id) return
        hideOnClose(task)

        //window generation
        new Window(
            {
                name : "Artefacto ♠︎",
                task : task.id,
                icon : root + "/icon.svg",
            }
        )

        await displayComponent({
            url:html,
            taskid:task.id,
            container:task.node
        })
    }
}
