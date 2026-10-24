import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the diamantes number. DRAFT lines.
const sprite = { talking: "/plexos/app/game/Fibonacci/img/Diamond_Talking.png", rest: "/plexos/app/game/Fibonacci/img/Diamond_Idle.png" }

export default {
    name: null,
    team: "diamonds",
    sprite,
    // how they sound as they talk: crisp and clipped
    voice: { type: "sawtooth", freq: 270, jitter: 0.04, gain: 0.06, length: 0.04, filter: 2200 },
    // Before the party, the only thing said on any call (DRAFT lines, to be written)
    preview: [
        new Line(sprite, "Juguetería Rombic."),
        new Line(sprite, "No enviamos repuestos hasta el sábado 24 de octubre a las 9:00pm."),
    ],
    // Every call opens with this
    intro: [
        new Line(sprite, "Juguetería Rombic."),
    ],
    // Asked on the first call, and whenever the partner game sends someone. The one answer
    // is always the caller's own team, built at the call.
    question: "¿Afiliación?",
    // To another team: the first time after asking, then every call after
    refuse: [
        new Line(sprite, "..."),
        new Line(sprite, "Llame a su línea de afiliación."),
    ],
    refuseAgain: [
        new Line(sprite, "No vuelva a llamar."),
    ],
    // To the own team, every call until the code is solved
    ask: [
        new Line(sprite, "Tiene un pedido de repuestos para el 'Diamond Fidget Spinner Rubik's Cube 3x3x1'."),
        new Line(sprite, "Necesito el código de su producto. Ingréselo por el teclado."),
    ],
    right: [
        new Line(sprite, "Un momento..."),
        new Line(sprite, "..."),
        new Line(sprite, "Las 3 piezas de repuesto (ITEM) ya fueron enviadas. Llegan a las 10:00pm."),
        new Line(sprite, "Gracias. Hasta luego."),
    ],
    // To the own team once the code is solved: two questions to pick from, each with its own
    // reply. TEMPLATE: replace the labels and the replies.
    help: [
        new Line(sprite, "¿Sí?", {
            choices: [
                { label: "¿Eso es tu pelo?", reply: [new Line(sprite, "Se.")] },
                { label: "¿Cómo te llamás?", reply: [new Line(sprite, "Tomás.")] },
                { label: "Sos lindo.", reply: [
                    new Line(sprite, "..."),
                    new Line(sprite, "Okay.")
                ] },
            ],
        }),
    ],
    // To the partner in Sincronización Emparejada, once they reach its last stage
    expecting: (code) => [
        new Line(sprite, "..."),
        new Line(sprite, [...code].join(" ")),
    ],
}
