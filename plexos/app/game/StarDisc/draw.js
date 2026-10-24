// The disc and the star as SVG, in one coordinate space (-100 to 100, the disc's edge at 98),
// for the desktop artifact and for printing alike. Plain strings, so they can be written to
// files too (assets/StarDisc/print.mjs).
import {places, lines, tipSymbols, rim, teamColors} from "./disc.js"

const point = (angle, radius) => {
    const rad = angle * Math.PI / 180
    return [radius * Math.sin(rad), -radius * Math.cos(rad)]
}
const f = (n) => Math.round(n * 100) / 100
const step = 360 / places

// One shape for each of the five tip symbols, centered at (cx, cy).
// k is the tip index (0–4), used for unique mask IDs when needed.
function symbolSvg(name, cx, cy, ink, k = 0) {
    const r = 2.8
    if (name === "filled") return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${ink}"/>`
    if (name === "half") return (
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${ink}" stroke-width="0.8"/>` +
        `<path d="M${f(cx)},${f(cy - r)} A${r},${r} 0 0,1 ${f(cx)},${f(cy + r)} Z" fill="${ink}"/>`)
    if (name === "target") return (
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${ink}" stroke-width="0.8"/>` +
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="0.9" fill="${ink}"/>`)
    if (name === "ring") return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.68}" fill="none" stroke="${ink}" stroke-width="${r * 0.55}"/>`
    // quad: filled disc with a negative-space cross cut through it
    const id = "sq" + k
    const g = 0.55  // half the cross gap width
    return (
        `<defs><mask id="${id}">` +
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="white"/>` +
        `<rect x="${f(cx - r - 0.2)}" y="${f(cy - g)}" width="${f((r + 0.2) * 2)}" height="${f(g * 2)}" fill="black"/>` +
        `<rect x="${f(cx - g)}" y="${f(cy - r - 0.2)}" width="${f(g * 2)}" height="${f((r + 0.2) * 2)}" fill="black"/>` +
        `</mask></defs>` +
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${ink}" mask="url(#${id})"/>`)
}

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
    // team alignment icons at r=26: at the inner valley radius (31) minus the icon circle
    // radius (5), so the star body always covers them — as far from center as possible while
    // still hidden. White suit symbol rotated so its bottom faces the disc center.
    const suits = { clubs: "♣", spades: "♠", hearts: "♥", diamonds: "♦" }
    const plain = "︎"
    for (const [team, place] of Object.entries(lines)) {
        const angle = place * step
        const [x, y] = point(angle, 26)
        out += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="${teamColors[team]}"/>`
        out += `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="6.5" fill="#ffffff" transform="rotate(${f(angle)} ${f(x)} ${f(y)})">${suits[team]}${plain}</text>`
    }
    out += `<circle cx="0" cy="0" r="1.6" fill="${ink}"/>`
    return out
}

// The star, pointing up: a circular hole toward the top tip (away from center) aligns it
// over the disc's clubs icon. Each of the five tips carries its own symbol.
export function starSvg({ fill = "#f2c230", ink = "#1b1b20", id = "star" } = {}) {
    const outer = 76, inner = 31
    const corners = []
    for (let k = 0; k < 10; k++) corners.push(point(k * 36, k % 2 ? inner : outer))
    const outline = "M" + corners.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z"
    // hole at r=26 toward the top tip — same radius as the disc's team icons, so the star
    // body always hides all icons except through this hole when aligned
    let out = `<defs><mask id="${id}-cut"><path d="${outline}" fill="#fff"/><circle cx="0" cy="-26" r="5" fill="#000"/></mask></defs>`
    out += `<path d="${outline}" fill="${fill}" mask="url(#${id}-cut)"/>`
    out += `<path d="${outline}" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>`
    out += `<circle cx="0" cy="-26" r="5" fill="none" stroke="${ink}" stroke-width="0.6"/>`
    out += `<circle cx="0" cy="0" r="1.6" fill="${ink}"/>`
    // one symbol at each of the five tips, clockwise from the top
    for (let k = 0; k < 5; k++) {
        const [sx, sy] = point(k * 72, 61)
        out += symbolSvg(tipSymbols[k], sx, sy, ink, k)
    }
    return out
}
