// Stage 1: each player's own equation. Its unknowns are the items of the other three teams
// ({spades} 5 Lapiceras, {hearts} 12 Bombones, {clubs} 7 Pesos, {diamonds} 3 Piezas de Cubo
// Rubik), each used once, so the values have to come from the other teams. ² squares what is
// just before it; √[ ... ] is a square root, always of a perfect square. Every answer is whole.
export const equations = {
    "Benja"            : { text: "{hearts} × ({clubs} + {diamonds}) ÷ 2" , answer:  60 },
    "Lu"               : { text: "{hearts} × {clubs} ÷ {diamonds}"       , answer:  28 },
    "Kevin"            : { text: "{clubs} × {hearts} − {diamonds}²"      , answer:  75 },
    "Flopa"            : { text: "{hearts} × {diamonds} + {clubs}"       , answer:  43 },
    "Malena"           : { text: "{diamonds} × {hearts} − {clubs}"       , answer:  29 },
    "Daniela"          : { text: "√[{hearts} − {diamonds}] + {clubs} × 2", answer:  17 },
    "Prueba Picas"     : { text: "2 × ({diamonds} + {hearts}) − {clubs}" , answer:  23 },
    "Fer"              : { text: "2 × ({spades} + {clubs}) − {diamonds}" , answer:  21 },
    "Lina"             : { text: "2 × {clubs} + {spades} × {diamonds}"   , answer:  29 },
    "Mariana"          : { text: "{clubs}² − {spades} × {diamonds}"      , answer:  34 },
    "Pentacoro"        : { text: "{spades} × ({clubs} + {diamonds}) ÷ 2" , answer:  25 },
    "Guilli"           : { text: "{spades} + {clubs} × {diamonds}"       , answer:  26 },
    "Alex"             : { text: "√[{clubs} + {spades} − {diamonds}] × 5", answer:  15 },
    "Prueba Corazones" : { text: "({spades} − {diamonds}) × {clubs}"     , answer:  14 },
    "Prueba Todo"      : { text: "{spades} × {clubs} + {diamonds}"       , answer:  38 },
    "Catalina"         : { text: "2 × {hearts} + {spades} × {diamonds}"  , answer:  39 },
    "Misael"           : { text: "{spades} + {hearts} × {diamonds}"      , answer:  41 },
    "Enzo"             : { text: "{diamonds} × {hearts} − {spades}²"     , answer:  11 },
    "Sebastian"        : { text: "({spades} + {hearts}) × {diamonds}"    , answer:  51 },
    "Katja"            : { text: "{spades} × {hearts} − {diamonds}"      , answer:  57 },
    "Sol"              : { text: "{spades} × √[{diamonds} × {hearts}]"   , answer:  30 },
    "Prueba Tréboles"  : { text: "{hearts} × {spades} ÷ {diamonds}"      , answer:  20 },
    "Ornella"          : { text: "{hearts} × {spades} + {clubs}"         , answer:  67 },
    "Agostina"         : { text: "({hearts} + {clubs}) × {spades}"       , answer:  95 },
    "Alan"             : { text: "{hearts}² − {spades} × {clubs}"        , answer: 109 },
    "Agri"             : { text: "{hearts} + {spades} × {clubs}"         , answer:  47 },
    "Marce"            : { text: "2 × ({spades} + {hearts}) − {clubs}"   , answer:  27 },
    "Prueba Diamantes" : { text: "{hearts}² + {spades} − {clubs}"        , answer: 142 },
}
