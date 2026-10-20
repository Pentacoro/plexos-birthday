// Artifact 4, hearts': a card that turns symbols into numbers, one column per team (Sync's
// artifactSymbols), next to the numbers 0 to 9. Printed for the house, and on the desktop once
// hearts have used it in Sync. Caja Fuerte's fifth stage shows each player a code of their own
// (Artifacts/perPlayer.js) in their team's column, so every team needs it.
import {artifactSymbols} from "../Sync/pairs.js"
export {artifactSymbols}

// the columns, in the card's order
export const columns = ["spades", "hearts", "clubs", "diamonds"]

// a code written in a team's column
export const encode = (team, code) => [...code].map(digit => artifactSymbols[team][digit]).join("")
