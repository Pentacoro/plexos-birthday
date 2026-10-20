import {getTask} from "/plexos/lib/functions/dll.js"
import {Dialogue, Line} from "/plexos/app/game/Party/dialogue.js"
import {spokenCode, pairState, setPairState, codeName} from "/plexos/app/game/Sync/pairs.js"
import {pushBack, leave} from "/plexos/app/game/Party/backStack.js"
import {puzzleById, isUnlocked} from "/plexos/app/game/Party/puzzles.js"
import {teams} from "/plexos/app/game/Party/teams.js"
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

// A team's character introduces themselves, and on the first call asks the caller's team.
// Another team is turned away, then only told no from then on. The own team asks for the code,
// and once it is solved offers questions. The partner in Sincronización Emparejada, once its
// last stage is reached, gets that stage's code (in symbols, for hearts). The call, and the code screen after it, is
// one screen the back button leaves.
mem.dial = async (number) => {
    if (number !== mem.introNumber) mem.retireHint()
    const who = mem.answererOf(number)
    if (!who) return false
    // the secret number, called again: everything goes (Party's void.js)
    if (who === "void" && mem.party.flag(mem.id, "voidCalled")) {
        mem.party.collapse()
        return true
    }
    const call = ++mem.callId
    const live = () => call === mem.callId
    mem.mode = "call"
    mem.callBack = pushBack(() => mem.hangUp(true))
    mem.root.classList.add("ringing")
    mem.sound.ring()
    await wait(1600)
    if (!live()) return true
    mem.root.classList.remove("ringing")
    mem.root.classList.add("talking")
    if (who === "void") return mem.voidCall(number, live)
    await mem.addContact(who, number)
    const character = mem.characters[who]
    // Before the party the phone is a preview, and each team on it is only its suit, in its color
    const preview = who !== "intro" && !isUnlocked(puzzleById("fibonacci"))
    mem.dialogue.show(preview ? { ...character, sprite: suitSprite(who) } : character)

    if (who === "intro") {
        // He introduces himself once, then only insists
        const called = mem.party.flag(mem.id, "introCalled")
        await mem.dialogue.play(called ? character.again : character.call)
        if (!live()) return true
        if (!called) await mem.party.setFlag(mem.id, "introCalled", true)
        mem.hangUp()
        return true
    }

    // Before the party the phone is a preview: each team's character only says their preview
    // lines, and the contact is kept for the night
    if (preview) {
        const suit = suitSprite(who)
        await mem.dialogue.play(character.preview.map(line => new Line(suit, line.text, line)))
        if (!live()) return true
        await notePreview(who)
        mem.hangUp()
        return true
    }

    // Every team's character introduces themselves first
    await mem.dialogue.play(character.intro)
    if (!live()) return true
    const asked = mem.party.flag(mem.id, "asked") || []
    const askTeam = async () => {
        await mem.dialogue.play([new Line(character.sprite, character.question, { choices: [{ label: mem.honestAnswer() }] })])
        if (!asked.includes(who)) await mem.party.setFlag(mem.id, "asked", [...asked, who])
    }

    if (mem.syncPartnerCall(who)) {
        // the partner game's last stage: they were waiting for this call, with its code
        await askTeam()
        const code = spokenCode(mem.team, who, mem.party.player?.name)
        if (live()) await mem.dialogue.play(character.expecting(code))
        // written down for the partner game's input, once
        if (live() && !pairState(mem.party, who).heard) {
            await setPairState(mem.party, who, { heard: code })
            mem.party.record("codes", codeName(mem.team, who, 2), code)
            // the last thing either the phone or the codes give toward the end
            mem.party.setBadge("codes", 2)
            mem.party.setBadge("contacts", 2)
        }
        // the code given, the phone goes back to the desktop, to take it to the partner game
        if (live()) {
            mem.hangUp()
            task.end()
        }
    } else if (!mem.isOwnTeam(who) && !pairState(mem.party, who).heard) {
        // asked once, then only turned away, until they have given a code for the partner game
        if (asked.includes(who)) await mem.dialogue.play(character.refuseAgain)
        else {
            await askTeam()
            if (live()) await mem.dialogue.play(character.refuse)
        }
        if (live()) mem.hangUp()
    } else if (!mem.isOwnTeam(who) || mem.party.stepsSolved(mem.id) >= 2) {
        // the own team once the code is solved, another once it gave its code: their questions
        const choice = await mem.dialogue.play(character.help)
        if (live() && choice?.reply) await mem.dialogue.play(choice.reply)
        if (live()) mem.hangUp()
    } else {
        if (!asked.includes(who)) await askTeam()
        if (!live()) return true
        await mem.dialogue.play(character.ask)
        if (!live()) return true
        await mem.party.solveStep(mem.id, 1)
        mem.dialogue.hide()
        mem.showCode(who)
    }
    return true
}

// A team's suit as a picture, in its color: the preview's portrait
function suitSprite(team) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${teams[team].path}" fill="${teams[team].color}"/></svg>`
    return "data:image/svg+xml," + encodeURIComponent(svg)
}

// Every team's preview heard: its text comes (Party's story.js). Before the party every team
// on the phone is a preview, so the contacts already kept count too.
async function notePreview(who) {
    const heard = new Set([...(mem.party.flag(mem.id, "previewed") || []), ...mem.contacts().map(contact => contact.who), who])
    const list = Object.keys(teams).filter(team => heard.has(team))
    if (list.length !== (mem.party.flag(mem.id, "previewed") || []).length) await mem.party.setFlag(mem.id, "previewed", list)
}

// The one answer to "which team": the truth
mem.honestAnswer = () => "Soy de " + (mem.party.teams[mem.team]?.name || "ningún equipo")

// Whether this is the call Sincronización Emparejada sends: to the partner team's number,
// once its last stage is reached
mem.syncPartnerCall = (who) => mem.team && mem.party.flag("sync", "pair") === who && (pairState(mem.party, who).stage || 0) >= 2

// Back to the dial. The back button has already taken its history step; any other way
// of hanging up takes it here.
mem.hangUp = (byBack = false) => {
    mem.callId++
    if (!byBack) leave(mem.callBack)
    mem.callBack = null
    mem.dialogue.stop()
    mem.showDial()
    // back on the dial: whatever the call won is told now
    mem.tellStory()
}
