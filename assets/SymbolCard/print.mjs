// Writes hearts' artifact for printing: the card that turns symbols into numbers, from the same
// table as the desktop one and Sync's (Sync/pairs.js, artifactSymbols).
//   node assets/SymbolCard/print.mjs
// card.svg (9 x 13 cm) and print.html. Print at 100% scale (no "fit to page").
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"
import {columns, artifactSymbols} from "../../plexos/app/game/SymbolCard/card.js"
import {teams} from "../../plexos/app/game/Party/teams.js"

const here = path.dirname(fileURLToPath(import.meta.url))
const ink = "#1b1b20"
const W = 90, H = 130              // millimetres, one unit each
const left = 16, top = 22, colW = 16, rowH = 10

let out = `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="5" fill="#fff" stroke="${ink}" stroke-width="0.5"/>`
// the suits along the top, each over its column
columns.forEach((team, c) => {
    const x = left + 6 + colW * c + colW / 2
    out += `<g transform="translate(${x - 5} 7) scale(${10 / 24})"><path d="${teams[team].path}" fill="${teams[team].color}"/></g>`
})
out += `<line x1="6" y1="${top - 3}" x2="${W - 6}" y2="${top - 3}" stroke="${ink}" stroke-width="0.6"/>`
out += `<line x1="${left + 5}" y1="${top}" x2="${left + 5}" y2="${top + rowH * 10}" stroke="${ink}" stroke-width="0.6"/>`
// a row per number: the number, then each team's symbol for it
const text = (x, y, s) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="Courier New, monospace" font-weight="700" font-size="7" fill="${ink}">${s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")}</text>`
for (let n = 0; n < 10; n++) {
    const y = top + rowH * n + rowH / 2
    out += text(left - 2, y, String(n))
    columns.forEach((team, c) => { out += text(left + 6 + colW * c + colW / 2, y, artifactSymbols[team][n]) })
    if (n) out += `<line x1="8" y1="${y - rowH / 2}" x2="${W - 8}" y2="${y - rowH / 2}" stroke="${ink}" stroke-width="0.2" stroke-dasharray="1 1.5"/>`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">${out}</svg>\n`
fs.writeFileSync(path.join(here, "card.svg"), svg)
fs.writeFileSync(path.join(here, "print.html"), `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Artefacto de Corazones</title>
<style>@page { size: A4; margin: 15mm; } body { margin: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 6mm; } p { margin: 0; font-size: 10pt; color: #555; }</style>
</head><body><p>Artefacto de Corazones — tarjeta (9 x 13 cm)</p>${svg}</body></html>
`)
console.log("written to", here)
