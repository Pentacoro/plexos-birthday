import {getTask} from "/plexos/lib/functions/dll.js"
import {random, pairName, spokenCode} from "/plexos/app/game/Sync/pairs.js"
import {pathPuzzle, stackPuzzle} from "/plexos/app/game/Sync/generate.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A tester marked "everything" in players.js starts with the whole game done, the first time
// they log in: every puzzle finished, every contact, item, letter, maze and code kept, every
// folder's badge complete. They also count as Mariana (her letter) and Pentacoro (the decoder).
const teamKeys = ["spades", "hearts", "clubs", "diamonds"]
// each team's phone number, as Fibonacci makes it: two digits, then each the sum of the two before
const seeds = { spades: "27", hearts: "19", clubs: "10", diamonds: "99" }
function sequence(seed) {
    let a = Number(seed[0]), b = Number(seed[1]), digits = seed
    while (digits.length < 7) {
        const next = a + b
        a = b
        b = next
        digits += String(next)
    }
    return digits.slice(0, 7)
}

const items = {
    spades:   "5 (por definir)",
    hearts:   "12 Bombones",
    clubs:    "7 Pesos",
    diamonds: "3 Piezas de Cubo Rubik",
}
const img = (name) => "/plexos/app/game/Party/img/" + name + ".svg"

mem.unlockEverything = async () => {
    if (!mem.player?.everything || mem.progress.flags.everything) return
    const me = mem.player
    const team = me.team
    const others = teamKeys.filter(key => key !== team)
    const answers = { 0: mem.teams[team].name.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, ""), 1: mem.players.find(p => p.team === team && p.name !== me.name)?.password || "" }
    const otherTeams = Object.fromEntries(others.map(key => [key, mem.players.find(p => p.team === key && !p.everything)?.password]))

    // every puzzle done
    Object.assign(mem.progress.steps, { fibonacci: 2, webdetective: 2, labyrinth: 1, sync: 1 })
    const contacts = [{ who: "intro", number: "1123581" }, ...teamKeys.map(key => ({ who: key, number: sequence(seeds[key]) })), { who: "void", number: "0000000" }]
    const pairs = Object.fromEntries(teamKeys.map(key => [key, {
        stage: 2, cleared: 2, done: true, ...(key === team ? { role: "tecleador" } : {}),
        heard: spokenCode(team, key, me.name),
    }]))
    Object.assign(mem.progress.flags, {
        fibonacci: { introCalled: true, hintRetired: true, contacts, asked: teamKeys, voidCalled: true },
        webdetective: { received: ["0", "0w", "1", "1w", "final", "secret", "queen"], otherTeams, answers },
        labyrinth: { done: true, passed: ["first", "artifact", "second", "third"], packages: ["first:spades", "first:hearts", "first:clubs", "artifact:diamonds"] },
        sync: { pair: team, pairs },
        everything: true,
    })
    await mem.saveProgress()

    // every file kept, quietly
    const quiet = { quiet: true }
    const names = { intro: "Fibonacci", void: "Desconocido" }
    for (const { who, number } of contacts) {
        const image = who === "intro" ? "/plexos/app/game/Fibonacci/icon.svg" : img("contact-" + who)
        await mem.record("contacts", names[who] || mem.teams[who].name, number, { detail: number, image, ...quiet })
    }
    for (const key of teamKeys) await mem.record("items", items[key], key, { detail: "Objeto", image: img("item-" + key), ...quiet })
    const final = Object.values(otherTeams).join(" · ")
    for (const [title, key, look, detail] of [
        ["Carta 1", "0", "letter-1", answers[0]], ["Carta 1 (Incorrecto)", "0w", "letter-1-wrong", answers[0]],
        ["Carta 2", "1", "letter-2-" + (["spades", "clubs"].includes(team) ? "teal" : "purple"), answers[1]], ["Carta 2 (Incorrecto)", "1w", "letter-2-wrong", answers[1]],
        ["Carta Final", "final", "letter-final", final], ["Carta Secreta", "secret", "letter-secret-" + team, " "],
        ["Carta de Pentacoro", "queen", "letter-queen", " "],
    ]) await mem.record("letters", title, key, { detail, image: img(look), ...quiet })
    for (const [title, maze] of [["Laberinto 1", "first"], ["Laberinto del Artefacto", "artifact"], ["Laberinto 2", "second"], ["Laberinto 3", "third"]]) {
        await mem.record("mazes", title, maze, { image: img("maze-" + maze), ...quiet })
    }
    for (const key of teamKeys) {
        const pair = pairName(team, key)
        const name = mem.teams[key].name
        await mem.record("codes", name + " - Código 1", pathPuzzle(random(pair + ":path")).code, quiet)
        await mem.record("codes", name + " - Código 2", stackPuzzle(random(pair + ":stack")).solution.join(""), quiet)
        await mem.record("codes", name + " - Código 3", pairs[key].heard, quiet)
    }
    for (const kind of ["contacts", "letters", "mazes", "codes"]) await mem.setBadge(kind, 3)
}
