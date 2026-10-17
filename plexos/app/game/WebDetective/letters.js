// The letters that arrive in Detective Web, one per step, in order, each team with its own.
// Write them here. Line breaks are kept as written.

export const letters = [
    // Step 1
    {
        spades: `Picas, paso 1.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        hearts: `Corazones, paso 1.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
        clubs: `Tréboles, paso 1.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.`,
        diamonds: `Diamantes, paso 1.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa.`,
    },
    // Step 2
    {
        spades: `Picas, paso 2.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.`,
        hearts: `Corazones, paso 2.

Curabitur pretium tincidunt lacus. Est eros bibendum elit, nec luctus magna felis sollicitudin mauris.`,
        clubs: `Tréboles, paso 2.

Curabitur pretium tincidunt lacus. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus.`,
        diamonds: `Diamantes, paso 2.

Curabitur pretium tincidunt lacus. Vulputate vehicula. Donec lobortis risus a elit. Etiam tempor.`,
    },
]

// Heads the letter that comes back after a wrong answer, above that same letter again
export const wrong = `Incorrecto`

// What the screen says once every letter has been answered
export const finished = `Lorem ipsum: no hay más cartas por ahora.`
