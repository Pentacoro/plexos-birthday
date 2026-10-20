import {getTask} from "/plexos/lib/functions/dll.js"
import {control} from "/plexos/lib/functions/controls.js"
import ContextMenu from "/plexos/lib/classes/interface/contextmenu.js"

let task = getTask(/TASKID/)
let mem  = task.mem
if (!mem.menubar) mem.menubar = {}

mem.menubar.continuousContext = false
mem.menubarRender = function () {
    // The window's own lookup is a CSS selector and throws or misses on a phone. The id is unique.
    const mount = document.getElementById(task.id + "_menubar")
    if (!mount) return
    const menubar = control("menubar", { items: mem.menubar.menubarButtons })
    mount.replaceChildren(menubar.node)
    mem.menubar.keyNodes = menubar.keyNodes

    for (const [name, button] of Object.entries(menubar.keyNodes.buttons)) {
        function buttonMenuOpen(e) {
            e.preventDefault()
            mem.menubar.targetElement = button
            let bound = button.getBoundingClientRect()
            let param = {
                clientY:bound.bottom,
                clientX:bound.left,
                contextVar:mem.menubar
            }
            let menu = mem.menubar.contextOptions(button, name).menu
            ContextMenu.open(param,button,menu)
            button.onmousedown = e => {
                ContextMenu.close()
                buttonMenuClose(e)
            }
        }
        function buttonMenuClose(e) {
            e.preventDefault()
            button.onmousedown = e => {
                buttonMenuOpen(e)
            }
        }
        button.onmousedown = e => {
            buttonMenuOpen(e)
        }
        button.onmouseover = e => {
            if (mem.menubar.targetElement) mem.menubar.targetElement.dispatchEvent(new Event ("closemenu"))
            if (mem.menubar.continuousContext) buttonMenuOpen(e)
        }
        button.addEventListener("closemenu", e=>{buttonMenuClose(e)})
        button.contextMenu = true
        button.openMenu = () => buttonMenuOpen({ preventDefault() {} }) // for keyboard.js
    }
}
mem.menubarRender()
