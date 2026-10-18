// Everyone at the party, with their team, the playing card that stands for them, and how
// the welcome greets them (Bienvenido or Bienvenida). lang: "en" plays the game in English (lang.js). Boot reads this before any core exists, so it stays a plain module.
export const players = [
    { name: "Catalina", password: "EN9", team: "clubs", card: "7", greeting: "Bienvenida" },
    { name: "Fer", password: "3WX", team: "hearts", card: "8", greeting: "Bienvenida" },
    { name: "Ornella", password: "JR9", team: "diamonds", card: "10", greeting: "Bienvenida" },
    { name: "Benja", password: "9JA", team: "spades", card: "K", greeting: "Bienvenido" },
    { name: "Misael", password: "7CH", team: "clubs", card: "3", greeting: "Bienvenido" },
    { name: "Enzo", password: "46A", team: "clubs", card: "J", greeting: "Bienvenido" },
    { name: "Agostina", password: "J9Y", team: "diamonds", card: "A", greeting: "Bienvenida" },
    { name: "Lu", password: "X3E", team: "spades", card: "3", greeting: "Bienvenida" },
    { name: "Alan", password: "9DV", team: "diamonds", card: "K", greeting: "Bienvenido" },
    { name: "Kevin", password: "9Y3", team: "spades", card: "A", greeting: "Bienvenido" },
    { name: "Sebastian", password: "3FU", team: "clubs", card: "10", greeting: "Bienvenido" },
    { name: "Lina", password: "DD9", team: "hearts", card: "2", greeting: "Bienvenida" },
    { name: "Agri", password: "HT7", team: "diamonds", card: "Q", greeting: "Bienvenida" },
    { name: "Mariana", password: "Y73", team: "hearts", card: "Q", greeting: "Bienvenida" },
    { name: "Katja", password: "7AM", team: "clubs", card: "4", greeting: "Bienvenida" },
    { name: "Pentacoro", password: "VT7", team: "hearts", card: "A", greeting: "Bienvenido" },
    { name: "Guilli", password: "F3J", team: "hearts", card: "K", greeting: "Bienvenido" },
    { name: "Alex", password: "4EX", team: "hearts", card: "J", greeting: "Bienvenido" },
    { name: "Flopa", password: "U4M", team: "spades", card: "J", greeting: "Bienvenida" },
    { name: "Malena", password: "RH9", team: "spades", card: "10", greeting: "Bienvenida" },
    { name: "Sol", password: "4CV", team: "clubs", card: "Q", greeting: "Bienvenida" },
    { name: "Daniela", password: "36U", team: "spades", card: "Q", greeting: "Bienvenida" },
    { name: "Marce", password: "73M", team: "diamonds", card: "J", greeting: "Bienvenido" },
    // test users, one per team, with the Entrenador app: remove before the party
    { name: "Prueba Picas", password: "PK1", team: "spades", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    { name: "Prueba Corazones", password: "CR2", team: "hearts", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    { name: "Prueba Tréboles", password: "TR3", team: "clubs", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    { name: "Prueba Diamantes", password: "DM4", team: "diamonds", card: "A", greeting: "Bienvenido", tester: true, lang: "en" },
    // starts with the whole game done (Party's everything.js), and counts as Mariana and Pentacoro
    { name: "Prueba Todo", password: "TD5", team: "hearts", card: "A", greeting: "Bienvenido", everything: true, tester: true },
]

export function playerByPassword(password) {
    return players.find(player => player.password === password) || null
}

export function playerByName(name) {
    return players.find(player => player.name === name) || null
}
