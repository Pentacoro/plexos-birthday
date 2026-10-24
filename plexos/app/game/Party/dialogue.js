import {blip} from "./sound.js"
import {t} from "./lang.js"
import Task from "/plexos/lib/classes/system/task.js"

// (NOMBRE) and (GRUPO) in a line are the player being spoken to: their name, their team's name
function fill(text) {
    const party = Task.get("Party")?.mem
    const player = party?.player
    return text
        .replaceAll("(NOMBRE)", player?.name || "")
        .replaceAll("(GRUPO)", t(party?.teams?.[player?.team]?.name || ""))
}

// Character dialogue, after the stage system in Male. A conversation is a list of lines.
// Each line types out letter by letter, pausing longer after "." and ",". A tap shows the
// rest of the line at once, the next tap moves on. A line can move on by itself after a
// delay (auto), offer choices, or run a script once it is left. Taps count anywhere in the
// container, not only on the box.
// A sprite is a picture's path, or a character's pair of faces: { talking, rest }, the one
// shown while a line types and the one it stays on once it stops.
export class Line {
    constructor(sprite, text, params = {}) {
        this.sprite  = sprite
        this.text    = text
        this.speed   = params.speed ?? 35
        this.auto    = params.auto
        this.choices = params.choices
        this.script  = params.script
        this.hide    = params.hide   // slide sprite out to the right when this line starts
        this.show    = params.show   // slide sprite back in when this line starts
    }
}

export class Dialogue {
    constructor(container) {
        this.node = document.createElement("div")
        this.node.className = "dialogue"
        this.node.hidden = true
        this.run = 0

        // The box sits at the top, the portrait under it at the right, and choices at the
        // bottom, so the question stays in view while one is picked
        this.stage = document.createElement("div")
        this.stage.className = "dialogue-stage"
        this.sprite = document.createElement("img")
        this.sprite.className = "dialogue-sprite"
        this.sprite.alt = ""
        this.stage.append(this.sprite)

        this.box = document.createElement("div")
        this.box.className = "dialogue-box"
        this.name = document.createElement("div")
        this.name.className = "dialogue-name"
        this.text = document.createElement("span")
        this.text.className = "dialogue-text"
        this.box.append(this.name, this.text)

        this.choices = document.createElement("div")
        this.choices.className = "dialogue-choices"

        this.node.append(this.box, this.stage, this.choices)
        container.append(this.node)

        // A tap anywhere in the window steps it on, but on a button, which keeps its own job (a
        // choice, the badge). pointerdown, so one tap is always one step.
        container.addEventListener("pointerdown", e => {
            if (this.node.hidden || !this.tap || e.target.closest("button, [role=button]")) return
            e.preventDefault()
            this.tap()
        })
    }

    setFace(face) {
        if (!face) return
        this.face = face
        const { talking, rest } = typeof face === "string" ? { talking: face, rest: face } : face
        // loaded ahead, so the switch never blinks out
        for (const src of [talking, rest]) new Image().src = src
        this.frames = { talking, rest }
        this.sprite.src = rest
    }

    show(character) {
        this.voice = character.voice
        this.setFace(character.sprite)
        this.name.textContent = character.name || ""
        this.name.hidden = !character.name
        this.characterTeam = character.team || null
        this.node.hidden = false
        // restart the entrance, so every call slides the portrait in from the right
        this.sprite.classList.remove("entering")
        void this.sprite.offsetWidth
        this.sprite.classList.add("entering")
    }

    hide() {
        this.node.hidden = true
        this.node.classList.remove("speaking", "waiting")
    }

    // Resolves when the last line is left, with the choice taken, if any: the option's
    // value when it has one, otherwise the whole option (so an option can carry its own reply)
    async play(lines) {
        const run = ++this.run
        let choice
        for (const line of lines) {
            choice = await this.say(line)
            if (run !== this.run) return
            line.script?.(choice)
        }
        return choice
    }

    // Cuts the conversation short: the line being said ends and play() returns nothing
    stop() {
        this.run++
        this.abort?.()
        this.hide()
    }

    say(line) {
        this.setFace(line.sprite || this.face)
        if (line.hide) {
            this.sprite.classList.remove("entering")
            void this.sprite.offsetWidth
            this.sprite.classList.add("leaving")
        } else if (line.show) {
            this.sprite.classList.remove("leaving", "entering")
            void this.sprite.offsetWidth
            this.sprite.classList.add("entering")
        }
        if (this.frames) this.sprite.src = this.frames.talking
        // in the player's language, typed out as it will read
        const text = fill(t(line.text))
        this.text.replaceChildren()
        this.choices.replaceChildren()
        this.node.classList.remove("waiting")
        this.node.classList.add("speaking")

        // Split around (ITEM) to inline the team's item icon
        const itemSrc = this.characterTeam
            ? `/plexos/app/game/Party/img/item-${this.characterTeam}.svg`
            : null
        const parts = itemSrc ? text.split("(ITEM)") : [text]
        const tokens = []
        parts.forEach((seg, i) => {
            for (const ch of seg) tokens.push(ch)
            if (i < parts.length - 1) tokens.push({ img: itemSrc })
        })

        return new Promise(resolve => {
            let shown = 0
            let timer = null
            let textNode = document.createTextNode("")
            this.text.append(textNode)

            const appendToken = (token) => {
                if (typeof token === "string") {
                    textNode.textContent += token
                } else {
                    const wrap = document.createElement("span")
                    wrap.className = "dialogue-item"
                    const img = document.createElement("img")
                    img.src = token.img
                    img.className = "dialogue-item-icon"
                    img.alt = ""
                    wrap.append("(", img, ")")
                    this.text.append(wrap)
                    textNode = document.createTextNode("")
                    this.text.append(textNode)
                }
            }

            const buildAll = () => {
                this.text.replaceChildren()
                textNode = document.createTextNode("")
                this.text.append(textNode)
                for (const token of tokens) appendToken(token)
            }

            const finish = () => {
                clearTimeout(timer)
                shown = tokens.length
                buildAll()
                if (this.frames) this.sprite.src = this.frames.rest
                this.node.classList.remove("speaking")
                if (line.choices) return offer()
                if (line.auto !== undefined) {
                    this.tap = null
                    timer = setTimeout(leave, line.auto)
                    return
                }
                this.node.classList.add("waiting")
                this.tap = leave
            }
            const leave = (value) => {
                this.tap = null
                this.abort = null
                this.node.classList.remove("waiting")
                resolve(value)
            }
            this.abort = () => {
                clearTimeout(timer)
                leave()
            }
            const offer = () => {
                this.tap = null
                for (const option of line.choices) {
                    const button = document.createElement("button")
                    button.type = "button"
                    button.textContent = t(option.label)
                    button.addEventListener("pointerdown", e => {
                        e.preventDefault()
                        leave(option.value ?? option)
                    })
                    this.choices.append(button)
                }
            }
            const type = () => {
                if (shown >= tokens.length) return finish()
                const token = tokens[shown++]
                appendToken(token)
                const letter = typeof token === "string" ? token : ""
                // each letter in the speaker's voice, the spaces and marks silent
                if (/[\p{L}\p{N}]/u.test(letter)) blip(this.voice)
                if (this.frames) this.sprite.src = letter === "." ? this.frames.rest : this.frames.talking
                const delay = typeof token !== "string" ? 0 : (letter === "." || letter === ",") ? line.speed * 6 : line.speed
                timer = setTimeout(type, delay)
            }

            this.tap = finish
            type()
        })
    }
}
