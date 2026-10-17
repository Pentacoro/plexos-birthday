import {getTask} from "/plexos/lib/functions/dll.js"
import {click, tone} from "/plexos/app/game/Party/sound.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// The phone's sounds. The dial ratchets as it is wound, knocks on the finger stop, and on its
// way back sends one pulse per hole it passes, as a real one does. The pad plays the tones of
// a touch-tone phone.
const dtmf = {
    "1": [697, 1209], "2": [697, 1336], "3": [697, 1477],
    "4": [770, 1209], "5": [770, 1336], "6": [770, 1477],
    "7": [852, 1209], "8": [852, 1336], "9": [852, 1477],
    "0": [941, 1336],
}

mem.sound = {
    grab:    () => click({ freq: 1800, gain: 0.25, length: 0.025 }),
    ratchet: () => click({ freq: 3200, q: 6, gain: 0.18, length: 0.018 }),
    stop:    () => click({ freq: 700, q: 2, gain: 0.6, length: 0.06 }),
    // pulses spread over the wheel's return, then the knock of it coming to rest
    unwind: (pulses, duration) => {
        for (let i = 0; i < pulses; i++) click({ at: (i + 0.5) * duration / pulses, freq: 2200, q: 5, gain: 0.22, length: 0.02 })
        click({ at: duration, freq: 900, q: 2, gain: 0.4, length: 0.05 })
    },
    key: (digit) => dtmf[digit] && tone(dtmf[digit], { length: 0.14 }),
}
