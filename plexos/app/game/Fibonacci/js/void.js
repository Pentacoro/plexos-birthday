import {getTask} from "/plexos/lib/functions/dll.js"
import {voidSound} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The secret number, the first time. After the ringing, nobody: no one on the line, no words.
// After a while a single answer to give, "...¿Hola?". Silence again, then a sound from the void,
// and the phone closes by itself. The number is kept as an unknown contact. Calling it again
// is something else (Party's void.js).
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

mem.voidCall = async (number, live) => {
    mem.root.classList.add("void")
    await wait(5000)
    if (!live()) return true
    const choice = document.createElement("button")
    choice.type = "button"
    choice.className = "void-choice"
    choice.textContent = "...¿Hola?"
    mem.root.append(choice)
    await new Promise(resolve => choice.addEventListener("pointerdown", e => {
        e.preventDefault()
        resolve()
    }, { once: true }))
    choice.remove()
    await wait(3000)
    if (!live()) return true
    voidSound()
    await wait(3400)
    await mem.addContact("void", number)
    await mem.party.setFlag(mem.id, "voidCalled", true)
    mem.root.classList.remove("void")
    if (live()) mem.hangUp()
    task.end()
    return true
}
