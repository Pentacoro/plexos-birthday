import {getTask} from "/plexos/lib/functions/dll.js"
import {discSvg, starSvg} from "/plexos/app/game/StarDisc/draw.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Artifact 1 on the desktop: the same disc and star as the printed ones (disc.js, draw.js),
// each turned by hand
mem.root  = task.node.querySelector(".artifact")
mem.stage = mem.root.querySelector(".stage")
mem.disc  = mem.stage.querySelector(".disc")
mem.star  = mem.stage.querySelector(".star")

mem.disc.innerHTML = discSvg()
mem.star.innerHTML = starSvg({ id: "star-" + task.id })

// how far each is turned, in degrees clockwise; the star starts off any line
mem.turns = { disc: 0, star: 22 }
