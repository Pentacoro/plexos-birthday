import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Two starting digits, then each number is the sum of the two before it, all written
// one after another: 2, 7, 9, 16, 25 reads 2791625. A phone number is its first digits.
mem.sequence = (seed) => {
    let a = Number(seed[0])
    let b = Number(seed[1])
    let digits = seed
    while (digits.length < mem.numberLength) {
        const next = a + b
        a = b
        b = next
        digits += String(next)
    }
    return digits.slice(0, mem.numberLength)
}

mem.teamNumber = (team) => mem.sequence(mem.seeds[team].seed)

// Who picks up a number: "intro", a team, or nobody
mem.answererOf = (number) => {
    if (number === mem.introNumber) return "intro"
    return Object.keys(mem.seeds).find(team => mem.teamNumber(team) === number) || null
}

// A player with no team yet (only while testing) belongs to whichever team they call
mem.isOwnTeam = (team) => !mem.team || mem.team === team

mem.teamCode = (team) => mem.codeParts[team]
    .map(part => part === "artifact" ? mem.artifactCode : mem.party.teams[part].code)
    .join("")
