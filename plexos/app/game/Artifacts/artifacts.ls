import Task from "/plexos/lib/classes/system/task.js"
import Window from "/plexos/lib/classes/interface/window.js"
import {displayComponent} from "/plexos/lib/functions/dll.js"
import {hideOnClose} from "/plexos/app/game/Party/puzzleWindow.js"

export default {
    application: `Caja Fuerte`,
    run: async function({taskid,appid,args,path,root}){
        let html = root + "/artifacts.html"

        //task creation
        let task = new Task(
            {
                appID: /APPID/,
                name : "Caja Fuerte",
                node : null,
                id   : taskid
            }
        )
        if (!task.id) return
        hideOnClose(task)

        //window generation
        new Window(
            {
                name : "Caja Fuerte",
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
