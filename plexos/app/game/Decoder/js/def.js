import {getTask} from "/plexos/lib/functions/dll.js"
import {unlock} from "/plexos/app/game/Party/cipher.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Pentacoro's own: a message locked with a password (Mariana's answer, sent over WhatsApp) is
// pasted in, and the password opens it
mem.root     = task.node.querySelector(".decoder")
mem.locked   = mem.root.querySelector(".decoder-locked")
mem.password = mem.root.querySelector(".decoder-password")
mem.open     = mem.root.querySelector(".decoder-open")
mem.result   = mem.root.querySelector(".decoder-result")

mem.decode = () => {
    const text = unlock(mem.locked.value, mem.password.value)
    mem.result.classList.toggle("wrong", text === null)
    mem.result.textContent = text ?? "No se pudo descifrar: revisá el mensaje y la contraseña."
}
