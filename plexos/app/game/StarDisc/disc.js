// Artifact 1, clubs': a disc with digits round its rim and four team-colored lines at its
// center, and a star with a slit from its center to one of its tips. With the slit over a team's
// line, the star's three marked tips (one, two and three dots, read in that order) point at
// that team's code. Printed for the house, and drawn on the desktop once clubs prove they found
// it (draw.js). The same numbers make both, so they always agree. Changing a code means
// changing the rim too: the rim is printed, so it never changes on its own.

// Places round the rim, clockwise from the top. A star's tips are 72° apart, eight places, so
// with the slit on a line every tip points straight at one.
export const places = 40

// Each team's line, as the place the slit points at when lined up with it
export const lines = { clubs: 0, spades: 11, hearts: 22, diamonds: 33 }

// The marked tips, in reading order, as places after the slit's own (tips 1, 2 and 4)
export const marked = [0, 8, 24]

// What each team reads. Clubs' is also the first part of their phone code (Fibonacci).
export const codes = { clubs: "357", spades: "482", hearts: "916", diamonds: "270" }

// The digit at each place: the four codes where they fall, filler everywhere else
export const rim = "3775876850944252106867967671641212625142"

export const teamColors = { spades: "#3fa9f5", hearts: "#ff4a5a", clubs: "#3ddc6a", diamonds: "#c94cff" }

// A team's code as the disc gives it, worked out from the rim
export const readCode = (team) => marked.map(offset => rim[(lines[team] + offset) % places]).join("")
