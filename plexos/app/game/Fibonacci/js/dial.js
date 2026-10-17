import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A rotary dial. Angles are degrees clockwise from 12 o'clock. The holes run counter-
// clockwise from the finger stop, 1 nearest and 0 farthest, so a digit has to travel
// further the bigger it is. It only counts once the wheel has come back by itself.
const digits    = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
const stopAngle = 120
const step      = 30
const track     = 68
const holeSize  = 15
const holeAngle = (i) => stopAngle - step * (i + 2)
const travel    = (i) => step * (i + 2)

const ns = "http://www.w3.org/2000/svg"
function svgNode(tag, attributes) {
    const node = document.createElementNS(ns, tag)
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value)
    return node
}
function point(angle, radius) {
    const rad = angle * Math.PI / 180
    return [100 + radius * Math.sin(rad), 100 - radius * Math.cos(rad)]
}

mem.rotary = mem.root.querySelector(".dial")
const svg = svgNode("svg", { viewBox: "-8 -8 216 216", class: "dial-svg" })
const mask = svgNode("mask", { id: "dial-holes-" + task.id })
mask.append(svgNode("rect", { x: 0, y: 0, width: 200, height: 200, fill: "#fff" }))

// The digits are printed on the plate underneath and show through the holes
const plate = svgNode("g", { class: "dial-plate" })
plate.append(svgNode("circle", { cx: 100, cy: 100, r: 99 }))
digits.forEach((digit, i) => {
    const [x, y] = point(holeAngle(i), track)
    mask.append(svgNode("circle", { cx: x, cy: y, r: holeSize, fill: "#000" }))
    const label = svgNode("text", { x, y, class: "dial-digit" })
    label.textContent = digit
    plate.append(label)
})

mem.dialWheel = svgNode("g", { class: "dial-wheel" })
mem.dialWheel.append(
    svgNode("circle", { cx: 100, cy: 100, r: 95, mask: `url(#dial-holes-${task.id})`, class: "dial-face" }),
    svgNode("circle", { cx: 100, cy: 100, r: 34, class: "dial-center" }),
)

const [stopInX, stopInY] = point(stopAngle, track + 6)
const [stopOutX, stopOutY] = point(stopAngle, 106)
const stop = svgNode("line", { x1: stopInX, y1: stopInY, x2: stopOutX, y2: stopOutY, class: "dial-stop" })

svg.append(svgNode("defs", {}), plate, mem.dialWheel, stop)
svg.firstChild.append(mask)
mem.rotary.append(svg)

let grab = null
mem.dialBusy = false

function setTurn(angle) {
    mem.dialWheel.setAttribute("transform", `rotate(${angle} 100 100)`)
}

// Where the pointer is, as an angle and a distance from the centre in dial units
function polar(e) {
    const box = svg.getBoundingClientRect()
    const dx = e.clientX - (box.left + box.width / 2)
    const dy = e.clientY - (box.top + box.height / 2)
    return {
        angle: Math.atan2(dx, -dy) * 180 / Math.PI,
        distance: Math.hypot(dx, dy) * 216 / box.width,
    }
}
const turnBetween = (from, to) => ((to - from + 540) % 360) - 180

mem.dialGrab = (e) => {
    if (mem.dialBusy || grab || (mem.mode !== "dial" && mem.mode !== "code")) return false
    const { angle, distance } = polar(e)
    if (Math.abs(distance - track) > holeSize + 8) return false
    const index = digits.findIndex((_, i) => Math.abs(turnBetween(holeAngle(i), angle)) < step / 2)
    if (index < 0) return false
    grab = { index, last: angle, turned: 0, stopped: false, notch: 0 }
    mem.sound.grab()
    return true
}

mem.dialMove = (e) => {
    if (!grab) return
    const { angle } = polar(e)
    grab.turned += turnBetween(grab.last, angle)
    grab.last = angle
    grab.turned = Math.max(0, Math.min(grab.turned, travel(grab.index)))
    const stopped = grab.turned >= travel(grab.index) - 6
    // a ratchet click at each hole wound past, a knock on the finger stop
    const notch = Math.floor(grab.turned / step)
    if (notch > grab.notch) mem.sound.ratchet()
    grab.notch = notch
    if (stopped && !grab.stopped) { navigator.vibrate?.(15); mem.sound.stop() }
    grab.stopped = stopped
    setTurn(grab.turned)
}

// The wheel winds back at a steady pace, like a spring
mem.dialRelease = () => {
    if (!grab) return
    const { index, turned, stopped } = grab
    grab = null
    mem.dialBusy = true
    const duration = 80 + turned * 1.7
    mem.sound.unwind(Math.round(turned / step), duration / 1000)
    const start = performance.now()
    const unwind = (now) => {
        const left = Math.max(0, 1 - (now - start) / duration)
        setTurn(turned * left)
        if (left > 0) return requestAnimationFrame(unwind)
        mem.dialBusy = false
        if (stopped) mem.press(digits[index])
    }
    requestAnimationFrame(unwind)
}
