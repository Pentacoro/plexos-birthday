// Everyone at the party, with their team, the playing card that stands for them, and how
// the welcome greets them (Bienvenido or Bienvenida). fake: a false password of their own, which
// the second letter of Detective Web gives them; it works as their real one, and the game keeps
// which was used. code: their own 3-digit code on spades' artifact, four papers. lang: "en" plays
// the game in English (lang.js). formerly: names a player had before, whose save moves to the
// new name on their next login (boot's password.js). Boot reads this before any core exists, so it stays a plain module.
export const players = [
    { name: "Cata", formerly: ["Catalina"], password: "EN9", fake: "3HV", code: "941", team: "clubs", card: "7", greeting: "Bienvenida" },
    { name: "Agos", formerly: ["Agostina"], password: "3WX", fake: "M6X", code: "325", team: "hearts", card: "8", greeting: "Bienvenida" },
    { name: "Orne", formerly: ["Ornella"], password: "JR9", fake: "ND3", code: "347", team: "diamonds", card: "10", greeting: "Bienvenida" },
    { name: "Benja", password: "9JA", fake: "Y67", code: "878", team: "spades", card: "K", greeting: "Bienvenido" },
    { name: "Misa", formerly: ["Misael"], password: "7CH", fake: "YV7", code: "738", team: "clubs", card: "3", greeting: "Bienvenido" },
    { name: "Enzo", password: "46A", fake: "9H9", code: "575", team: "clubs", card: "J", greeting: "Bienvenido" },
    { name: "Fer", password: "J9Y", fake: "V67", code: "758", team: "diamonds", card: "A", greeting: "Bienvenida" },
    { name: "Lu", password: "X3E", fake: "M7K", code: "189", team: "spades", card: "3", greeting: "Bienvenida" },
    { name: "Guilli", password: "9DV", fake: "3W9", code: "287", team: "diamonds", card: "K", greeting: "Bienvenido" },
    { name: "Kevin", password: "9Y3", fake: "M3P", code: "350", team: "spades", card: "A", greeting: "Bienvenido" },
    { name: "Sebas", formerly: ["Sebastian"], password: "3FU", fake: "EY3", code: "886", team: "clubs", card: "10", greeting: "Bienvenido" },
    { name: "Lina", password: "DD9", fake: "C4U", code: "660", team: "hearts", card: "2", greeting: "Bienvenida" },
    { name: "Agri", password: "HT7", fake: "9N7", code: "290", team: "diamonds", card: "Q", greeting: "Bienvenida" },
    { name: "Mariana", password: "Y73", fake: "X4R", code: "737", team: "hearts", card: "Q", greeting: "Bienvenida" },
    { name: "Katja", password: "7AM", fake: "AC6", code: "748", team: "clubs", card: "4", greeting: "Bienvenida" },
    { name: "Pentacoro", password: "VT7", fake: "RX4", code: "193", team: "hearts", card: "A", greeting: "Bienvenido" },
    { name: "Alan", password: "F3J", fake: "3JR", code: "204", team: "hearts", card: "6", greeting: "Bienvenido" },
    { name: "Alex", password: "4EX", fake: "4CY", code: "523", team: "hearts", card: "J", greeting: "Bienvenido" },
    { name: "Flopa", password: "U4M", fake: "HV4", code: "943", team: "spades", card: "5", greeting: "Bienvenida" },
    { name: "Male", formerly: ["Malena"], password: "RH9", fake: "TF7", code: "446", team: "spades", card: "10", greeting: "Bienvenida" },
    { name: "Sol", password: "4CV", fake: "49U", code: "202", team: "clubs", card: "Q", greeting: "Bienvenida" },
    { name: "Dani", formerly: ["Daniela"], password: "36U", fake: "9MF", code: "808", team: "spades", card: "Q", greeting: "Bienvenida" },
    { name: "Marce", password: "73M", fake: "C9C", code: "492", team: "diamonds", card: "J", greeting: "Bienvenido" },
    { name: "Samir", password: "K8R", fake: "W2D", code: "561", team: "diamonds", card: "9", greeting: "Bienvenido" },
    // spares, one per team, for a guest nobody expected: named by their card, blank on spades'
    // printed papers and left off the desktop one. To write a guest in, set their name and
    // greeting, keep the card name in formerly (the safe finds their equation and cells by it,
    // and anything played before moves to the new name), and drop spare.
    { name: "7 de Picas", password: "Q5P", fake: "8LT", code: "512", team: "spades", card: "7", greeting: "Bienvenido/a", spare: true },
    { name: "4 de Corazones", password: "Z4G", fake: "2KB", code: "836", team: "hearts", card: "4", greeting: "Bienvenido/a", spare: true },
    { name: "9 de Tréboles", password: "6WN", fake: "G3Y", code: "174", team: "clubs", card: "9", greeting: "Bienvenido/a", spare: true },
    { name: "8 de Diamantes", password: "B7Z", fake: "5RQ", code: "913", team: "diamonds", card: "8", greeting: "Bienvenido/a", spare: true },
    // test users, one per team, with the Entrenador app: remove before the party
    { name: "Prueba Picas", password: "PK1", fake: "VK7", code: "630", team: "spades", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    { name: "Prueba Corazones", password: "CR2", fake: "7NW", code: "625", team: "hearts", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    { name: "Prueba Tréboles", password: "TR3", fake: "4D9", code: "294", team: "clubs", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    { name: "Prueba Diamantes", password: "DM4", fake: "VT4", code: "658", team: "diamonds", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    // starts with the whole game done (Party's everything.js), and counts as Mariana and Pentacoro
    { name: "Prueba Todo", password: "TD5", fake: "Y7T", code: "466", team: "hearts", card: "A", greeting: "Bienvenido", everything: true, tester: true },
]

export function playerByPassword(password) {
    return players.find(player => player.password === password) || null
}

export function playerByName(name) {
    return players.find(player => player.name === name || player.formerly?.includes(name)) || null
}
