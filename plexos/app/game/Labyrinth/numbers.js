// Diamonds' maze (mazes.js, "artifact") has a digit in some of its cells, seen only by standing
// on them in the Labyrinth (note.js): the two cards it is printed on, diamonds' own and
// artifact 3, mark those cells with a ring, but not what is in them. Caja Fuerte's fourth stage shows each player three of the cells
// (Artifacts/perPlayer.js) and asks for their digits, in that order.

// "column,row" of a cell in the artifact maze, and its digit: every digit, once each
export const numbers = {
    "3,0": "0",
    "3,3": "1",
    "5,2": "2",
    "1,4": "3",
    "4,2": "4",
    "4,4": "5",
    "2,1": "6",
    // the dead end right by the way in
    "2,5": "7",
    "1,2": "8",
    "0,0": "9",
}
