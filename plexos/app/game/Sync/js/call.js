import {getTask} from "/plexos/lib/functions/dll.js"
import {callCode} from "/plexos/app/game/Sync/pairs.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Stage 3, the same for both: three digits and the Fibonacci phone. Calling the partner
// team's number now gets a character who was expecting the call, and gives the code. Hearts
// is given it in symbols, and reads it with their artifact.
mem.buildCall = (solved) => {
    const field = mem.entryField(3, callCode(mem.team, mem.partner, mem.player))
    if (solved) field.solve()
    const phone = mem.el("img", "call-phone")
    phone.src = "/plexos/app/game/Fibonacci/icon.svg"
    phone.alt = ""
    mem.callNote = mem.el("p", "call-note")
    mem.screen.append(field.node, phone, mem.callNote, mem.keypad(field))
    mem.showHeard()
}

// Once the partner's character has given the code, it stays written under the phone, as told
mem.showHeard = () => {
    const heard = mem.state().heard
    if (!mem.callNote?.isConnected) return
    mem.callNote.textContent = heard ? "Código anotado: " + [...heard].join(" ") : ""
}
