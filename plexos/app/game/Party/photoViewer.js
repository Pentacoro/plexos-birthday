import {pushBack, leave} from "./backStack.js"

// Full-screen photos over a puzzle: swipe sideways between them, tap a dot to jump,
// close with the X or the back button. Used for the hint photos of an artifact.
export function openPhotos(photos, host) {
    const viewer = document.createElement("div")
    viewer.className = "photo-viewer"

    const strip = document.createElement("div")
    strip.className = "photo-strip"
    for (const url of photos) {
        const slide = document.createElement("div")
        slide.className = "photo-slide"
        const img = document.createElement("img")
        img.src = url
        img.alt = ""
        img.draggable = false
        slide.append(img)
        strip.append(slide)
    }

    const close = document.createElement("button")
    close.type = "button"
    close.className = "photo-close"
    close.setAttribute("aria-label", "Cerrar")

    const dots = document.createElement("div")
    dots.className = "photo-dots"
    photos.forEach((_, i) => {
        const dot = document.createElement("button")
        dot.type = "button"
        dot.dataset.index = i
        dots.append(dot)
    })

    viewer.append(strip, close, dots)
    host.append(viewer)

    let index = 0
    let swipe = null
    const back = pushBack(() => viewer.remove())

    const show = (next, animate = true) => {
        index = Math.max(0, Math.min(photos.length - 1, next))
        strip.classList.toggle("animate", animate)
        strip.style.transform = `translateX(${-index * 100}%)`
        ;[...dots.children].forEach((dot, i) => dot.classList.toggle("on", i === index))
    }
    show(0, false)

    // pointerdown everywhere, so one tap is always one action
    close.addEventListener("pointerdown", e => {
        e.preventDefault()
        e.stopPropagation()
        leave(back)
        viewer.remove()
    })
    dots.addEventListener("pointerdown", e => {
        const dot = e.target.closest("button[data-index]")
        if (!dot) return
        e.preventDefault()
        e.stopPropagation()
        show(Number(dot.dataset.index))
    })

    // The strip follows the finger, then settles on the nearest photo. A quick flick
    // or a drag past a fifth of the width moves one photo along.
    viewer.addEventListener("pointerdown", e => {
        if (swipe) return
        e.preventDefault()
        viewer.setPointerCapture(e.pointerId)
        swipe = { id: e.pointerId, x: e.clientX, time: performance.now(), dx: 0 }
        strip.classList.remove("animate")
    })
    viewer.addEventListener("pointermove", e => {
        if (!swipe || e.pointerId !== swipe.id) return
        swipe.dx = e.clientX - swipe.x
        // resist at the ends, where there is nothing more to show
        const atEnd = (index === 0 && swipe.dx > 0) || (index === photos.length - 1 && swipe.dx < 0)
        const pull = atEnd ? swipe.dx / 3 : swipe.dx
        strip.style.transform = `translateX(calc(${-index * 100}% + ${pull}px))`
    })
    const release = (e) => {
        if (!swipe || e.pointerId !== swipe.id) return
        const { dx, time } = swipe
        swipe = null
        const width = viewer.clientWidth || 1
        const fast = Math.abs(dx) / (performance.now() - time) > 0.5
        if (Math.abs(dx) > width / 5 || (fast && Math.abs(dx) > 20)) show(index + (dx < 0 ? 1 : -1))
        else show(index)
    }
    viewer.addEventListener("pointerup", release)
    viewer.addEventListener("pointercancel", release)

    return viewer
}
