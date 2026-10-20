import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the corazones number. DRAFT lines.
const sprite = { talking: "/plexos/app/game/Fibonacci/img/Heart_Talking.png", rest: "/plexos/app/game/Fibonacci/img/Heart_Idle.png" }

export default {
    name: null,
    sprite,
    // how they sound as they talk: soft and high, lifting
    voice: { type: "sine", freq: 560, jitter: 0.06, glide: 0.08, gain: 0.12, length: 0.06 },
    // Before the party, the only thing said on any call (DRAFT lines, to be written)
    preview: [
        new Line(sprite, "¡Buenas noches! Usted llamó a la Bombonería Dulcinea."),
        new Line(sprite, "Actualmente, esta línea se encuentra reservada para el sábado 24 de octubre a partir de las 10:00pm."),
        new Line(sprite, "Por favor, vuélvanos a llamar este sábado. ¡Gracias!"),
    ],
    // Every call opens with this
    intro: [
        new Line(sprite, "¡Buenas noches! Habla con la Bombonería Dulcinea."),
    ],
    // Asked on the first call, and whenever the partner game sends someone. The one answer
    // is always the caller's own team, built at the call.
    question: "¿De dónde llama?",
    // To another team: the first time after asking, then every call after
    refuse: [
        new Line(sprite, "Awww... Disculpame, corazón, acá no es. Tenés que llamar al número de tu localidad."),
        new Line(sprite, "Gracias por entender, gracias por llamar a la Bombonería Dulcinea. ¡Que tengas una linda noche!"),
    ],
    refuseAgain: [
        new Line(sprite, "Mi vida... No te puedo ayudar ahora; probá más tarde. ¿Sí?"),
        new Line(sprite, "Gracias por llamar a la Bombonería Dulcinea. ¡Que tengas una linda noche!"),
    ],
    // To the own team, every call until the code is solved
    ask: [
        new Line(sprite, "¡Un gusto hablar con usted!"),
        new Line(sprite, "Se lleva entonces una docena de bombones a su domicilio."),
        new Line(sprite, "Tan solo confírmeme el número del pedido para enviárselo. Cuando esté listo, márquelo en el teclado."),
    ],
    right: [
        new Line(sprite, "¡Excelente! Doce bombones camino a Boulogne Sur Mer. Llegan 11:30pm."),
        new Line(sprite, "Gracias por llamar a la Bombonería Dulcinea. ¡Que tengas una linda noche!"),
    ],
    // To the own team once the code is solved: two questions to pick from, each with its own
    // reply. TEMPLATE: replace the labels and the replies.
    help: [
        new Line(sprite, "¿En qué le puedo ayudar?", {
            choices: [
                { label: "¿No es un poco tarde?", reply: [
                    new Line(sprite, "Ayyy ¡Qué confrontacional! Pero sí, estos no son nuestros horarios de jornada usuales."),
                    new Line(sprite, "Tampoco abrimos sábados, pero hoy reservaron nuestro servicio para los invitados del cumpleaños de un tal... ¿Pentacoro?"),
                    new Line(sprite, "Asumí que serías alguien del cumple. De cualquier forma, tiene mi número, y estoy a su disposición."),
                ] },
                { label: "¿Cómo se llama?", reply: [
                    new Line(sprite, "¡Dulcinea! Soy la dueña."),
                    new Line(sprite, "Decidí tomar control de mi propio determinismo nominativo con el nombre que me dieron. ¡Ser y hacer lo dulce!"),
                    new Line(sprite, "...y no la fantasía de un inútil con complejo de grandeza."),
                    new Line(sprite, "¡Pero esos son solo cuentos!")
                ] },
                { label: "Gracias por todo.", reply: [
                    new Line(sprite, "¡Gracias a usted!"),
                ] },
            ],
        }),
    ],
    // To the partner in Sincronización Emparejada, once they reach its last stage
    expecting: (code) => [
        new Line(sprite, "¡Hola! Un gusto."),
        new Line(sprite, "Sí, el código. Un segundo..."),
        new Line(sprite, "..."),
        new Line(sprite, "¡Acá está! Es el " + [...code].join(" ") + ". ¡Gracias por elegirnos!"),
    ],
}
