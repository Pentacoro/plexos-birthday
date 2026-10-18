import {getTask} from "/plexos/lib/functions/dll.js"
import {wrong} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The bar at the top answers every entry: it takes the color of each one put in, blips red
// three times on a wrong one, and blips white three times on the right one, then stays white
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

mem.lightSet = (color = "") => {
    mem.light.style.background = color
    mem.light.style.boxShadow = color ? "0 0 14px " + color : ""
}

async function blip(color) {
    for (let i = 0; i < 3; i++) {
        mem.lightSet(color)
        await wait(140)
        mem.lightSet()
        await wait(110)
    }
}

mem.lightFail = async () => {
    wrong()
    await blip("#ff4a5a")
}

mem.lightWin = async () => {
    await blip("#fff")
    mem.lightSet("#fff")
}
