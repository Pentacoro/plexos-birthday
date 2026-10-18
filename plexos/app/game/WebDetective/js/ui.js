import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"
import {gemSvg} from "/plexos/app/game/Party/gems.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badge = categoryBadge("solo")
mem.root.querySelector(".badge-row").append(mem.badge)

// the hint button only exists for teams with a hint, and only shows on its step
const hintEntry = mem.hintEntries[mem.team]
if (hintEntry) {
    mem.hint = hintButton(hintEntry)
    mem.hint.hidden = true
    mem.root.querySelector(".badge-row").append(mem.hint)
}

mem.setStepCategory = (step) => {
    const category = mem.categoryOf(step)
    setCategory(mem.badge, category, category === "artifact" ? { photos: mem.artifactPhotos, place: mem.artifactPlace } : {})
    if (mem.hint) {
        mem.hint.classList.remove("open")
        mem.hint.hidden = step !== mem.hintStep
    }
}

mem.envBack     = mem.stage.querySelector(".env-back")
mem.envFront    = mem.stage.querySelector(".env-front")
mem.envFlap     = mem.stage.querySelector(".env-flap")
mem.letter      = mem.stage.querySelector(".letter")
mem.letterText  = mem.stage.querySelector(".letter-text")
mem.slotsRow    = mem.stage.querySelector(".answer-slots")
mem.foldHalf    = mem.stage.querySelector(".half-fold")
// The team's stamp on the envelope: their color, their suit in white, perforated edges
const team = mem.party.teams[mem.team]
// the secret letter's envelope takes the team's color
if (team) mem.stage.style.setProperty("--team-color", team.color)
if (team) {
    const stamp = document.createElement("div")
    stamp.className = "env-stamp"
    stamp.style.setProperty("--team", team.color)
    // the team's suit, and, kept for Mariana's velvet letter, the Queen of Hearts in foil
    stamp.innerHTML = `<div class="env-stamp-face"><span class="stamp-card">${mem.party.player?.card || ""}</span><svg class="suit" viewBox="0 0 24 24"><path d="${team.path}" fill="#fff"/></svg><svg class="queen-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 7 8.6 3.6l1.9 2.3L12 3l1.5 2.9 1.9-2.3L16.5 7z"/><ellipse cx="12" cy="10.6" rx="3.1" ry="3.5"/><path d="M8.9 9.3c-.5 3.4.1 5.6-1.3 7.6M15.1 9.3c.5 3.4-.1 5.6 1.3 7.6"/><path d="M10.7 10.2h.8M12.5 10.2h.8M11.3 12.3q.7.5 1.4 0"/><path d="M10.6 14v1.6M13.4 14v1.6M5.5 22c.6-3.8 3.2-5.8 6.5-5.8s5.9 2 6.5 5.8"/><path d="M9.6 16.6 12 19.4l2.4-2.8"/><path d="M17 18.3c-.5-.6-1.5-.4-1.5.4 0 .9 1.5 1.8 1.5 1.8s1.5-.9 1.5-1.8c0-.8-1-1-1.5-.4z"/></svg></div>`
    mem.envFront.append(stamp)
}

// The seal on the flap: plain red on letters that arrive, the team's own on replies they send
mem.envSeal = mem.envFlap.querySelector(".env-seal")
if (team) {
    mem.envSeal.style.setProperty("--team", team.color)
    mem.envSeal.innerHTML = `<svg viewBox="0 0 24 24"><path d="${team.path}"/></svg>` + gemSvg(mem.team, team.color)
}

mem.investigate = mem.stage.querySelector(".investigate")
mem.typebars    = mem.stage.querySelector(".typebars")
mem.machine     = mem.stage.querySelector(".machine")
mem.keys        = mem.stage.querySelector(".keys")
mem.sendButton  = mem.stage.querySelector(".send")
mem.doneNote    = mem.stage.querySelector(".done-note")

// The typewriter's keys, row by row. Each key strikes with the typebar under its column.
mem.keyRows = ["1234567890", "QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"]
mem.barCount = 15
mem.keyRows.forEach((row, r) => {
    const line = document.createElement("div")
    line.className = "key-row"
    ;[...row].forEach((char, c) => {
        const key = document.createElement("button")
        key.type = "button"
        key.className = "key"
        key.textContent = char
        key.dataset.char = char
        key.dataset.bar = Math.round((c + (r % 2) * 0.5) / 10.5 * (mem.barCount - 1))
        line.append(key)
    })
    if (r === mem.keyRows.length - 1) {
        const erase = document.createElement("button")
        erase.type = "button"
        erase.className = "key erase"
        erase.dataset.erase = "1"
        erase.setAttribute("aria-label", "Borrar")
        erase.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M9 5h11v14H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>`
        line.append(erase)
    }
    mem.keys.append(line)
})
// for writing freely (only Mariana's last letter): punctuation and a space bar
const extra = document.createElement("div")
extra.className = "key-row extra"
for (const [char, label, bar] of [[",", ",", 3], [".", ".", 4], [" ", "espacio", 7]]) {
    const key = document.createElement("button")
    key.type = "button"
    key.className = "key" + (char === " " ? " space" : "")
    key.textContent = label
    key.dataset.char = char
    key.dataset.bar = bar
    extra.append(key)
}
mem.keys.append(extra)

// A fan of typebars meeting at the strike point, each rising from the top edge of the machine.
// At rest only their lower part shows, like the basket of a real typewriter; a strike
// stretches one up to the page.
for (let i = 0; i < mem.barCount; i++) {
    const bar = document.createElement("div")
    bar.className = "bar"
    bar.dataset.angle = -52 + 104 * i / (mem.barCount - 1)
    bar.style.setProperty("--angle", bar.dataset.angle + "deg")
    const arm = document.createElement("div")
    arm.className = "bar-arm"
    bar.append(arm)
    mem.typebars.append(bar)
}
mem.bars = [...mem.typebars.children]
