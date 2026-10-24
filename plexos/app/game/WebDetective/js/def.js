import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"
import {letters, wrong, finished, final, secret, queen} from "./letters.js"
import {players} from "/plexos/app/game/Party/players.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party = Task.get("Party").mem
mem.id    = "webdetective"
// No step has a hint in the book: the second is solved with a teammate. Entries per team, if
// one is ever added: { hearts: 2, ... }
mem.hintEntries = {}
mem.hintStep = 1
mem.team  = mem.party.player?.team || null

mem.letters  = letters
mem.wrong    = wrong
mem.finished = finished

// Passwords for each team, one entry per step. For testing, the team's name: replace them.
// Letters (Ñ included) and digits only, as the typewriter has no other keys.
// Step 2 (spades) is answered with their own code from the artifact table, not from here.
mem.passwords = [
    { spades: "CROWNFISH",  hearts: "SIGNALIS", clubs: "BURG", diamonds: "849" },
    { spades: "PICAS2", hearts: "ROR2",     clubs: "TURKEY",    diamonds: "GDICOMM" },
]
const me = mem.party.player?.name
const self = players.find(player => player.name === me)
// Whose a password is: another player's, by their real password or by the fake one their second
// letter gave them, which works just the same; which of the two it was is kept (the results)
mem.whoseEntry = (entry) => {
    for (const player of players) {
        if (player.name === me) continue
        if (player.password === entry) return { player, kind: "real" }
        if (player.fake === entry) return { player, kind: "fake" }
    }
    return null
}
const teamOfPassword = mem.teamOfEntry = (entry) => mem.whoseEntry(entry)?.player.team
// the player's own code on spades' artifact, the papers: it opens the second letter too
mem.ownCode = self?.code || null

// Steps 0 and 1 are solo (each team has their own answer). Step 1 for spades needs their
// artifact. Step 2 needs a password from someone on the player's own team.
mem.categoryOf = (step) => {
    if (step === 0) return "solo"
    if (step === 1) return mem.team === "spades" ? "artifact" : "solo"
    return "teams"
}
mem.artifactPlace = "patio"   // where the artifact is hidden, for its badge
mem.artifactPhotos = [
    "/plexos/app/game/WebDetective/img/artifact-1.png",
    "/plexos/app/game/WebDetective/img/artifact-2.png",
]

// A player without a team (only while testing) gets the first team's
const teamOf = (entry) => entry[mem.team] ?? Object.values(entry)[0]
mem.passwordOf = (step) => teamOf(mem.passwords[step])
// after the last step comes the final letter, and after it, maybe, the secret one
mem.isFinal = (step) => step === mem.letters.length
mem.isSecret = (step) => step === mem.letters.length + 1
// and, only for Mariana, the letter that answers her heart
mem.isQueen = (step) => step === mem.letters.length + 2
mem.isMariana = mem.party.player?.name === "Mariana" || !!mem.party.player?.everything
// Placeholders a letter can use:
// {falsa}  — the player's own fake password (given in the third letter)
// {nombre} — the player's name
// {card}   — the player's card, e.g. "7♣"
// {card2}  — the card of the teammate whose password answered the third letter
const suitSymbol = { spades: "♠", hearts: "♥", clubs: "♣", diamonds: "♦" }
const cardLabel = (player) => player ? player.card + (suitSymbol[player.team] || "") : ""
mem.letterOf = (step) => {
    const raw = mem.isQueen(step) ? queen : teamOf(mem.isSecret(step) ? secret : mem.isFinal(step) ? final : mem.letters[step])
    const entries = mem.party.flag(mem.id, "entries") || []
    const step2 = entries.find(e => e.step === 2)
    const card2Player = step2?.from ? players.find(p => p.name === step2.from) : null
    return raw
        .replaceAll("{falsa}", self?.fake || "")
        .replaceAll("{nombre}", self?.name || "")
        .replaceAll("{card}", cardLabel(self))
        .replaceAll("{card2}", cardLabel(card2Player))
}
// how a letter is answered: a password in dashes, a heart (any key sends it), or free writing
mem.writing = (step) => mem.isQueen(step) ? "free" : mem.isSecret(step) ? "hearts" : "password"

// The final letter is answered with login passwords of players of other teams, one team at a
// time; each one taken stays written on its page. Three teams, and the secret letter comes.
mem.otherTeams = () => mem.party.flag(mem.id, "otherTeams") || {}
mem.answerLength = (step) => {
    if (step === 0) return mem.passwordOf(0).length
    if (step === 1) return mem.team === "spades" ? 3 : mem.passwordOf(1).length
    return 3
}
mem.accepts = (step, entry) => {
    if (step === 0) return entry === mem.passwordOf(0)
    if (step === 1) return mem.team === "spades" ? (!!mem.ownCode && entry === mem.ownCode) : entry === mem.passwordOf(1)
    const team = teamOfPassword(entry)
    if (step < mem.letters.length) return team === mem.team   // step 2: own team member password
    return !!team && team !== mem.team && !(team in mem.otherTeams())
}

mem.step  = 0
mem.view  = "mail"
mem.busy  = false
mem.entry = ""

mem.root  = task.node.querySelector(".puzzle")
mem.stage = mem.root.querySelector(".stage")
