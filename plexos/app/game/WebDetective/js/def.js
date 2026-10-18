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

// The first step's password for each team. For testing, the team's name: replace them.
// Letters (Ñ included) and digits only, as the typewriter has no other keys. The second step's
// is the login password of any teammate.
mem.passwords = [
    { spades: "PICAS", hearts: "CORAZONES", clubs: "TREBOLES", diamonds: "DIAMANTES" },
]
const me = mem.party.player?.name
const teamOfPassword = mem.teamOfEntry = (password) => players.find(player => player.password === password && player.name !== me)?.team

// The first step is solved alone. The second needs the password from someone of the own team;
// spades also needs their artifact there.
mem.categoryOf = (step) => step === 0 ? "solo" : mem.team === "spades" ? "artifact" : "teams"
mem.artifactPlace = "kitchen"   // where the artifact is hidden, for its badge
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
mem.letterOf = (step) => mem.isQueen(step) ? queen : teamOf(mem.isSecret(step) ? secret : mem.isFinal(step) ? final : mem.letters[step])
// how a letter is answered: a password in dashes, a heart (any key sends it), or free writing
mem.writing = (step) => mem.isQueen(step) ? "free" : mem.isSecret(step) ? "hearts" : "password"

// The final letter is answered with login passwords of players of other teams, one team at a
// time; each one taken stays written on its page. Three teams, and the secret letter comes.
mem.otherTeams = () => mem.party.flag(mem.id, "otherTeams") || {}
mem.answerLength = (step) => step === 0 ? mem.passwordOf(0).length : 3
mem.accepts = (step, entry) => {
    if (step === 0) return entry === mem.passwordOf(0)
    const team = teamOfPassword(entry)
    if (step === 1) return team === mem.team
    return !!team && team !== mem.team && !(team in mem.otherTeams())
}

mem.step  = 0
mem.view  = "mail"
mem.busy  = false
mem.entry = ""

mem.root  = task.node.querySelector(".puzzle")
mem.stage = mem.root.querySelector(".stage")
