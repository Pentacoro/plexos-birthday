import {openPhotos} from "./photoViewer.js"
import {teams} from "./teams.js"

// The badge in a puzzle's corner says how it gets solved. Tapping it spells that out.
export const categories = {
    solo: {
        message: "Individual: lo podés resolver por tu cuenta",
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="10" cy="9" r="3.6" fill="currentColor"/>
            <path d="M3.5 21c.7-3.9 3.2-6.2 6.5-6.2s5.8 2.3 6.5 6.2z" fill="currentColor"/>
            <path d="M16 3.6a2.3 2.3 0 1 1 3 2.2c-.7.3-1 .7-1 1.4v.5"/>
            <circle cx="18" cy="10.2" r=".5" fill="currentColor"/>
        </svg>`,
    },
    teams: {
        message: "Coordinado: necesitás información de otros",
        svg: `<svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="8" cy="9" r="3.2"/>
            <path d="M2 20.5c.6-3.6 2.9-5.6 6-5.6s5.4 2 6 5.6z"/>
            <circle cx="16.5" cy="7.5" r="2.8"/>
            <path d="M15 13.6c.5-.1 1-.2 1.5-.2 2.8 0 4.8 1.8 5.4 5h-5.6a8 8 0 0 0-1.3-4.8z"/>
        </svg>`,
    },
    artifact: {
        message: "Artefacto: te falta algo...",
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">
            <path d="M12 2.8 20 7v10l-8 4.2L4 17V7z"/>
            <path d="M4 7l8 4.2L20 7M12 11.2v10"/>
        </svg>`,
    },
}

// Where each artifact is hidden, drawn as on the map's legend. An artifact badge given a place
// shows that room instead of the plain cube.
export const places = {
    // 1, Baño: the toilet
    bathroom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <rect x="5" y="2.5" width="9" height="6" rx="1.2"/>
        <path d="M4 11.5h15a5.5 5.5 0 0 1-5.5 5.5H9.5A5.5 5.5 0 0 1 4 11.5z"/>
        <path d="M7 8.5v3M9.5 17l-1 4.5h7l-1-4.5"/>
    </svg>`,
    // 2, Cocina: the oven
    kitchen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <rect x="4" y="3" width="16" height="18" rx="1.5"/>
        <path d="M4 7.5h16"/>
        <rect x="7.5" y="11" width="9" height="6.5" rx="1"/>
        <path d="M7.5 5.3h.01M10.5 5.3h.01"/>
    </svg>`,
    // 3, Living: the armchair
    living: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <path d="M6.5 11V6.5a2.5 2.5 0 0 1 2.5-2.5h6a2.5 2.5 0 0 1 2.5 2.5V11"/>
        <path d="M3 11.5a2 2 0 0 1 4 0V14h10v-2.5a2 2 0 0 1 4 0V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
        <path d="M5.5 19v2M18.5 19v2"/>
    </svg>`,
    // 4, Comedor: a table between two chairs
    dining: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <path d="M3 4v16M3 13h4v7"/>
        <path d="M21 4v16M21 13h-4v7"/>
        <path d="M7.5 9.5h9M12 9.5V20M9.5 20h5"/>
    </svg>`,
    // 5, Patio: the grill
    patio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <path d="M3.5 9h17a8.5 6 0 0 1-17 0z"/>
        <path d="M5 6.5a8 3 0 0 1 14 0M12 3v1"/>
        <path d="M8.5 14.3 6 21.5M15.5 14.3 18 21.5M12 15v6.5M7 18.5h10"/>
    </svg>`,
    // 6, Galpón: the open box
    galpon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <path d="M4 9.5 12 7l8 2.5V18l-8 3-8-3z"/>
        <path d="M4 9.5l8 2.8 8-2.8M12 12.3V21"/>
        <path d="M4 9.5 2 6l8-2.5L12 7M20 9.5 22 6l-8-2.5L12 7"/>
    </svg>`,
}

export function categoryBadge(category, options) {
    const badge = document.createElement("button")
    badge.type = "button"
    badge.onclick = () => {
        badge.classList.toggle("open")
        if (!badge.classList.contains("open")) stopScrolling(badge)
    }
    // The label's width is only known once it has finished opening
    badge.addEventListener("transitionend", e => {
        if (e.propertyName === "max-width" && badge.classList.contains("open")) fitLabel(badge)
    })
    window.addEventListener("resize", () => { if (badge.classList.contains("open")) fitLabel(badge) })
    setCategory(badge, category, options)
    return badge
}

// A puzzle step can change what kind of help it needs. Photos (the artifact's hints)
// add a button at the end of the open badge that shows them. A place swaps the artifact's
// cube for the room it is hidden in; a team, for that team's suit, once the artifact is theirs.
export function setCategory(badge, category, { photos, place, team } = {}) {
    // prefixed, so a category name never matches a puzzle's own class names
    badge.className = "category-badge category-" + category
    badge.dataset.message = categories[category].message
    badge.innerHTML = categories[category].svg
    // the cube and the room stacked: opening the badge fades one into the other
    const swap = teams[team] ? suit(team) : places[place]
    if (category === "artifact" && swap) {
        badge.innerHTML = `<span class="category-icon"><span class="category-cube">${categories.artifact.svg}</span><span class="category-place">${swap}</span></span>`
    }
    const label = document.createElement("span")
    label.className = "category-label"
    const text = document.createElement("span")
    text.className = "category-text"
    label.append(text)
    badge.append(label)
    if (photos?.length) badge.append(photoButton(badge, photos))
    stopScrolling(badge)
}

// A team's suit, drawn as the game's team icons are
const suit = (team) => `<svg viewBox="0 0 24 24"><path d="${teams[team].path}" fill="none" stroke="${teams[team].color}" stroke-width="1.8" stroke-linejoin="round"/></svg>`

// Not a nested button, which HTML doesn't allow inside the badge's own
function photoButton(badge, photos) {
    const button = document.createElement("span")
    button.className = "category-photos"
    button.setAttribute("role", "button")
    button.setAttribute("aria-label", "Ver fotos")
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6l1.5-2h5L16 6"/><circle cx="12" cy="13" r="3.5"/></svg>`
    button.addEventListener("pointerdown", e => {
        e.preventDefault()
        e.stopPropagation()
        if (!badge.classList.contains("open")) return
        openPhotos(photos, badge.closest(".content") || document.body)
    })
    // the badge itself toggles on click, so this tap must not reach it
    button.addEventListener("click", e => e.stopPropagation())
    return button
}

function stopScrolling(badge) {
    const label = badge.querySelector(".category-label")
    label.classList.remove("scrolling")
    label.firstChild.replaceChildren(document.createTextNode(badge.dataset.message))
}

// A message wider than the badge can grow scrolls in a loop: two copies side by side,
// moved left by exactly one copy's width so the seam never shows
function fitLabel(badge) {
    stopScrolling(badge)
    const label = badge.querySelector(".category-label")
    const text = label.firstChild
    if (text.scrollWidth <= label.clientWidth) return
    const copies = [0, 1].map(() => {
        const copy = document.createElement("span")
        copy.textContent = badge.dataset.message
        return copy
    })
    text.replaceChildren(...copies)
    label.classList.add("scrolling")
    const distance = copies[0].offsetWidth
    text.style.setProperty("--distance", distance + "px")
    text.style.setProperty("--duration", distance / 35 + "s")
}
