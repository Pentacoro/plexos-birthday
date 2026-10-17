import Task from "/plexos/lib/classes/system/task.js"
import {displayComponent} from "/plexos/lib/functions/dll.js"

// Runs the activity for whoever logged in: their player record, and later the
// puzzle unlocks and their progress. It has no window.
export default {
    app: `Party`,
    run: async function({taskid,appid,args,path,root}){
        let html = root + "/party.html"
        let node = document.createElement("div")
        node.hidden = true
        document.getElementById("systemLayer").append(node)

        //task creation
        let task = new Task(
            {
                appID: /APPID/,
                name : "Party",
                node : node,
                from : "System",
                id   : taskid
            }
        )
        if (!task.id) return

        await displayComponent({
            url:html,
            taskid:task.id,
            container:task.node,
        })
    }
}
