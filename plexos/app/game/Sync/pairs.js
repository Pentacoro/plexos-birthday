// Sincronización Emparejada is played by two people from different teams, each on their own
// phone, with nothing passing between the phones. Both build the same puzzles from the pair's
// name, so whatever one sees matches what the other needs. Fibonacci reads the call codes here.

// The pair's name, the same from both sides, seeds its puzzles
export const order = ["spades", "clubs", "diamonds", "hearts"]
export const pairName = (a, b) => [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join("-")
// Who leads (plays side 1) in each pairing, so every team gets both sides: spades and diamonds
// lead twice, clubs and hearts once
const leads = {
    "spades-clubs": "spades", "spades-diamonds": "diamonds", "spades-hearts": "spades",
    "clubs-diamonds": "clubs", "clubs-hearts": "hearts", "diamonds-hearts": "diamonds",
}
export const sideOf = (team, partner) => leads[pairName(team, partner)] === team ? 1 : 2
// the two, side 1 first
const sides = (a, b) => sideOf(a, b) === 1 ? [a, b] : [b, a]

// A kept code's file name, the same on both phones: the suits side 1 first, then the stage's.
// U+FE0E keeps each suit a plain character, as phones would draw them as emoji.
const suits = { spades: "♠", hearts: "♥", clubs: "♣", diamonds: "♦" }
const codeStages = ["Colors", "Stacks", "Final"]
const plain = "\uFE0E"
export const codeName = (a, b, stage) => sides(a, b).map(team => suits[team] + plain).join(" ⇋ ") + " | " + codeStages[stage]

// Where a kept code sorts in its folder, by stage and then by pair; null if it isn't one
export function codeRank(name) {
    const [pair, kind = ""] = name.split(" | ")
    const stage = kind.split(".")[0]
    const teams = (pair || "").split(" ⇋ ").map(each => Object.keys(suits).find(team => suits[team] + plain === each))
    if (!codeStages.includes(stage) || teams.length !== 2 || !teams.every(Boolean)) return null
    return codeStages.indexOf(stage) * 20 + order.indexOf(teams[0]) * 4 + order.indexOf(teams[1])
}

// The same numbers on both phones: a generator seeded by a name
export function random(name) {
    let seed = 2166136261
    for (const char of name) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619)
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
export const pick = (rand, list) => list[Math.floor(rand() * list.length)]
export function shuffle(rand, list) {
    const out = [...list]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

// Each pair keeps its own progress in the Party's flags: sync.pairs[partner] = { stage, cleared,
// heard, role, done }, with sync.pair the one being played
export const pairState = (party, partner) => party.flag("sync", "pairs")?.[partner] || {}
export const setPairState = (party, partner, patch) =>
    party.setFlag("sync", "pairs", { ...party.flag("sync", "pairs"), [partner]: { ...pairState(party, partner), ...patch } })

// What the partner team's Fibonacci character tells a caller in the last stage, and what that
// caller then types. Each player of the pair gets their own; paired with their own team, each
// player's is their own too, not just their team's.
export function callCode(caller, partner, player = "") {
    const rand = random("call:" + caller + (caller === partner ? ":" + player : "") + ">" + partner)
    return Array.from({ length: 3 }, () => Math.floor(rand() * 10)).join("")
}

// Artifact 4, hidden in the storage room: a card for hearts that turns symbols into numbers,
// with a column for each team, their own included, since hearts can pair with hearts. In the
// last stage, the partner's character tells hearts their code in that team's symbols. Caja
// Fuerte's fifth stage reads it too, every team in its own column. Index = number.
export const artifactSymbols = {
    spades:   ["#", "?", "+", "/", "!", "&", "%", "@", "<", ">", "-"],
    hearts:   ["%", "<", "/", "@", "#", "!", ">", "&", "-", "?", "+"],
    clubs:    ["@", "!", "-", "&", "<", "%", "?", ">", "#", "+", "/"],
    diamonds: ["&", ">", "#", "%", "+", "-", "/", "<", "?", "!", "@"],
}

// The code as the partner's character says it: hearts hears it ciphered in that team's column
export const spokenCode = (caller, partner, player = "") => {
    const code = callCode(caller, partner, player)
    return caller === "hearts" && artifactSymbols[partner] ? [...code].map(digit => artifactSymbols[partner][digit]).join("") : code
}
