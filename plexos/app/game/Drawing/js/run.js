import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Premio: the drawing made for this player, kept in Inventario once the safe is finished
mem.party = Task.get("Party").mem
mem.root = task.node.querySelector(".drawing")

const name = mem.party.player?.name || ""
const img = mem.root.querySelector(".drawing-img")
const msg = mem.root.querySelector(".drawing-msg")

img.src = "/assets/Dibujos/" + name + ".png"
img.draggable = false
// a player with no drawing still gets the message, not a broken picture
img.onerror = () => { img.hidden = true }
msg.textContent = "¡Gracias por jugar, " + name + "!"

// tapping the drawing shows it over the whole window
img.addEventListener("pointerdown", (e) => {
    if (img.hidden) return
    e.stopPropagation()
    const overlay = document.createElement("div")
    overlay.className = "drawing-expand"
    const big = document.createElement("img")
    big.src = img.src
    big.alt = ""
    big.className = "drawing-expand-img"
    const close = document.createElement("button")
    close.type = "button"
    close.className = "drawing-expand-close"
    close.setAttribute("aria-label", "Cerrar")
    close.textContent = "×"
    close.addEventListener("pointerdown", (ev) => { ev.stopPropagation(); overlay.remove() })
    overlay.append(big, close)
    mem.root.append(overlay)
})

task.focus()
