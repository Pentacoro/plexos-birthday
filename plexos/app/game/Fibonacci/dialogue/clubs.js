import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the tréboles number. DRAFT lines.
const sprite = { talking: "/plexos/app/game/Fibonacci/img/Club_Talking.png", rest: "/plexos/app/game/Fibonacci/img/Club_Smile.png" }

export default {
    name: null,
    sprite,
    // how they sound as they talk: bouncy, all over the place
    voice: { type: "triangle", freq: 340, jitter: 0.3, gain: 0.12, length: 0.05 },
    // Before the party, the only thing said on any call (DRAFT lines, to be written)
    preview: [
        new Line(sprite, "Buenas noches, te comunicaste con la línea de redención del Clover Club."),
        new Line(sprite, "Nuestras oficinas abren el 24 de octubre a las 10:00pm."),
        new Line(sprite, "Ya tiene nuestro número; hablamos entonces."),
    ],
    // Every call opens with this
    intro: [
        new Line(sprite, "Buenas noches. Gracias por llamar a la línea de redención de lotería del Clover Club."),
    ],
    // Asked on the first call, and whenever the partner game sends someone. The one answer
    // is always the caller's own team, built at the call.
    question: "¿Me decís tu afiliación?",
    // To another team: the first time after asking, then every call after
    refuse: [
        new Line(sprite, "Ah... Disculpá, no te puedo ayudar en este momento. Probá con la línea de tu club, o llamá mas tarde."),
        new Line(sprite, "¡Gracias!"),
    ],
    refuseAgain: [
        new Line(sprite, "Sí, habla con la línea de redención del Clover Club; le reitero que no puedo ayudarle en este momento."),
    ],
    // To the own team, every call until the code is solved
    ask: [
        new Line(sprite, "Clave. Voy a necesitar sus números."),
        new Line(sprite, "Si no lo tiene a mano, tómese su tiempo para encontrarlo e ingréselo por el teclado."),
    ],
    right: [
        new Line(sprite, "¡Gracias! Un momento..."),
        new Line(sprite, "¡Bingo! Le puedo confirmar que son números ganadores, y le corresponde una recompensa de..."),
        new Line(sprite, "..."),
        new Line(sprite, "Siete pesos."),
        new Line(sprite, "Y según puedo ver ya los debería haber recibido; fueron enviados el 19 de octubre."),
        new Line(sprite, "Hmmm, una vez que me dan un código que funciona..."),
        new Line(sprite, "¡En fin! Disfrute su recompensa. ¡Gracias por llamar a la línea de redención del Clover Club!"),
    ],
    // To the own team once the code is solved: two questions to pick from, each with its own
    // reply. TEMPLATE: replace the labels and the replies.
    help: [
        new Line(sprite, "¿Qué onda?", {
            choices: [
                { label: "¿Qué estás escuchando?", reply: [
                    new Line(sprite, "Nujabes."),
                    new Line(sprite, "Buscalo YA."),
                    new Line(sprite, "Murió el chabón, un ponja, pero genio mal."),
                    new Line(sprite, "¿Viste que siempre hay un ponja que es un genio mal?"),
                    new Line(sprite, "No sé qué les daran de comer. ¿Sushi? ndeah"),
                    new Line(sprite, "Dicen que lo mas parecido a la consistencia del cerebro es el tofu... andá a saber. ¿No?"),
                ] },
                { label: "¿Tu nombre?", reply: [
                    new Line(sprite, "Hmmm. No me gusta mi nombre."),
                    new Line(sprite, "Decime 'Low Temp'. O 'Low' más fácil.")
                ] },
                { label: "Sos re fachero amigo", reply: [
                    new Line(sprite, "Mirá quien habla.")
                ] },
            ],
        }),
    ],
    // To the partner in Sincronización Emparejada, once they reach its last stage
    expecting: (code) => [
        new Line(sprite, "A ver... ¡Sí! Emparejamiento ¿No?"),
        new Line(sprite, "El código es " + [...code].join(" ") + ". Mandale mecha, y un saludo a mi compañero."),
    ],
}
