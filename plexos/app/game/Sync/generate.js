// The two puzzles a pair plays, built from a seeded generator so both phones get the same ones.
// The Sync app draws them; the Party reads their codes too (a player with everything).
import {pick, shuffle} from "/plexos/app/game/Sync/pairs.js"

// Stage 1: a path through a 3x3 pad, whose three keys type the initials of three colors
export const colors = [
    { letter: "P", color: "#b04cff" },
    { letter: "G", color: "#3ddc6a" },
    { letter: "O", color: "#ff9a2e" },
    { letter: "B", color: "#3f7bf5" },
    { letter: "Y", color: "#ffd83d" },
    { letter: "R", color: "#ff4a5a" },
]
export const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8]
// cells touching a cell, diagonals included
const near = (i) => cells.filter(j => j !== i && Math.abs(j % 3 - i % 3) <= 1 && Math.abs(Math.floor(j / 3) - Math.floor(i / 3)) <= 1)

export function pathPuzzle(rand) {
    const a = pick(rand, cells)
    const b = pick(rand, near(a))
    const c = pick(rand, near(b).filter(j => j !== a))
    const path = [a, b, c]
    const code = shuffle(rand, colors).slice(0, 3)
    const others = shuffle(rand, [
        ...colors.filter(color => !code.includes(color)).map(color => color.letter),
        ...shuffle(rand, ["K", "T", "W", "N", "L", "M"]).slice(0, 3),
    ])
    const letters = cells.map(cell => path.includes(cell) ? code[path.indexOf(cell)].letter : others.pop())
    return {
        path,
        code: code.map(color => color.letter).join(""),
        letters,
        symbols: shuffle(rand, cells),
        // the symbol that gives the diagram its turn: off the path, and not the middle one
        anchor: pick(rand, cells.filter(cell => !path.includes(cell) && cell !== 4)),
        turn: Math.floor(rand() * 4),
    }
}

// Stage 2: three looping strips of blocks, stacked; the steps that match the target are the code
export const steps = 10
export const width = steps

export function stackPuzzle(rand) {
    for (;;) {
        const strips = [0, 1, 2].map(() => Array.from({ length: steps }, () => pick(rand, [0, 1])))
        const solution = [0, 1, 2].map(() => Math.floor(rand() * 10))
        if (solution.every(step => step === 0)) continue
        const stack = (at) => Array.from({ length: width }, (_, c) => strips.reduce((sum, strip, i) => sum + strip[(at[i] + c) % steps], 0))
        const target = stack(solution).join()
        // only one way to reach it, so the code can't be anything else
        let ways = 0
        for (let a = 0; a < steps; a++) for (let b = 0; b < steps; b++) for (let c = 0; c < steps; c++) {
            if (stack([a, b, c]).join() === target) ways++
        }
        if (ways === 1) return { strips, solution, stack, target: stack(solution) }
    }
}
