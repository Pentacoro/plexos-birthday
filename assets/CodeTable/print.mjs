// Writes spades' artifact for printing: the list of every guest and their own 3-digit code
// (players.js, code), on four square papers, one team to a paper under its suit. Each team's
// spare comes last, its code by a blank line to write a guest's name on at the party.
//   node assets/CodeTable/print.mjs
// papers.svg (two by two, each 9 cm across) and print.html. Print at 100% scale (no "fit to
// page"), cut along the dashed lines. The test users are left out: theirs are in players.js.
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"
import {players} from "../../plexos/app/game/Party/players.js"
import {teams} from "../../plexos/app/game/Party/teams.js"

const here = path.dirname(fileURLToPath(import.meta.url))
const ink = "#1b1b20", cut = "#8a8a96"
const side = 90, gap = 6             // millimetres, one unit each: a paper, and the space between two
const S = side * 2 + gap
const rows = 7

// the papers, in reading order, a team each
const papers = ["spades", "hearts", "clubs", "diamonds"]
const guestsOf = (team) =>
    players.filter(player => player.team === team && !player.tester && !player.spare && !player.unlisted).sort((a, b) => a.name.localeCompare(b.name, "es"))

const top = 22                        // a paper's heading above its rows
const rowH = (side - top - 12) / rows
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
let out = "", count = 0
papers.forEach((key, p) => {
    const x0 = (p % 2) * (side + gap), y0 = Math.floor(p / 2) * (side + gap), team = teams[key]
    out += `<rect x="${x0}" y="${y0}" width="${side}" height="${side}" fill="#fff" stroke="${cut}" stroke-width="0.3" stroke-dasharray="2 1.5"/>`
    out += `<g transform="translate(${x0 + 13} ${y0 + 8}) scale(${9 / 24})"><path d="${team.path}" fill="${team.color}"/></g>`
    out += `<text x="${x0 + 25}" y="${y0 + 12.5}" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="6" fill="${ink}">${esc(team.name)}</text>`
    out += `<line x1="${x0 + 13}" y1="${y0 + 19}" x2="${x0 + side - 13}" y2="${y0 + 19}" stroke="${team.color}" stroke-width="0.6"/>`
    guestsOf(key).forEach((guest, row) => { count++; drawRow(guest, x0, y0 + top + rowH * row + rowH / 2) })
})
function drawRow(guest, x0, y) {
    if (guest.spare) out += `<line x1="${x0 + 13}" y1="${y + 2}" x2="${x0 + side - 30}" y2="${y + 2}" stroke="${ink}" stroke-width="0.25" stroke-dasharray="0.8 0.8"/>`
    else out += `<text x="${x0 + 13}" y="${y}" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="5.2" fill="${ink}">${esc(guest.name)}</text>`
    out += `<text x="${x0 + side - 13}" y="${y}" dominant-baseline="central" text-anchor="end" font-family="Courier New, monospace" font-weight="700" font-size="6" fill="${ink}">${guest.code}</text>`
    out += `<line x1="${x0 + 13}" y1="${y + rowH / 2}" x2="${x0 + side - 13}" y2="${y + rowH / 2}" stroke="#d6d6dc" stroke-width="0.2"/>`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${S + 2} ${S + 2}" width="${S + 2}mm" height="${S + 2}mm">${out}</svg>\n`
fs.writeFileSync(path.join(here, "papers.svg"), svg)
fs.writeFileSync(path.join(here, "print.html"), `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Artefacto de Picas</title>
<style>@page { size: A4; margin: 12mm; } body { margin: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 5mm; } p { margin: 0; font-size: 10pt; color: #555; }</style>
</head><body><p>Artefacto de Picas — cuatro papeles de 9 cm: recortar por las líneas punteadas</p>${svg}</body></html>
`)
console.log(count, "guests, written to", here)
