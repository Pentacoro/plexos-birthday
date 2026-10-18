// Every sound in the game, in one place. null plays the one made on the spot below; a path from
// the site root ("/plexos/app/game/Party/sounds/notice.mp3") or a full URL plays that file
// instead; false keeps it silent.
export const sounds = {
    notice:      false,  // a notice sliding up when something is kept (contact, letter, maze, code)
    voice:       null,   // a character talking, once per letter (made: each character's own pitch)
    wrong:       null,   // a wrong answer or a bump: password, phone, labyrinth, Sync, Detective Web
    typeKey:     null,   // Detective Web: a key on the typewriter
    carriage:    null,   // Detective Web: the carriage ratcheting back as an answer is sent
    step:        null,   // Labyrinth: a step
    voidCall:    null,   // the sound from the void, after the secret number
    dialGrab:    null,   // Fibonacci: a finger takes the dial
    dialRatchet: null,   // Fibonacci: the dial wound one hole further
    dialStop:    null,   // Fibonacci: the dial hits the finger stop
    dialPulse:   null,   // Fibonacci: one pulse per hole as the dial winds back
    dialRest:    null,   // Fibonacci: the dial comes to rest
    keypad:      null,   // Fibonacci: a key on the pad (made: that digit's touch-tone)
}

// A sound given a file, or silenced: true once handled, so the made one doesn't play too
function replaced(name, at = 0) {
    const src = sounds[name]
    if (src === false) return true
    if (!src) return false
    setTimeout(() => new Audio(src).play().catch(() => {}), at * 1000)
    return true
}

// Sound effects made on the spot with Web Audio, so no files need loading. One context for
// the whole game. Phones only let it play after a touch, so each sound wakes it first.
let context = null
let noise = null

// Started by the first touch anywhere, so a sound that comes later on its own (a notice after a
// save) can still play
for (const type of ["pointerdown", "keydown"]) document.addEventListener(type, () => audio(), { once: true, capture: true })

export function audio() {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)()
    if (context.state === "suspended") context.resume()
    return context
}

// A second of white noise, the raw stuff of clicks and whirs
function noiseBuffer(ctx) {
    if (noise) return noise
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return noise
}

// A short burst of noise through a band filter: higher bands click, lower ones knock
export function click({ at = 0, freq = 2500, q = 4, gain = 0.4, length = 0.03 } = {}) {
    const ctx = audio(), t = ctx.currentTime + at
    const source = ctx.createBufferSource()
    source.buffer = noiseBuffer(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = freq
    filter.Q.value = q
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(gain, t)
    amp.gain.exponentialRampToValueAtTime(0.001, t + length)
    source.connect(filter).connect(amp).connect(ctx.destination)
    source.start(t, Math.random() * 0.9, length + 0.01)
}

// Plain tones mixed together, rising and falling softly at the ends
export function tone(freqs, { at = 0, length = 0.15, gain = 0.15, type = "sine" } = {}) {
    const ctx = audio(), t = ctx.currentTime + at
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0, t)
    amp.gain.linearRampToValueAtTime(gain, t + 0.008)
    amp.gain.setValueAtTime(gain, t + length - 0.02)
    amp.gain.linearRampToValueAtTime(0, t + length)
    amp.connect(ctx.destination)
    for (const freq of freqs) {
        const osc = ctx.createOscillator()
        osc.type = type
        osc.frequency.value = freq
        osc.connect(amp)
        osc.start(t)
        osc.stop(t + length + 0.01)
    }
}

// A void: a low drone that swells out of nothing with a breath of noise, wavers, and is gone
export function voidSound(length = 3.2) {
    if (replaced("voidCall")) return
    const ctx = audio(), t = ctx.currentTime
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0.0001, t)
    amp.gain.exponentialRampToValueAtTime(0.5, t + length * 0.45)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + length)
    amp.connect(ctx.destination)
    for (const [freq, drift] of [[41, -6], [61.5, 4], [82, -9]]) {
        const osc = ctx.createOscillator()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, t)
        osc.frequency.linearRampToValueAtTime(freq + drift, t + length)
        osc.connect(amp)
        osc.start(t)
        osc.stop(t + length)
    }
    const source = ctx.createBufferSource()
    source.buffer = noiseBuffer(ctx)
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(180, t)
    filter.frequency.exponentialRampToValueAtTime(900, t + length * 0.5)
    filter.frequency.exponentialRampToValueAtTime(120, t + length)
    const breath = ctx.createGain()
    breath.gain.value = 0.25
    source.connect(filter).connect(breath).connect(amp)
    source.start(t)
    source.stop(t + length)
}

// A character's voice, one blip per letter, as in Undertale: a short tone in their own timbre and
// pitch, a little different each time. voice: { type, freq, jitter, glide, gain, filter }
let lastBlip = 0
export function blip(voice) {
    if (!voice || replaced("voice")) return
    const ctx = audio(), t = ctx.currentTime
    if (t - lastBlip < 0.035) return
    lastBlip = t
    const osc = ctx.createOscillator()
    osc.type = voice.type || "square"
    const freq = voice.freq * (1 + (Math.random() - 0.5) * (voice.jitter ?? 0.08))
    osc.frequency.setValueAtTime(freq, t)
    if (voice.glide) osc.frequency.linearRampToValueAtTime(freq * (1 + voice.glide), t + 0.05)
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0.0001, t)
    amp.gain.exponentialRampToValueAtTime(voice.gain ?? 0.08, t + 0.005)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + (voice.length ?? 0.055))
    let out = osc
    if (voice.filter) {
        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = voice.filter
        out = osc.connect(filter)
    }
    out.connect(amp).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + (voice.length ?? 0.055) + 0.02)
}

// a quick pitch drop, the body of a knock
function thump({ at = 0, from = 140, to = 50, gain = 0.4, length = 0.12 } = {}) {
    const ctx = audio(), t = ctx.currentTime + at
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(from, t)
    osc.frequency.exponentialRampToValueAtTime(to, t + length)
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(gain, t)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + length)
    osc.connect(amp).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + length + 0.02)
}

// A typewriter key: the bar's sharp strike on the page and the thunk of the machine
export function typeKey() {
    if (replaced("typeKey")) return
    click({ freq: 3600, q: 3, gain: 0.3, length: 0.018 })
    click({ at: 0.006, freq: 420, q: 1.5, gain: 0.35, length: 0.05 })
}

// The line done: the carriage ratchets back
export function carriageReturn() {
    if (replaced("carriage")) return
    for (let i = 0; i < 7; i++) click({ at: i * 0.03, freq: 2800, q: 5, gain: 0.12, length: 0.015 })
}

// A step in the maze, soft and short
export function step() {
    if (replaced("step")) return
    click({ freq: 650, q: 1.6, gain: 0.22, length: 0.035 })
    thump({ from: 180, to: 90, gain: 0.12, length: 0.05 })
}

// Wrong: a very brief double buzz
export function wrong() {
    if (replaced("wrong")) return
    for (const at of [0, 0.085]) {
        const ctx = audio(), t = ctx.currentTime + at
        const osc = ctx.createOscillator()
        osc.type = "square"
        osc.frequency.value = 110
        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = 900
        const amp = ctx.createGain()
        amp.gain.setValueAtTime(0.0001, t)
        amp.gain.exponentialRampToValueAtTime(0.12, t + 0.006)
        amp.gain.setValueAtTime(0.12, t + 0.045)
        amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
        osc.connect(filter).connect(amp).connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 0.07)
    }
}

// Something kept: a soft, satisfying select click, with a small rising pop under it
export function notice() {
    if (replaced("notice")) return
    click({ freq: 3200, q: 4, gain: 0.2, length: 0.015 })
    const ctx = audio(), t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.04)
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0.0001, t)
    amp.gain.exponentialRampToValueAtTime(0.16, t + 0.006)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
    osc.connect(amp).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.16)
}

// The phone's sounds. The dial ratchets as it is wound, knocks on the finger stop, and on its
// way back sends one pulse per hole it passes, as a real one does. The pad plays the tones of
// a touch-tone phone.
const dtmf = {
    "1": [697, 1209], "2": [697, 1336], "3": [697, 1477],
    "4": [770, 1209], "5": [770, 1336], "6": [770, 1477],
    "7": [852, 1209], "8": [852, 1336], "9": [852, 1477],
    "0": [941, 1336],
}

export const phone = {
    grab:    () => replaced("dialGrab") || click({ freq: 1800, gain: 0.25, length: 0.025 }),
    ratchet: () => replaced("dialRatchet") || click({ freq: 3200, q: 6, gain: 0.18, length: 0.018 }),
    stop:    () => replaced("dialStop") || click({ freq: 700, q: 2, gain: 0.6, length: 0.06 }),
    // pulses spread over the wheel's return, then the knock of it coming to rest
    unwind: (pulses, duration) => {
        for (let i = 0; i < pulses; i++) {
            const at = (i + 0.5) * duration / pulses
            replaced("dialPulse", at) || click({ at, freq: 2200, q: 5, gain: 0.22, length: 0.02 })
        }
        replaced("dialRest", duration) || click({ at: duration, freq: 900, q: 2, gain: 0.4, length: 0.05 })
    },
    key: (digit) => dtmf[digit] && (replaced("keypad") || tone(dtmf[digit], { length: 0.14 })),
}
