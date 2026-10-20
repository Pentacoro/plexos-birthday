// Writes clubs' artifact for printing, at real size, from the same numbers as the desktop one:
//   node assets/StarDisc/print.mjs
// disc.svg and star.svg (16 cm across), and print.html with both, one per page. Print at 100%
// scale (no "fit to page"). Cut the star along its outline, and its slit out of it.
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"
import {discSvg, starSvg} from "../../plexos/app/game/StarDisc/draw.js"

const here = path.dirname(fileURLToPath(import.meta.url))
const size = "160mm"
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="${size}" height="${size}">${body}</svg>\n`

fs.writeFileSync(path.join(here, "disc.svg"), svg(discSvg()))
fs.writeFileSync(path.join(here, "star.svg"), svg(starSvg({ id: "print-star" })))
fs.writeFileSync(path.join(here, "print.html"), `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Artefacto de Tréboles</title>
<style>
@page { size: A4; margin: 15mm; }
body { margin: 0; font-family: Arial, sans-serif; }
.page { display: flex; flex-direction: column; align-items: center; gap: 6mm; page-break-after: always; }
p { margin: 0; font-size: 10pt; color: #555; }
</style></head><body>
<div class="page"><p>Artefacto de Tréboles — disco (16 cm)</p>${svg(discSvg())}</div>
<div class="page"><p>Artefacto de Tréboles — estrella: recortar el contorno y la ranura</p>${svg(starSvg({ id: "print-star" }))}</div>
</body></html>
`)
console.log("written to", here)
