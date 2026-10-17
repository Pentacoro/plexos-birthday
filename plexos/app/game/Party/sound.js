// Sound effects made on the spot with Web Audio, so no files need loading. One context for
// the whole game. Phones only let it play after a touch, so each sound wakes it first.
let context = null
let noise = null

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
