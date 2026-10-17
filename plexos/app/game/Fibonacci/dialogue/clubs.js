import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the clubs number. Clubs is the team that hunts this puzzle's artifact. DRAFT lines.
const sprite = "/plexos/app/game/Fibonacci/img/clubs.png"

export default {
    name: null,
    sprite,
    refuse: [
        new Line(sprite, "¿Hola? Vos no sos de Tréboles. No tengo permitido hablar con vos."),
        new Line(sprite, "Chau."),
    ],
    // Every call until the code is solved
    ask: [
        new Line(sprite, "¡Hola! Te estaba esperando."),
        new Line(sprite, "Para seguir necesito un código de nueve dígitos."),
        new Line(sprite, "Dos partes están en las tarjetas de otros equipos. La primera no la tiene nadie: está escondida en algún lugar de la casa."),
    ],
    right: [
        new Line(sprite, "¡Perfecto! Ese es."),
    ],
    // Every call after the code is solved: a greeting, then three questions to pick from,
    // each with its own reply. TEMPLATE: replace the greeting, the labels and the replies.
    greeting: [
        new Line(sprite, "SALUDO", {
            choices: [
                { label: "OPCIÓN 1", reply: [new Line(sprite, "RESPUESTA 1")] },
                { label: "OPCIÓN 2", reply: [new Line(sprite, "RESPUESTA 2")] },
                { label: "OPCIÓN 3", reply: [new Line(sprite, "RESPUESTA 3")] },
            ],
        }),
    ],
}
