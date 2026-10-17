// Character dialogue, after the stage system in Male. A conversation is a list of lines.
// Each line types out letter by letter, pausing longer after "." and ",". A tap shows the
// rest of the line at once, the next tap moves on. A line can move on by itself after a
// delay (auto), offer choices, or run a script once it is left.
export class Line {
    constructor(sprite, text, params = {}) {
        this.sprite  = sprite
        this.text    = text
        this.speed   = params.speed ?? 35
        this.auto    = params.auto
        this.choices = params.choices
        this.script  = params.script
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

        // pointerdown, so one tap is always one step
        this.box.addEventListener("pointerdown", e => {
            e.preventDefault()
            this.tap?.()
        })
    }

    show(character) {
        this.sprite.src = character.sprite || ""
        this.name.textContent = character.name || ""
        this.name.hidden = !character.name
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
        if (line.sprite) this.sprite.src = line.sprite
        this.text.textContent = ""
        this.choices.replaceChildren()
        this.node.classList.remove("waiting")
        this.node.classList.add("speaking")

        return new Promise(resolve => {
            let shown = 0
            let timer = null

            const finish = () => {
                clearTimeout(timer)
                shown = line.text.length
                this.text.textContent = line.text
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
                    button.textContent = option.label
                    button.addEventListener("pointerdown", e => {
                        e.preventDefault()
                        leave(option.value ?? option)
                    })
                    this.choices.append(button)
                }
            }
            const type = () => {
                if (shown >= line.text.length) return finish()
                const letter = line.text.charAt(shown++)
                this.text.textContent += letter
                timer = setTimeout(type, (letter === "." || letter === ",") ? line.speed * 6 : line.speed)
            }

            this.tap = finish
            type()
        })
    }
}
