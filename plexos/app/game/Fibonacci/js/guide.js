import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A barely there guide. In the hint the two 1s of "1 + 1" are faintly tinted, one warm and one
// purple. On the dial, the number being typed is read as a sequence: its first two digits, then
// each sum of the two before it. Whenever another number of it is complete, the last two
// numbers' slots take those same tints, the older warm and the newer purple, and give a tiny
// shake with a flash of their color before settling back to almost white. Only a number that
// is on its way to one that answers is read so: the tints are the sign of being on the right track.

// The slots each number of the sequence covers, [start, end), for as long as the entry follows it
function terms(entry) {
    if (entry.length < 2) return []
    const spans = [[0, 1], [1, 2]]
    let a = Number(entry[0]), b = Number(entry[1]), at = 2
    for (;;) {
        const next = String(a + b)
        if (entry.slice(at, at + next.length) !== next) return spans
        spans.push([at, at + next.length])
        at += next.length
        a = b
        b = Number(next)
    }
}

let counted = 0

mem.guide = () => {
    const slots = mem.digitSlots
    for (const slot of slots) slot.classList.remove("seq-a", "seq-b")
    // the secret number stays out of it: nothing ever hints at it
    const real = [mem.introNumber, ...Object.keys(mem.seeds).map(mem.teamNumber)]
    const onTrack = real.some(number => number.startsWith(mem.entry))
    const spans = mem.mode === "dial" && onTrack ? terms(mem.entry) : []
    if (spans.length < 2) return counted = spans.length
    const [older, newer] = spans.slice(-2)
    const mark = ([start, end], name) => slots.slice(start, end).map(slot => (slot.classList.add(name), slot))
    const marked = [...mark(older, "seq-a"), ...mark(newer, "seq-b")]
    if (spans.length > counted) {
        for (const slot of marked) {
            slot.classList.remove("seq-pulse")
            void slot.offsetWidth
            slot.classList.add("seq-pulse")
        }
    }
    counted = spans.length
}
