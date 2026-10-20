import {teams} from "/plexos/app/game/Party/teams.js"

// The same card the player is dealt, drawn like the other app icons: a dark card, the rank,
// and their suit in the team's color. A data URL, so each player's desktop can keep its own.
const fallback = "/plexos/app/game/Status/icon.svg"

export function cardIcon(player) {
    const team = teams[player?.team]
    const rank = String(player?.card || "")
    if (!team || !rank) return fallback
    const size = rank.length > 1 ? 13 : 16
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="5" width="36" height="54" rx="5" fill="#1b1b20"/>
    <text x="18" y="23" fill="#fff" stroke="none" font-family="system-ui, sans-serif" font-weight="700" font-size="${size}">${rank}</text>
    <svg x="18" y="27" width="28" height="28" viewBox="0 0 24 24" stroke="none">
        <path d="${team.path}" fill="none" stroke="${team.color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
</svg>`
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
}
