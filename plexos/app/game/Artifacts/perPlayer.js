// Caja Fuerte, per player: every player has their own code in the stages that need one, so
// going through the safe as every player is the completionist's run. The equations are in
// equations.js and the codes of the third stage on spades' artifact (players.js, code).
// cells: the three cells of diamonds' maze the fourth stage shows, in order (their digits are in
// Labyrinth/numbers.js). symbols: the code the fifth stage writes in the team's column of
// hearts' card. starSymbols: the three star-disc tips (in order) for the second stage.
// Generated, each different from every other player's within their team.
export const perPlayer = {
    "Cata"             : { cells: ["5,2", "2,1", "3,0"], symbols: "218", starSymbols: ["filled","target","ring"]    },  // cells read 260, disc 317
    "Agos"             : { cells: ["2,1", "1,2", "4,4"], symbols: "565", starSymbols: ["filled","ring","target"]    },  // cells read 685, disc 964
    "Orne"             : { cells: ["1,2", "3,0", "1,4"], symbols: "825", starSymbols: ["half","quad","filled"] },  // cells read 803, disc 762
    "Benja"            : { cells: ["3,3", "2,1", "5,2"], symbols: "830", starSymbols: ["half","filled","quad"] },  // cells read 162, disc 845
    "Misa"             : { cells: ["5,2", "2,5", "3,3"], symbols: "717", starSymbols: ["half","ring","filled"]   },  // cells read 271, disc 573
    "Enzo"             : { cells: ["1,2", "0,0", "1,4"], symbols: "777", starSymbols: ["ring","filled","half"]   },  // cells read 893, disc 735
    "Fer"              : { cells: ["1,2", "2,5", "1,4"], symbols: "927", starSymbols: ["filled","quad","half"] },  // cells read 873, disc 267
    "Lu"               : { cells: ["3,0", "5,2", "3,3"], symbols: "496", starSymbols: ["filled","quad","half"] },  // cells read 021, disc 458
    "Guilli"           : { cells: ["1,2", "4,2", "2,5"], symbols: "450", starSymbols: ["quad","filled","half"] },  // cells read 847, disc 627
    "Kevin"            : { cells: ["3,3", "1,2", "5,2"], symbols: "948", starSymbols: ["quad","half","filled"] },  // cells read 182, disc 584
    "Sebas"            : { cells: ["3,0", "2,1", "0,0"], symbols: "959", starSymbols: ["target","half","filled"]  },  // cells read 069, disc 153
    "Lina"             : { cells: ["4,2", "4,4", "3,0"], symbols: "482", starSymbols: ["target","filled","ring"]    },  // cells read 450, disc 496
    "Agri"             : { cells: ["2,5", "3,3", "1,2"], symbols: "782", starSymbols: ["half","filled","quad"] },  // cells read 718, disc 726
    "Mariana"          : { cells: ["3,0", "4,4", "5,2"], symbols: "434", starSymbols: ["ring","target","filled"]    },  // cells read 052, disc 649
    "Katja"            : { cells: ["0,0", "2,5", "2,1"], symbols: "672", starSymbols: ["filled","ring","quad"]   },  // cells read 976, disc 371
    "Pentacoro"        : { cells: ["5,2", "2,1", "3,3"], symbols: "795", starSymbols: ["filled","quad","ring"]   },  // cells read 261, disc 956
    "Alan"             : { cells: ["1,2", "0,0", "4,2"], symbols: "597", starSymbols: ["quad","ring","filled"]   },  // cells read 894, disc 569
    "Alex"             : { cells: ["2,5", "2,1", "1,4"], symbols: "934", starSymbols: ["ring","filled","quad"]   },  // cells read 763, disc 695
    "Facu"             : { cells: ["4,2", "0,0", "3,3"], symbols: "647", starSymbols: ["half","filled","target"]   },  // cells read 491, disc 194
    "Flopa"            : { cells: ["2,5", "4,4", "4,2"], symbols: "818", starSymbols: ["filled","half","target"]  },  // cells read 754, disc 481
    "Male"             : { cells: ["1,4", "2,1", "4,4"], symbols: "226", starSymbols: ["target","filled","half"]  },  // cells read 365, disc 148
    "Sol"              : { cells: ["0,0", "2,1", "3,0"], symbols: "855", starSymbols: ["half","filled","ring"]   },  // cells read 960, disc 537
    "Dani"             : { cells: ["3,3", "2,5", "3,0"], symbols: "400", starSymbols: ["half","target","filled"]  },  // cells read 170, disc 814
    "Marce"            : { cells: ["3,3", "0,0", "1,2"], symbols: "745", starSymbols: ["half","target","quad"] },  // cells read 198, disc 706
    "Samir"            : { cells: ["4,4", "1,4", "4,2"], symbols: "613", starSymbols: ["target","filled","quad"]  },  // cells read 534, disc 026
    // the spares (players.js), by their card names
    "7 de Picas"       : { cells: ["4,2", "3,3", "1,4"], symbols: "314", starSymbols: ["ring","filled","quad"]   },  // cells read 413, disc 245
    "4 de Corazones"   : { cells: ["4,4", "0,0", "5,2"], symbols: "506", starSymbols: ["half","target","quad"] },  // cells read 592, disc 145
    "9 de Tréboles"    : { cells: ["1,2", "3,0", "2,1"], symbols: "691", starSymbols: ["ring","half","quad"]  },  // cells read 806, disc 751
    "8 de Diamantes"   : { cells: ["2,5", "1,4", "0,0"], symbols: "873", starSymbols: ["ring","half","filled"]   },  // cells read 739, disc 072
    "Prueba Picas"     : { cells: ["4,4", "5,2", "3,0"], symbols: "395", starSymbols: ["filled","half","ring"]   },  // cells read 520, disc 482
    "Prueba Corazones" : { cells: ["1,4", "4,4", "2,5"], symbols: "784", starSymbols: ["filled","half","ring"]   },  // cells read 357, disc 916
    "Prueba Tréboles"  : { cells: ["2,1", "4,2", "3,0"], symbols: "762", starSymbols: ["filled","half","ring"]   },  // cells read 640, disc 357
    "Prueba Diamantes" : { cells: ["5,2", "1,2", "4,4"], symbols: "245", starSymbols: ["filled","half","ring"]   },  // cells read 285, disc 270
    "Prueba Todo"      : { cells: ["0,0", "2,1", "4,4"], symbols: "555", starSymbols: ["ring","quad","half"]  },  // cells read 965, disc 651
}
