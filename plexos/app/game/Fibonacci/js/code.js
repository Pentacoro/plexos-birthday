import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The right code is saved at once, then the character thanks you and the call ends.
// Calling them afterwards reaches their greeting and questions.
mem.submitCode = async (entry) => {
    if (entry !== mem.teamCode(mem.codeTeam)) return false
    const call = mem.callId
    const live = () => call === mem.callId
    mem.mode = "call"
    // the phone is won; the team's item is on its way, and comes with their artifact (Party's items.js)
    await mem.party.solveStep(mem.id, 2)
    mem.party.setBadge("contacts", 1)
    mem.root.classList.add("solved")
    await new Promise(resolve => setTimeout(resolve, 700))
    if (!live()) return true
    const character = mem.characters[mem.codeTeam]
    mem.root.classList.add("talking")
    mem.dialogue.show(character)
    await mem.dialogue.play(character.right)
    if (live()) mem.hangUp()
    return true
}
