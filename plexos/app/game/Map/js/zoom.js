import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// A double tap zooms in around the tapped spot, the next one zooms back out. While
// zoomed, one finger moves the map around, never past its edges. The button stays put.
mem.frame = mem.root.querySelector(".map-frame")
mem.mapView = mem.root.querySelector(".map-view")
mem.zoom = { scale: 1, x: 0, y: 0 }
mem.zoomedScale = 2.5

const doubleTapTime = 300
const doubleTapReach = 30
const tapSlop = 10

let lastTap = null
let touch = null

function apply(animate) {
    mem.mapView.classList.toggle("animate", animate)
    mem.mapView.style.transform = `translate(${mem.zoom.x}px, ${mem.zoom.y}px) scale(${mem.zoom.scale})`
}

// Keeps the zoomed picture covering the whole frame
function clamp() {
    const { scale } = mem.zoom
    const width = mem.frame.clientWidth
    const height = mem.frame.clientHeight
    mem.zoom.x = Math.min(0, Math.max(width - width * scale, mem.zoom.x))
    mem.zoom.y = Math.min(0, Math.max(height - height * scale, mem.zoom.y))
}

function local(e) {
    const box = mem.frame.getBoundingClientRect()
    return { x: e.clientX - box.left, y: e.clientY - box.top }
}

mem.toggleZoom = (at) => {
    if (mem.zoom.scale > 1) {
        mem.zoom = { scale: 1, x: 0, y: 0 }
    } else {
        // the tapped spot stays under the finger
        const scale = mem.zoomedScale
        mem.zoom = { scale, x: at.x - at.x * scale, y: at.y - at.y * scale }
        clamp()
    }
    apply(true)
}

mem.zoomDown = (e) => {
    if (touch) return false
    const at = local(e)
    touch = { id: e.pointerId, start: at, last: at, moved: false }
    return true
}

mem.zoomMove = (e) => {
    if (!touch || e.pointerId !== touch.id) return
    const at = local(e)
    if (!touch.moved && Math.hypot(at.x - touch.start.x, at.y - touch.start.y) > tapSlop) touch.moved = true
    if (touch.moved && mem.zoom.scale > 1) {
        mem.zoom.x += at.x - touch.last.x
        mem.zoom.y += at.y - touch.last.y
        clamp()
        apply(false)
    }
    touch.last = at
}

mem.zoomUp = (e) => {
    if (!touch || e.pointerId !== touch.id) return
    const { start, moved } = touch
    touch = null
    if (moved) return lastTap = null
    const now = performance.now()
    if (lastTap && now - lastTap.time < doubleTapTime && Math.hypot(start.x - lastTap.at.x, start.y - lastTap.at.y) < doubleTapReach) {
        lastTap = null
        mem.toggleZoom(start)
        return
    }
    lastTap = { time: now, at: start }
}

mem.zoomCancel = () => {
    touch = null
    lastTap = null
}
