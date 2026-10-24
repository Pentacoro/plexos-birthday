// Artifact 1, clubs': a disc with digits round its rim and four team-colored lines at its
// center, and a star whose five tips each carry a unique symbol. With the slit over a team's
// line, three of those tips — named by their symbols on the input — give that player's code.
// Which three and in what order is different for every player (perPlayer.js, starSymbols).
// Printed for the house, drawn on the desktop once clubs prove they found it (draw.js).
// The rim is printed, so it never changes on its own.

// Places round the rim, clockwise from the top. A star's tips are 72° apart, eight places, so
// with the slit on a line every tip points straight at one.
export const places = 40

// Each team's line, as the place the slit points at when lined up with it
export const lines = { clubs: 0, spades: 11, hearts: 22, diamonds: 33 }

// The five symbols in tip order clockwise from the top (same as the printed star)
export const tipSymbols = ["filled", "half", "target", "ring", "quad"]

// The digit a team reads at tip k (0–4, clockwise from the slit)
export const tipDigit = (team, k) => rim[(lines[team] + k * 8) % places]

// A player's 3-digit code from their personal symbol sequence (array of 3 symbol names)
export const readCode = (team, symbols) =>
    symbols.map(sym => tipDigit(team, tipSymbols.indexOf(sym))).join("")

// The digit at each place: the four teams' codes where they fall, filler everywhere else
export const rim = "3775876850944252106867967671641212625142"

export const teamColors = { spades: "#3fa9f5", hearts: "#ff4a5a", clubs: "#3ddc6a", diamonds: "#c94cff" }

// Fallback codes if perPlayer data is missing; clubs' is per-player via readCode
export const codes = { clubs: "357", spades: "482", hearts: "916", diamonds: "270" }
