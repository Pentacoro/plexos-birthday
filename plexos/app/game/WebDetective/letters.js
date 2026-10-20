// The letters that arrive in Detective Web, one per step, in order, each team with its own.
// Write them here. Line breaks are kept as written. {falsa} is the reader's own fake password:
// the second letter gives it to them.

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

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.

Tu contraseña falsa: {falsa}`,
        hearts: `Corazones, paso 2.

Curabitur pretium tincidunt lacus. Est eros bibendum elit, nec luctus magna felis sollicitudin mauris.

Tu contraseña falsa: {falsa}`,
        clubs: `Tréboles, paso 2.

Curabitur pretium tincidunt lacus. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus.

Tu contraseña falsa: {falsa}`,
        diamonds: `Diamantes, paso 2.

Curabitur pretium tincidunt lacus. Vulputate vehicula. Donec lobortis risus a elit. Etiam tempor.

Tu contraseña falsa: {falsa}`,
    },
]

// The last letter, after the last step is answered: it comes in a black envelope with a gold
// seal. DRAFT: write them here.
export const final = {
    spades: `Picas, carta final.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    hearts: `Corazones, carta final.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    clubs: `Tréboles, carta final.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    diamonds: `Diamantes, carta final.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
}

// The secret letter, for answering the final one with passwords of three other teams: it comes
// in an envelope of the team's color with a rainbow stamp and a gem for a seal. DRAFT.
export const secret = {
    spades: `Picas, carta secreta.

Lorem ipsum dolor sit amet.`,
    hearts: `Corazones, carta secreta.

Lorem ipsum dolor sit amet.`,
    clubs: `Tréboles, carta secreta.

Lorem ipsum dolor sit amet.`,
    diamonds: `Diamantes, carta secreta.

Lorem ipsum dolor sit amet.`,
}

// Only for Mariana: once she answers the secret letter (with a heart), this comes in velvet red,
// from Pentacoro. Write it here.
export const queen = `Mariana:

Acá va el mensaje especial.`

// Heads the letter that comes back after a wrong answer, above that same letter again
export const wrong = `Incorrecto`

// What the screen says once every letter has been answered
export const finished = `Lorem ipsum: no hay más cartas por ahora.`
