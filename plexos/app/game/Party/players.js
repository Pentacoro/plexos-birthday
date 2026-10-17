// Everyone at the party, with their team, the playing card that stands for them, and how
// the welcome greets them (Bienvenido or Bienvenida). Boot reads this before any core exists, so it stays a plain module.
export const players = [
    { name: "Catalina", password: "877", team: "clubs", card: "7", greeting: "Bienvenida" },
    { name: "Fer", password: "869", team: "hearts", card: "8", greeting: "Bienvenida" },
    { name: "Ornella", password: "980", team: "diamonds", card: "10", greeting: "Bienvenida" },
    { name: "Benja", password: "618", team: "spades", card: "K", greeting: "Bienvenido" },
    { name: "Misael", password: "924", team: "clubs", card: "3", greeting: "Bienvenido" },
    { name: "Enzo", password: "364", team: "clubs", card: "J", greeting: "Bienvenido" },
    { name: "Agostina", password: "500", team: "diamonds", card: "A", greeting: "Bienvenida" },
    { name: "Lu", password: "781", team: "spades", card: "3", greeting: "Bienvenida" },
    { name: "Alan", password: "107", team: "diamonds", card: "K", greeting: "Bienvenido" },
    { name: "Kevin", password: "731", team: "spades", card: "A", greeting: "Bienvenido" },
    { name: "Sebastian", password: "296", team: "clubs", card: "10", greeting: "Bienvenido" },
    { name: "Lina", password: "038", team: "hearts", card: "2", greeting: "Bienvenida" },
    { name: "Agri", password: "311", team: "diamonds", card: "Q", greeting: "Bienvenida" },
    { name: "Mariana", password: "561", team: "hearts", card: "Q", greeting: "Bienvenida" },
    { name: "Katja", password: "862", team: "clubs", card: "4", greeting: "Bienvenida" },
    { name: "Pentacoro", password: "996", team: "hearts", card: "A", greeting: "Bienvenido" },
    { name: "Guilli", password: "798", team: "hearts", card: "K", greeting: "Bienvenido" },
    { name: "Alex", password: "147", team: "hearts", card: "J", greeting: "Bienvenido" },
    { name: "Flopa", password: "487", team: "spades", card: "J", greeting: "Bienvenida" },
    { name: "Malena", password: "179", team: "spades", card: "10", greeting: "Bienvenida" },
    { name: "Sol", password: "928", team: "clubs", card: "Q", greeting: "Bienvenida" },
    { name: "Daniela", password: "249", team: "spades", card: "Q", greeting: "Bienvenida" },
    { name: "Marce", password: "386", team: "diamonds", card: "J", greeting: "Bienvenido" },
]

export function playerByPassword(password) {
    return players.find(player => player.password === password) || null
}

export function playerByName(name) {
    return players.find(player => player.name === name) || null
}
