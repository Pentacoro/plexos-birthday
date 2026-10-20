// Writes diamonds' maze cards for printing (cards.mjs): the artifact, with their package, and
// their own card, with the way in and out, which is the back of every diamonds player's card
// (assets/PlayerCards). Both are card sized, 63 x 88.2 mm.
//   node assets/MazeArtifact/print.mjs
// artifact.svg, own.svg, stack.svg (the artifact laid over their own card, the whole maze) and
// print.html, the artifact to print at 100% scale (no "fit to page"). The whole maze goes to
// the desktop artifact (plexos/app/game/MazeArtifact/img/maze.svg).
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
fs.writeFileSync(path.join(here, "print.html"), `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Artefacto de Diamantes</title>
<style>@page { size: A4; margin: 15mm; } body { margin: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 6mm; } p { margin: 0; font-size: 10pt; color: #555; }</style>
</head><body><p>Artefacto de Diamantes — carta (63 x 88,2 mm)</p>${cardSvg("artifact")}</body></html>
`)
console.log("written to", here, "- whole maze", whole.w, "x", whole.h)
