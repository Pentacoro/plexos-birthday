import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the diamantes number. DRAFT lines.
const sprite = "/plexos/app/game/Fibonacci/img/diamonds.png"

export default {
    name: null,
    sprite,
    // how they sound as they talk: crisp and clipped
    voice: { type: "sawtooth", freq: 270, jitter: 0.04, gain: 0.06, length: 0.04, filter: 2200 },
    // Every call opens with this
    intro: [
        new Line(sprite, "¡Hola! Habla el contacto de Diamantes."),
    ],
    // Asked on the first call, and whenever the partner game sends someone. The one answer
    // is always the caller's own team, built at the call.
    question: "¿De qué equipo sos?",
    // To another team: the first time after asking, then every call after
    refuse: [
        new Line(sprite, "Ah, en este momento no te puedo ayudar."),
        new Line(sprite, "¡Gracias por llamar!"),
    ],
    refuseAgain: [
        new Line(sprite, "Perdón, en este momento no te puedo ayudar."),
    ],
    // To the own team, every call until the code is solved
    ask: [
        new Line(sprite, "Para seguir necesito un código de nueve dígitos."),
        new Line(sprite, "Se arma con los códigos de las tarjetas de otros equipos. Ya sabés a quiénes preguntarles."),
    ],
    right: [
        new Line(sprite, "¡Perfecto! Ese es."),
    ],
    // To the own team once the code is solved: two questions to pick from, each with its own
    // reply. TEMPLATE: replace the labels and the replies.
    help: [
        new Line(sprite, "¿En qué le puedo ayudar?", {
            choices: [
                { label: "OPCIÓN 1", reply: [new Line(sprite, "RESPUESTA 1")] },
                { label: "OPCIÓN 2", reply: [new Line(sprite, "RESPUESTA 2")] },
            ],
        }),
    ],
    // To the partner in Sincronización Emparejada, once they reach its last stage
    expecting: (code) => [
        new Line(sprite, "¡Te estaba esperando!"),
        new Line(sprite, "El código es " + [...code].join(" ") + "."),
    ],
}
