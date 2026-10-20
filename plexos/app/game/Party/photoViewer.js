import {pushBack, leave} from "./backStack.js"

// Full-screen slides over a puzzle: swipe sideways between them, tap a dot to jump, close with
// the X or the back button. Used for the hint photos of an artifact, and the games' texts
// (story.js), whose slides scroll up and down on their own. closable: false leaves out the X, so
// only a button of a slide or the back button closes it. onShow(index) hears each slide come
// into view. Returns the viewer and its close().
export function openCarousel(slides, host, { start = 0, closable = true, className = "", onShow = null } = {}) {
    const viewer = document.createElement("div")
    viewer.className = "photo-viewer " + className

    const strip = document.createElement("div")
    strip.className = "photo-strip"
    strip.append(...slides)

    const dots = document.createElement("div")
    dots.className = "photo-dots"
    slides.forEach((_, i) => {
        const dot = document.createElement("button")
        dot.type = "button"
        dot.dataset.index = i
        dots.append(dot)
    })
    dots.hidden = slides.length < 2
    viewer.append(strip, dots)

    const close = () => {
        leave(back)
        viewer.remove()
    }
    if (closable) {
        const x = document.createElement("button")
        x.type = "button"
        x.className = "photo-close"
        x.setAttribute("aria-label", "Cerrar")
        // pointerdown everywhere, so one tap is always one action
        x.addEventListener("pointerdown", e => {
            e.preventDefault()
            e.stopPropagation()
            close()
        })
        viewer.append(x)
    }
    host.append(viewer)

    let index = 0
    let swipe = null
    const back = pushBack(() => viewer.remove())

    const show = (next, animate = true) => {
        const from = index
        index = Math.max(0, Math.min(slides.length - 1, next))
        if (index !== from || !animate) onShow?.(index)
        strip.classList.toggle("animate", animate)
        strip.style.transform = `translateX(${-index * 100}%)`
        ;[...dots.children].forEach((dot, i) => dot.classList.toggle("on", i === index))
    }
    show(start, false)

    dots.addEventListener("pointerdown", e => {
        const dot = e.target.closest("button[data-index]")
        if (!dot) return
        e.preventDefault()
        e.stopPropagation()
        show(Number(dot.dataset.index))
    })

    // The strip follows the finger, then settles on the nearest slide. A quick flick or a drag
    // past a fifth of the width moves one slide along. A press on a slide's button is a tap.
    viewer.addEventListener("pointerdown", e => {
        if (swipe || e.target.closest(".photo-slide button")) return
        // a mouse doesn't scroll by dragging, so only a finger leaves the page its own scrolling
        if (e.pointerType !== "touch") e.preventDefault()
        viewer.setPointerCapture(e.pointerId)
        swipe = { id: e.pointerId, x: e.clientX, time: performance.now(), dx: 0 }
        strip.classList.remove("animate")
    })
    viewer.addEventListener("pointermove", e => {
        if (!swipe || e.pointerId !== swipe.id) return
        swipe.dx = e.clientX - swipe.x
        // resist at the ends, where there is nothing more to show
        const atEnd = (index === 0 && swipe.dx > 0) || (index === slides.length - 1 && swipe.dx < 0)
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

    return { viewer, close }
}

export function openPhotos(photos, host) {
    const slides = photos.map(url => {
        const slide = document.createElement("div")
        slide.className = "photo-slide"
        const img = document.createElement("img")
        img.src = url
        img.alt = ""
        img.draggable = false
        slide.append(img)
        return slide
    })
    return openCarousel(slides, host).viewer
}
