import {getTask} from "/plexos/lib/functions/dll.js"
import {categoryBadge, setCategory} from "/plexos/app/game/Party/categories.js"
import {hintButton} from "/plexos/app/game/Party/hint.js"
import {storyButton, tellStory, showStory, storySeen} from "/plexos/app/game/Party/story.js"
import {gemSvg} from "/plexos/app/game/Party/gems.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.badge = categoryBadge("solo")
mem.root.querySelector(".badge-row").append(mem.badge, storyButton(task, mem.id))
// the won and complete texts wait for the black and the secret letter to be read (mem.answerPressed)
mem.tellStory = () => tellStory(task, mem.id, { hold: ["done", "complete"] })
mem.storySeen = (page) => storySeen(mem.id, page)
mem.showStory = (page) => showStory(task, mem.id, page)

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
    stamp.innerHTML = `<div class="env-stamp-face"><span class="stamp-card">${mem.party.player?.card || ""}</span><svg class="suit" viewBox="0 0 24 24"><path d="${team.path}" fill="#fff"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 56" class="queen-art"><defs><g id="queen-half"><path d="M15.3 13.1V9.6l1.5 1.5 1.3-2.8 1.5 2.4 1.5-3 1.4 3 1.4-2.4.9 2.5v3.3z"/><path d="M15.3 13.8c-1 2.6-.9 5.3.4 7.6.5.9.6 1.6.4 2.3-1.9.9-3.2 2.6-3.7 5h14.6c-.5-2.4-2.4-4.3-4.9-4.9l.1-2.6c.9 0 1.8-.3 2.4-.9.3-.3.3-.7 0-1 .2-.4.3-.8.1-1.4l.9-.5-.5-.6c-.7-.8-1.1-1.7-1.2-2.9z"/></g><g id="queen-cuts" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"><path d="M16.9 14.3c-.9 2.4-.7 4.9.6 7" stroke-width="0.75"/><path d="M16.4 24.1c2 1.4 3.9 1.4 5.7 0" stroke-width="0.75"/><path d="M15.6 11.9h8.3" stroke-width="0.6"/><circle cx="22.6" cy="16.9" r="0.35" fill="#000" stroke="none"/></g><path id="queen-heart" d="M0 1.7S-2.1.4-2.1-.9a1.1 1.1 0 0 1 2.1-.6 1.1 1.1 0 0 1 2.1.6C2.1.4 0 1.7 0 1.7z"/><g id="queen-index"><text x="4.2" y="7.4" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="6.6" text-anchor="middle">Q</text><use href="#queen-heart" transform="translate(4.2 11.4) scale(1.15)"/></g><mask id="queen-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="56"><rect width="40" height="56" fill="#fff"/><g transform="translate(20 28) scale(1.2) translate(-20 -28)"><use href="#queen-cuts"/><use href="#queen-cuts" transform="rotate(180 20 28)"/><path d="M9.5 32.6 30.5 23.4" stroke="#000" stroke-width="1.1" stroke-linecap="round"/></g></mask></defs><g fill="#5a1a24" mask="url(#queen-cut)"><g transform="translate(20 28) scale(1.2) translate(-20 -28)"><use href="#queen-half"/><use href="#queen-half" transform="rotate(180 20 28)"/></g></g><g fill="#5a1a24"><use href="#queen-index"/><use href="#queen-index" transform="rotate(180 20 28)"/></g></svg></div>`
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
