// Writes diamonds' maze cards for printing (cards.mjs): the artifact, with their package, and
// their own card, with the way in and out, which is the back of every diamonds player's card
// (assets/PlayerCards). Both are card sized, 63 x 88.2 mm.
//   node assets/MazeArtifact/print.mjs
// artifact.svg, own.svg, stack.svg (the artifact laid over their own card, the whole maze) and
// print.html: six artifacts on one A4, to print at 100% scale (no "fit to page") and cut on the
// marks. The whole maze goes to the desktop artifact (plexos/app/game/MazeArtifact/img/maze.svg).
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"
import {card, stack, CARD} from "./cards.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const mm = 63 / CARD.w
const svg = (w, h, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * mm}mm" height="${h * mm}mm">${content}</svg>\n`
const cardSvg = (name) => svg(CARD.w, CARD.h, card(name).svg)
const whole = stack()

fs.writeFileSync(path.join(here, "artifact.svg"), cardSvg("artifact"))
fs.writeFileSync(path.join(here, "own.svg"), cardSvg("own"))
fs.writeFileSync(path.join(here, "stack.svg"), svg(whole.w, whole.h, whole.svg))
fs.writeFileSync(path.join(here, "../../plexos/app/game/MazeArtifact/img/maze.svg"), svg(whole.w, whole.h, whole.svg))
// Six of the artifact on one A4, three by two, centred, with cut marks in the margin
const A4 = { w: 210, h: 297 }, W = 63, H = 88.2, cols = 3, rows = 2
const ox = (A4.w - cols * W) / 2, oy = (A4.h - rows * H) / 2
const piece = card("artifact").svg
let sheet = ""
const line = (x1, y1, x2, y2) => sheet += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="0.2"/>`
for (let c = 0; c <= cols; c++) { const x = ox + c * W; line(x, oy - 8, x, oy - 2); line(x, oy + rows * H + 2, x, oy + rows * H + 8) }
for (let r = 0; r <= rows; r++) { const y = oy + r * H; line(ox - 8, y, ox - 2, y); line(ox + cols * W + 2, y, ox + cols * W + 8, y) }
for (let i = 0; i < cols * rows; i++) {
    const x = ox + (i % cols) * W, y = oy + Math.floor(i / cols) * H
    sheet += `<svg x="${x}" y="${y}" width="${W}" height="${H}" viewBox="0 0 ${CARD.w} ${CARD.h}">${piece}</svg>`
}
fs.writeFileSync(path.join(here, "print.html"), `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Artefacto de Diamantes</title>
<style>@page { size: A4; margin: 0; } body { margin: 0; } svg { display: block; }</style>
</head><body><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${A4.w} ${A4.h}" width="${A4.w}mm" height="${A4.h}mm">${sheet}</svg></body></html>
`)
console.log("written to", here, "- whole maze", whole.w, "x", whole.h, "- 6 artifacts on one A4")
