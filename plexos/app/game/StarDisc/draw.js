// The disc and the star as SVG, in one coordinate space (-100 to 100, the disc's edge at 98),
// for the desktop artifact and for printing alike. Plain strings, so they can be written to
// files too (assets/StarDisc/print.mjs).
import {places, lines, marked, rim, teamColors} from "./disc.js"

const point = (angle, radius) => {
    const rad = angle * Math.PI / 180
    return [radius * Math.sin(rad), -radius * Math.cos(rad)]
}
const f = (n) => Math.round(n * 100) / 100
const step = 360 / places

// ink: the lines and digits; paper: the disc itself
export function discSvg({ ink = "#1b1b20", paper = "#ffffff" } = {}) {
    let out = `<circle cx="0" cy="0" r="98" fill="${paper}" stroke="${ink}" stroke-width="1.6"/>`
    out += `<circle cx="0" cy="0" r="78" fill="none" stroke="${ink}" stroke-width="0.5" stroke-dasharray="1 2"/>`
    // the digits, each upright toward the rim, with a notch under each one
    rim.split("").forEach((digit, i) => {
        const angle = i * step
        const [x, y] = point(angle, 87)
        out += `<text x="${f(x)}" y="${f(y)}" transform="rotate(${f(angle)} ${f(x)} ${f(y)})" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="9.5" fill="${ink}">${digit}</text>`
        const [ax, ay] = point(angle, 79.5), [bx, by] = point(angle, 81.5)
        out += `<line x1="${f(ax)}" y1="${f(ay)}" x2="${f(bx)}" y2="${f(by)}" stroke="${ink}" stroke-width="0.8" stroke-linecap="round"/>`
    })
    // the hub: a ring, and a team's line toward each team's place
    out += `<circle cx="0" cy="0" r="15" fill="none" stroke="${ink}" stroke-width="0.8"/>`
    for (const [team, place] of Object.entries(lines)) {
        const [x, y] = point(place * step, 13)
        out += `<line x1="0" y1="0" x2="${f(x)}" y2="${f(y)}" stroke="${teamColors[team]}" stroke-width="2.6" stroke-linecap="round"/>`
    }
    out += `<circle cx="0" cy="0" r="1.6" fill="${ink}"/>`
    return out
}

// The star, pointing up: its slit runs from the center toward the top tip, cut through it so
// the disc's lines show only there. The marked tips carry one, two and three dots.
export function starSvg({ fill = "#f2c230", ink = "#1b1b20", id = "star" } = {}) {
    const outer = 76, inner = 31
    const corners = []
    for (let k = 0; k < 10; k++) corners.push(point(k * 36, k % 2 ? inner : outer))
    const outline = "M" + corners.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z"
    // the slit: from just past the center to the edge of the hub's lines
    const slit = `M-1.4 2.2L1.4 2.2L1.4 -14L-1.4 -14Z`
    let out = `<defs><mask id="${id}-cut"><path d="${outline}" fill="#fff"/><path d="${slit}" fill="#000"/><circle cx="0" cy="0" r="2.2" fill="#000"/></mask></defs>`
    out += `<path d="${outline}" fill="${fill}" mask="url(#${id}-cut)"/>`
    out += `<path d="${outline}" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>`
    out += `<path d="${slit}" fill="none" stroke="${ink}" stroke-width="0.6"/>`
    // dots on the marked tips, counting their order
    marked.forEach((offset, order) => {
        const angle = offset * step
        for (let d = 0; d <= order; d++) {
            const [x, y] = point(angle, 58 - d * 5.5)
            out += `<circle cx="${f(x)}" cy="${f(y)}" r="1.9" fill="${ink}"/>`
        }
    })
    return out
}
