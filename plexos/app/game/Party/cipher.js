// A message locked with a password, and unlocked with it. Done at once, with no waiting, so a
// reply can be locked and sent to WhatsApp in the very tap that sends it (phones only let a page
// open another app from a tap). Each message gets its own random start, so the same words never
// lock the same way twice. Not strong encryption: enough that the message reads as noise.
function stream(password, nonce) {
    let seed = 2166136261
    for (const char of password + ":" + nonce.join(",")) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619)
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) & 255
    }
}

// locked messages begin with this, so a wrong password is caught instead of read as nonsense
const mark = "PLX|"
const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
const fromBase64 = (text) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), char => char.charCodeAt(0))

export function lock(text, password) {
    const nonce = [...crypto.getRandomValues(new Uint8Array(8))]
    const next = stream(password, nonce)
    const bytes = [...new TextEncoder().encode(mark + text)].map(byte => byte ^ next())
    return toBase64([...nonce, ...bytes])
}

// null when the password is wrong or the text isn't a locked message
export function unlock(locked, password) {
    try {
        const all = [...fromBase64(locked.trim())]
        const next = stream(password, all.slice(0, 8))
        const text = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(all.slice(8).map(byte => byte ^ next())))
        return text.startsWith(mark) ? text.slice(mark.length) : null
    } catch {
        return null
    }
}
