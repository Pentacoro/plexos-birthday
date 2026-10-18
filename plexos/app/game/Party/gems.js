// Each team's gem, for the seal of its secret letter: cut in its own shape, faceted, lit from the
// upper left so it reads as solid, set in a white bezel that frames it against the team's color.
// Spades a pear, hearts a heart, clubs an emerald step cut, diamonds a round brilliant.

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
// toward white (amount above 0) or black (below 0)
function shade(hex, amount) {
    const [r, g, b] = hexToRgb(hex)
    const to = amount > 0 ? 255 : 0, k = Math.abs(amount)
    return `rgb(${[r, g, b].map(c => Math.round(c + (to - c) * k)).join(",")})`
}

const ring = (count, radius, start = -Math.PI / 2) => Array.from({ length: count }, (_, i) => {
    const a = start + i / count * Math.PI * 2
    return [Math.cos(a) * radius, Math.sin(a) * radius]
})

// the outline of each cut, centred, about 13 across
const outlines = {
    diamonds: () => ring(16, 12.5),
    hearts: () => Array.from({ length: 24 }, (_, i) => {
        const t = i / 24 * Math.PI * 2
        const x = 16 * Math.sin(t) ** 3
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        return [x * 0.78, y * 0.78 + 1]
    }),
    spades: () => Array.from({ length: 22 }, (_, i) => {
        // a pear: round below, drawn to a point above
        const t = i / 22 * Math.PI * 2
        const r = 9.5 * (1 - 0.45 * Math.sin(t / 2) ** 6)
        const y = -Math.cos(t) * 13 * (Math.cos(t) > 0 ? 1 : 0.75) + 1.5
        return [Math.sin(t) * r * (Math.cos(t) > 0 ? 1 - Math.cos(t) * 0.55 : 1), y]
    }),
    clubs: () => {
        const w = 10, h = 12.5, c = 3.6
        return [[-w + c, -h], [w - c, -h], [w, -h + c], [w, h - c], [w - c, h], [-w + c, h], [-w, h - c], [-w, -h + c]]
    },
}

const scale = (points, k) => points.map(([x, y]) => [x * k, y * k])
const poly = (points, fill, extra = "") => `<polygon points="${points.map(p => p.map(n => n.toFixed(2)).join(",")).join(" ")}" fill="${fill}" ${extra}/>`
const light = [-0.6, -0.8]

// facets between two rings of the same shape, each shaded by which way it faces the light
function band(outer, inner, color, depth) {
    let out = ""
    for (let i = 0; i < outer.length; i++) {
        const j = (i + 1) % outer.length
        const mx = (outer[i][0] + outer[j][0]) / 2, my = (outer[i][1] + outer[j][1]) / 2
        const len = Math.hypot(mx, my) || 1
        const facing = (mx / len) * light[0] + (my / len) * light[1]
        const tone = facing * depth + (i % 2 ? -0.06 : 0.06)
        out += poly([outer[i], outer[j], inner[j], inner[i]], shade(color, tone > 0 ? tone * 0.9 : tone), `stroke="${shade(color, -0.35)}" stroke-width="0.25" stroke-linejoin="round"`)
    }
    return out
}

export function gemSvg(team, color, className = "gem") {
    const girdle = outlines[team]()
    const steps = team === "clubs"
        ? [girdle, scale(girdle, 0.8), scale(girdle, 0.6)]
        : [girdle, scale(girdle, 0.52)]
    const bezel = scale(girdle, 1.32)
    let facets = ""
    for (let k = 0; k < steps.length - 1; k++) facets += band(steps[k], steps[k + 1], color, 0.55 - k * 0.12)
    // the table, the flat top, with a soft gradient
    const id = "gem-" + team
    const table = poly(steps.at(-1), `url(#${id}-table)`, `stroke="${shade(color, -0.3)}" stroke-width="0.25"`)
    // a star of facets on a brilliant's table
    const star = team === "diamonds" ? band(steps.at(-1), scale(steps.at(-1), 0.01), color, 0.35) : ""
    return `<svg class="${className}" viewBox="-20 -20 40 40">
        <defs>
            <radialGradient id="${id}-bezel" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#ecebef"/><stop offset="1" stop-color="#b9b7c0"/></radialGradient>
            <linearGradient id="${id}-table" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(color, 0.45)}"/><stop offset="0.6" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -0.3)}"/></linearGradient>
        </defs>
        ${poly(scale(girdle, 1.4), "rgba(0,0,0,0.28)", 'transform="translate(0.8 1.4)"')}
        ${poly(bezel, `url(#${id}-bezel)`, 'stroke="#a9a7b1" stroke-width="0.5" stroke-linejoin="round"')}
        ${poly(scale(girdle, 1.06), shade(color, -0.55))}
        ${facets}${table}${star}
        <polygon class="gem-glint" points="-5,-6 -2.5,-7.5 -1.5,-5 -4,-3.5" fill="#fff"/>
    </svg>`
}
