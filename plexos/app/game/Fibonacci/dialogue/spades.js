import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers the picas number. DRAFT lines.
const sprite = { talking: "/plexos/app/game/Fibonacci/img/Spade_Talking.png", rest: "/plexos/app/game/Fibonacci/img/Spade_Smile.png" }

export default {
    name: null,
    sprite,
    // how they sound as they talk: calm and smooth
    voice: { type: "triangle", freq: 230, jitter: 0.05, gain: 0.12, length: 0.06 },
    // Before the party, the only thing said on any call (DRAFT lines, to be written)
    preview: [
        new Line(sprite, "¡Buenas noches! Le responden de Naipes, su librería de confianza."),
        new Line(sprite, "Esta línea de atención fue reservada para la fecha del 24 de octubre; el próximo sábado."),
        new Line(sprite, "Esperaremos su llamada a partir de las 10:00pm. ¡Gracias por escribir con Naipes, su librería de confianza!"),
    ],
    // Every call opens with this
    intro: [
        new Line(sprite, "¡Buenas noches! Le hablo de Naipes, su librería de confianza."),
    ],
    // Asked on the first call, and whenever the partner game sends someone. The one answer
    // is always the caller's own team, built at the call.
    question: "¿Me dijera por favor su afiliación?",
    // To another team: the first time after asking, then every call after
    refuse: [
        new Line(sprite, "Lamento comunicarle que en este momento no podemos ayudarle. Pónganse en contacto con su línea de afiliación o comuníquese mas tarde."),
        new Line(sprite, "¡Gracias por escribir con Naipes, su librería de confianza! ¡Buenas noches!"),
    ],
    refuseAgain: [
        new Line(sprite, "Le reitero que en este momento no podemos asistirle. Refiérase a su línea de afiliación. ¡Buenas noches!"),
    ],
    // To the own team, every call until the code is solved
    ask: [
        new Line(sprite, "Muchas gracias."),
        new Line(sprite, "Sus 5 fibras están listas. Le voy a pedir que compruebe su afiliación con el número de validación."),
        new Line(sprite, "Lo podrá ingresar por el teclado en un momento."),
        new Line(sprite, "Un segundo."),
        new Line(sprite, "..."),
        new Line(sprite, "..."),
        new Line(sprite, "¡Adelante!"),
    ],
    right: [
        new Line(sprite, "¡Confirmado! Gracias por validar su identidad."),
        new Line(sprite, "Podrá pasar a buscar las cinco fibras a partir de las 10:30pm."),
        new Line(sprite, "¡Gracias por escribir con Naipes, su librería de confianza! ¡Que tenga una linda noche!"),
    ],
    // To the own team once the code is solved: two questions to pick from, each with its own
    // reply. TEMPLATE: replace the labels and the replies.
    help: [
        new Line(sprite, "¿Puedo ayudarle en algo?", {
            choices: [
                { label: "¿Cuánto te pagan?", reply: [
                    new Line(sprite, "Ehhm..."),
                    new Line(sprite, "Por motivos de privacidad no le puedo responder eso..."),
                    new Line(sprite, "Pero... gracias por... su preocupación."),
                ] },
                { label: "¿Me decís tu nombre?", reply: [new Line(sprite, "Leila. Un gusto, (NOMBRE).")] },
                { label: "Intérprete, ¿me decís tu nombre?", reply: [new Line(sprite, "Uhh")] },
            ],
        }),
    ],
    // To the partner in Sincronización Emparejada, once they reach its last stage
    expecting: (code) => [
        new Line(sprite, "Gracias. Un momento..."),
        new Line(sprite, "..."),
        new Line(sprite, "..."),
        new Line(sprite, "Le pido disculpas, nuestro sistema de generación de códigos de sincronización emparejada está teniendo problemas."),
        new Line(sprite, "Le voy a colocar en un breve periodo de espera."),
        new Line(sprite, "Por favor aguarde en línea."),
        new Line(sprite, "..."),
        new Line(sprite, "..."),
        new Line(sprite, "..."),
        new Line(sprite, "..."),
        new Line(sprite, "..."),
        new Line(sprite, "Volví. ¡Gracias por su paciencia!"),
        new Line(sprite, "El código es " + [...code].join(" ") + "."),
        new Line(sprite, "¡Gracías por escribir con Naipes, su librería de confianza! ¡Que tenga una linda noche!"),
    ],
}
