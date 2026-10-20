// Caja Fuerte, per player: every player has their own code in the stages that need one, so
// going through the safe as every player is the completionist's run. The equations are in
// equations.js and the codes of the third stage on spades' artifact (players.js, code).
// cells: the three cells of diamonds' maze the fourth stage shows, in order (their digits are in
// Labyrinth/numbers.js). symbols: the code the fifth stage writes in the team's column of
// hearts' card. Generated, each different from every other player's.
export const perPlayer = {
    "Cata"             : { cells: ["5,2", "2,1", "3,0"], symbols: "218" },   // cells read 260
    "Agos"             : { cells: ["2,1", "1,2", "4,4"], symbols: "565" },   // cells read 685
    "Orne"             : { cells: ["1,2", "3,0", "1,4"], symbols: "825" },   // cells read 803
    "Benja"            : { cells: ["3,3", "2,1", "5,2"], symbols: "830" },   // cells read 162
    "Misa"             : { cells: ["5,2", "2,5", "3,3"], symbols: "717" },   // cells read 271
    "Enzo"             : { cells: ["1,2", "0,0", "1,4"], symbols: "777" },   // cells read 893
    "Fer"              : { cells: ["1,2", "2,5", "1,4"], symbols: "927" },   // cells read 873
    "Lu"               : { cells: ["3,0", "5,2", "3,3"], symbols: "496" },   // cells read 021
    "Guilli"           : { cells: ["1,2", "4,2", "2,5"], symbols: "450" },   // cells read 847
    "Kevin"            : { cells: ["3,3", "1,2", "5,2"], symbols: "948" },   // cells read 182
    "Sebas"            : { cells: ["3,0", "2,1", "0,0"], symbols: "959" },   // cells read 069
    "Lina"             : { cells: ["4,2", "4,4", "3,0"], symbols: "482" },   // cells read 450
    "Agri"             : { cells: ["2,5", "3,3", "1,2"], symbols: "782" },   // cells read 718
    "Mariana"          : { cells: ["3,0", "4,4", "5,2"], symbols: "434" },   // cells read 052
    "Katja"            : { cells: ["0,0", "2,5", "2,1"], symbols: "672" },   // cells read 976
    "Pentacoro"        : { cells: ["5,2", "2,1", "3,3"], symbols: "795" },   // cells read 261
    "Alan"             : { cells: ["1,2", "0,0", "4,2"], symbols: "597" },   // cells read 894
    "Alex"             : { cells: ["2,5", "2,1", "1,4"], symbols: "934" },   // cells read 763
    "Flopa"            : { cells: ["2,5", "4,4", "4,2"], symbols: "818" },   // cells read 754
    "Male"             : { cells: ["1,4", "2,1", "4,4"], symbols: "226" },   // cells read 365
    "Sol"              : { cells: ["0,0", "2,1", "3,0"], symbols: "855" },   // cells read 960
    "Dani"             : { cells: ["3,3", "2,5", "3,0"], symbols: "400" },   // cells read 170
    "Marce"            : { cells: ["3,3", "0,0", "1,2"], symbols: "745" },   // cells read 198
    "Samir"            : { cells: ["4,4", "1,4", "4,2"], symbols: "613" },   // cells read 534
    // the spares (players.js), by their card names
    "7 de Picas"       : { cells: ["4,2", "3,3", "1,4"], symbols: "314" },   // cells read 413
    "4 de Corazones"   : { cells: ["4,4", "0,0", "5,2"], symbols: "506" },   // cells read 592
    "9 de Tréboles"    : { cells: ["1,2", "3,0", "2,1"], symbols: "691" },   // cells read 806
    "8 de Diamantes"   : { cells: ["2,5", "1,4", "0,0"], symbols: "873" },   // cells read 739
    "Prueba Picas"     : { cells: ["4,4", "5,2", "3,0"], symbols: "395" },   // cells read 520
    "Prueba Corazones" : { cells: ["1,4", "4,4", "2,5"], symbols: "784" },   // cells read 357
    "Prueba Tréboles"  : { cells: ["2,1", "4,2", "3,0"], symbols: "762" },   // cells read 640
    "Prueba Diamantes" : { cells: ["5,2", "1,2", "4,4"], symbols: "245" },   // cells read 285
    "Prueba Todo"      : { cells: ["0,0", "2,1", "4,4"], symbols: "555" },   // cells read 965
}
