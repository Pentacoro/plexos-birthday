import {getTask} from "/plexos/lib/functions/dll.js"
import {Dialogue} from "/plexos/app/game/Party/dialogue.js"
import {pushBack, leave} from "/plexos/app/game/Party/backStack.js"
import intro from "./dialogue/intro.js"
import spades from "./dialogue/spades.js"
import hearts from "./dialogue/hearts.js"
import clubs from "./dialogue/clubs.js"
import diamonds from "./dialogue/diamonds.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.characters = { intro, spades, hearts, clubs, diamonds }
mem.dialogue = new Dialogue(mem.root)

// Every call has its own number. Hanging up moves it on, so whatever the old call
// was still waiting for finds it is no longer live and stops there.
mem.callId = 0
mem.callBack = null

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Everyone hears what the line says. Only the caller's own team's character asks for the code.
// The call, and the code screen after it, is one screen the back button leaves.
mem.dial = async (number) => {
    if (number !== mem.introNumber) mem.retireHint()
    const who = mem.answererOf(number)
    if (!who) return false
    const call = ++mem.callId
    const live = () => call === mem.callId
    mem.mode = "call"
    mem.callBack = pushBack(() => mem.hangUp(true))
    mem.root.classList.add("ringing")
    await wait(1600)
    if (!live()) return true
    mem.root.classList.remove("ringing")
    mem.root.classList.add("talking")
    await mem.addContact(who, number)
    const character = mem.characters[who]
    mem.dialogue.show(character)

    if (who === "intro") {
        // He introduces himself once, then only insists
        const called = mem.party.flag(mem.id, "introCalled")
        await mem.dialogue.play(called ? character.again : character.call)
        if (!live()) return true
        if (!called) await mem.party.setFlag(mem.id, "introCalled", true)
        mem.hangUp()
    } else if (!mem.isOwnTeam(who)) {
        await mem.dialogue.play(character.refuse)
        if (live()) mem.hangUp()
    } else if (mem.party.stepsSolved(mem.id) >= 2) {
        const choice = await mem.dialogue.play(character.greeting)
        if (live() && choice?.reply) await mem.dialogue.play(choice.reply)
        if (live()) mem.hangUp()
    } else {
        await mem.dialogue.play(character.ask)
        if (!live()) return true
        await mem.party.solveStep(mem.id, 1)
        mem.dialogue.hide()
        mem.showCode(who)
    }
    return true
}

// Back to the dial. The back button has already taken its history step; any other way
// of hanging up takes it here.
mem.hangUp = (byBack = false) => {
    mem.callId++
    if (!byBack) leave(mem.callBack)
    mem.callBack = null
    mem.dialogue.stop()
    mem.showDial()
}
