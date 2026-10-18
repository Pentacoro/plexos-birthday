import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the tréboles number. DRAFT lines.
const sprite = "/plexos/app/game/Fibonacci/img/clubs.png"

export default {
    name: null,
    sprite,
    // how they sound as they talk: bouncy, all over the place
    voice: { type: "triangle", freq: 340, jitter: 0.3, gain: 0.12, length: 0.05 },
    // Every call opens with this
    intro: [
        new Line(sprite, "Buenas noches. Gracias por llamar a la línea de redención del Clover Club."),
    ],
    // Asked on the first call, and whenever the partner game sends someone. The one answer
    // is always the caller's own team, built at the call.
    question: "¿Me decís tu afiliación?",
    // To another team: the first time after asking, then every call after
    refuse: [
        new Line(sprite, "Ah... Disculpá, no te puedo ayudar en este momento. Pruebe con la línea de su club, o llame mas tarde."),
        new Line(sprite, "¡Gracias!"),
    ],
    refuseAgain: [
        new Line(sprite, "Habla con la línea de redención del Clover Club; le reitero que no puedo ayudarle en este momento."),
    ],
    // To the own team, every call until the code is solved
    ask: [
        new Line(sprite, "Clave. Voy a necesitar el código de recompensa."),
        new Line(sprite, "Si no lo tiene a mano, tómese su tiempo para encontrarlo e ingréselo por el teclado."),
    ],
    right: [
        new Line(sprite, "¡Gracias! Un momento..."),
        new Line(sprite, "¡Bingo! Le puedo confirmar que su código es correcto, y le corresponde una recompensa de..."),
        new Line(sprite, "..."),
        new Line(sprite, "Siete pesos."),
        new Line(sprite, "Y según puedo ver ya los debería haber recibido; fueron enviados el 19 de octubre."),
        new Line(sprite, "Hmmm, una vez que me dan un código que funciona..."),
        new Line(sprite, "¡En fin! Disfrute su recompensa. ¡Gracias por llamar a la línea de redención del Clover Club!"),
    ],
    // To the own team once the code is solved: two questions to pick from, each with its own
    // reply. TEMPLATE: replace the labels and the replies.
    help: [
        new Line(sprite, "Buenas noches. ¿En qué le puedo ayudar?", {
            choices: [
                { label: "OPCIÓN 1", reply: [new Line(sprite, "RESPUESTA 1")] },
                { label: "OPCIÓN 2", reply: [new Line(sprite, "RESPUESTA 2")] },
            ],
        }),
    ],
    // To the partner in Sincronización Emparejada, once they reach its last stage
    expecting: (code) => [
        new Line(sprite, "A ver... ¡Sí! Emparejamiento ¿No?"),
        new Line(sprite, "El código es " + [...code].join(" ") + "."),
        new Line(sprite, "¡Gracias!"),
    ],
}
