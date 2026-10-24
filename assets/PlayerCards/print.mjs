// Writes the players' cards for printing, fronts and backs on separate A4 sheets (one-sided
// printing; each front is glued to its back, then laminated). The front: the guest's name and
// playing card in their team's color, with the team's code (players.js, teams.js). The back: the
// team's maze card (assets/Labyrinth; diamonds' their own card, assets/MazeArtifact), so a card
// is the same 5:7 shape, 63 x 88.2 mm, which fits the 7 x 10.5 cm envelopes once laminated.
//   node assets/PlayerCards/print.mjs [name]
// fronts.html and backs.html, nine cards to a sheet, the same guest in the same place on both:
// print at 100% scale (no "fit to page"), and cut along the marks in the margins. With a name,
// only that player's card instead (sample.svg, sample-back.svg). The test users and the spares
// not yet written in are left out.
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"
import {players} from "../../plexos/app/game/Party/players.js"
import {teams, teamOrder} from "../../plexos/app/game/Party/teams.js"
import {card as mazeCard, CARD} from "../MazeArtifact/cards.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const W = 63, H = 88.2                // millimetres, one unit each
const bg = "#1f1f23", wall = "#b4b4c0", dot = "#e8e8ee"
const sans = "Arial, Helvetica, sans-serif", mono = "Courier New, monospace"
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const suit = (key, x, y, size, attrs) => `<g transform="translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})"><path d="${teams[key].path}" ${attrs}/></g>`

// Square cornered, so front and back meet edge to edge once glued
function front(player) {
    const team = teams[player.team], c = team.color, cell = W / 5
    let out = `<rect width="${W}" height="${H}" fill="${bg}"/>`
    // the back's dot grid, faint, so both sides belong together
    for (let y = cell / 2; y < H; y += cell) for (let x = cell / 2; x < W; x += cell) out += `<circle cx="${x}" cy="${y}" r="0.45" fill="${dot}" opacity="0.14"/>`
    out += `<rect x="2.6" y="2.6" width="${W - 5.2}" height="${H - 5.2}" rx="2.2" fill="none" stroke="${c}" stroke-width="0.5"/>`

    // corner indices: the card's rank over its suit, turned round at the foot
    const index = `<text x="7.6" y="10.6" text-anchor="middle" font-family="${sans}" font-weight="700" font-size="7.4" fill="#fff">${player.card}</text>` + suit(player.team, 7.6, 15.6, 5.6, `fill="${c}"`)
    out += index + `<g transform="rotate(180 ${W / 2} ${H / 2})">${index}</g>`

    // the suit large in the middle, drawn as an outline like the game's team icons
    out += suit(player.team, W / 2, 31, 30, `fill="${c}" fill-opacity="0.12" stroke="${c}" stroke-width="0.9" stroke-linejoin="round"`)

    // name and team
    const nameSize = player.name.length > 7 ? 8.4 : 10.5
    out += `<text x="${W / 2}" y="56" text-anchor="middle" font-family="${sans}" font-weight="700" font-size="${nameSize}" fill="#fff">${esc(player.name)}</text>`
    out += `<line x1="${W / 2 - 12}" y1="59.6" x2="${W / 2 + 12}" y2="59.6" stroke="${c}" stroke-width="0.5"/>`
    out += `<text x="${W / 2}" y="64.4" text-anchor="middle" font-family="${sans}" font-weight="700" font-size="3.4" letter-spacing="0.9" fill="${c}">${esc(team.name.toUpperCase())}</text>`

    // the team's code
    out += `<rect x="${W / 2 - 13}" y="68.4" width="26" height="10.4" rx="1.6" fill="none" stroke="${wall}" stroke-width="0.35" stroke-dasharray="1.6 1"/>`
    out += `<text x="${W / 2}" y="76.2" text-anchor="middle" font-family="${mono}" font-weight="700" font-size="8" letter-spacing="1.4" fill="${c}">${team.code}</text>`
    return out
}

// The back: the team's maze card. A card image stops just past its dots on the sides without a
// guide line, so cards laid together make the maze; it goes against those edges, and what is
// left of the card is margin on the guide sides. The image keeps the frame and guide line; its
// maze, small for print and labelled, is drawn again over it from backs.json (read from the
// same images: walls as h<column>,<row> and v<column>,<row>, and the package dots).
const shift = { clubs: [34, 34], spades: [34, 34], hearts: [34, 0] }
const cut = { clubs: [6, 6], spades: [6, 6], hearts: [6, 0] }
const mazes = JSON.parse(fs.readFileSync(path.join(here, "backs.json"), "utf8"))
const pngs = {}
function back(player) {
    const px = W / CARD.w
    if (player.team === "diamonds") return `<g transform="scale(${px})">${mazeCard("own").svg}</g>`
    const team = player.team, [dx, dy] = shift[team], [cx, cy] = cut[team], maze = mazes[team]
    pngs[team] ??= fs.readFileSync(path.join(here, "../Labyrinth", `card-${team}.png`)).toString("base64")
    const X = (i) => dx + 40 + 80 * i, Y = (j) => dy + 40 + 80 * j
    let out = `<rect width="${CARD.w}" height="${CARD.h}" fill="#2a2a2e"/><image href="data:image/png;base64,${pngs[team]}" x="${dx}" y="${dy}" width="${CARD.w}" height="${CARD.h}"/>`
    out += `<rect x="${X(0)}" y="${Y(0)}" width="${320 + cx}" height="${480 + cy}" fill="#1e1e20"/>`
    for (const key of maze.walls) {
        const [i, j] = key.slice(1).split(",").map(Number)
        const [x1, y1, x2, y2] = key[0] === "h" ? [X(i) + 16, Y(j), X(i + 1) - 16, Y(j)] : [X(i), Y(j) + 16, X(i), Y(j + 1) - 16]
        out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${wall}" stroke-width="10" stroke-linecap="round"/>`
    }
    for (const { cell: [i, j], color } of maze.packages) out += `<circle cx="${X(i + 0.5)}" cy="${Y(j + 0.5)}" r="13" fill="${color}"/>`
    for (let j = 0; j <= 6; j++) for (let i = 0; i <= 4; i++) out += `<circle cx="${X(i)}" cy="${Y(j)}" r="5.5" fill="#e6e6e6"/>`
    return `<g transform="scale(${px})">${out}</g>`
}

const svg = (player, side) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">${side(player)}</svg>\n`
const guests = players.filter(player => !player.tester && !player.spare)

const name = process.argv[2]
if (name) {
    const player = guests.find(p => p.name === name)
    if (!player) throw new Error(`no guest named ${name}`)
    fs.writeFileSync(path.join(here, "sample.svg"), svg(player, front))
    fs.writeFileSync(path.join(here, "sample-back.svg"), svg(player, back))
    // combined A4 page with front and back side by side for single-card printing
    const gap = 6, pw = 210, ph = 297, cx = (pw - 2 * W - gap) / 2, cy = (ph - H) / 2
    const combined = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pw} ${ph}" width="${pw}mm" height="${ph}mm">` +
        `<svg x="${cx}" y="${cy}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${front(player)}</svg>` +
        `<svg x="${cx + W + gap}" y="${cy}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${back(player)}</svg>` +
        `</svg>`
    const cardHtml = `<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>Carta — ${esc(player.name)}</title>\n<style>@page { size: A4; margin: 0; } body { margin: 0; } svg { display: block; }</style>\n</head><body>${combined}</body></html>\n`
    const outName = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    fs.writeFileSync(path.join(here, `${outName}-card.html`), cardHtml)
    console.log(`sample.svg, sample-back.svg, ${outName}-card.html: ${player.name}`)
    process.exit()
}

// The sheets: A4, three by three cards edge to edge, centred, with cut marks in the margin
// along every edge between them. One team after another, by name.
const A4 = { w: 210, h: 297 }, cols = 3, rows = 3, perSheet = cols * rows
const ox = (A4.w - cols * W) / 2, oy = (A4.h - rows * H) / 2
const order = guests.slice().sort((a, b) => teamOrder.indexOf(a.team) - teamOrder.indexOf(b.team) || a.name.localeCompare(b.name, "es"))
function marks() {
    let out = ""
    const line = (x1, y1, x2, y2) => out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="0.2"/>`
    for (let c = 0; c <= cols; c++) { const x = ox + c * W; line(x, oy - 8, x, oy - 2); line(x, oy + rows * H + 2, x, oy + rows * H + 8) }
    for (let r = 0; r <= rows; r++) { const y = oy + r * H; line(ox - 8, y, ox - 2, y); line(ox + cols * W + 2, y, ox + cols * W + 8, y) }
    return out
}
function sheets(side, title) {
    const pages = []
    for (let s = 0; s * perSheet < order.length; s++) {
        let out = marks()
        order.slice(s * perSheet, (s + 1) * perSheet).forEach((player, i) => {
            const x = ox + (i % cols) * W, y = oy + Math.floor(i / cols) * H
            out += `<svg x="${x}" y="${y}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${side(player)}</svg>`
        })
        pages.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${A4.w} ${A4.h}" width="${A4.w}mm" height="${A4.h}mm">${out}</svg>`)
    }
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title>
<style>@page { size: A4; margin: 0; } body { margin: 0; } svg { display: block; break-after: page; }</style>
</head><body>${pages.join("\n")}</body></html>
`
}
fs.writeFileSync(path.join(here, "fronts.html"), sheets(front, "Cartas - frentes"))
fs.writeFileSync(path.join(here, "backs.html"), sheets(back, "Cartas - dorsos"))
console.log(order.length, "cards on", Math.ceil(order.length / perSheet), "sheets each:", order.map(p => p.name).join(", "))
