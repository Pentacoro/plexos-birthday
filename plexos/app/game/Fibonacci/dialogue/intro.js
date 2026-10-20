import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers 1123581, the classic sequence. DRAFT lines.
const sprite = { talking: "/plexos/app/game/Fibonacci/img/Fibo_Talking.png", rest: "/plexos/app/game/Fibonacci/img/Fibo_Idle.png" }

export default {
    name: null,
    sprite,
    // how they sound as they talk: low and buzzy, a smug drawl
    voice: { type: "square", freq: 118, jitter: 0.06, gain: 0.07, length: 0.07, filter: 1400 },
    // The first call
    call: [
        new Line(sprite, "Usted llamó a la línea principal Fibonacci de atención al invitado."),
        new Line(sprite, "Usted marcó la secuencia de Fibonacci original, bien hecho."),
        new Line(sprite, "Los números telefónicos Fibonacci funcionan de forma que solo necesitás dos dígitos para construir la secuencia."),
        new Line(sprite, "Qué maravilla, ¿no? Darle tu número a alguien con solo dos dígitos."),
        new Line(sprite, "Según me explicaron, para este cumpleaños hay cuatro grupos, y a cada uno le corresponde marcar un número distinto."),
        new Line(sprite, "Y vos sos del grupo (GRUPO)."),
        new Line(sprite, "Probablemente te dejaron alguna pista en el teléfono."),
        new Line(sprite, "Confío en vos."),
        new Line(sprite, "...y en que sabés sumar."),
        new Line(sprite, "Suerte."),
    ],
    // Every call after the first
    again: [
        new Line(sprite, "Usted llamó a... Bancá, ¿otra vez vos?"),
        new Line(sprite, "Okay..."),
        new Line(sprite, "A ver. La secuencia Fibonacci original empieza con 1. Si seguís esa línea va:"),
        new Line(sprite, "1 | 1 | 1 + 1 = 2 | 1 + 2 = 3 | 2 + 3 = 5 | 3 + 5 = 8 | 5 + 8 = 13 | ..."),
        new Line(sprite, "Por eso el número que marcaste es 1123581."),
        new Line(sprite, "Hacé lo mismo con los dos dígitos de inicio que le toque a tu grupo."),
        new Line(sprite, "Yo sé que podés."),
    ],
}
