import {Line} from "/plexos/app/game/Party/dialogue.js"

// Answers 1123581, the classic sequence. DRAFT lines.
const sprite = "/plexos/app/game/Fibonacci/img/intro.png"

export default {
    name: null,
    sprite,
    // how they sound as they talk: low and buzzy, a smug drawl
    voice: { type: "square", freq: 118, jitter: 0.06, gain: 0.07, length: 0.07, filter: 1400 },
    // The first call
    call: [
        new Line(sprite, "¿Hola? Ah, otro que marcó Fibonacci de memoria."),
        new Line(sprite, "Qué maravilla, ¿no? Con solo dos números ya sabés todos los demás."),
        new Line(sprite, "Le podés pasar tu teléfono a cualquiera diciéndole dos dígitos. Genial. Revolucionario."),
        new Line(sprite, "En fin... seguro te dejaron alguna pista ahí en el teléfono. Mirá bien."),
    ],
    // Every call after the first
    again: [
        new Line(sprite, "¿Otra vez vos? Ya te dije, yo no te puedo ayudar."),
        new Line(sprite, "La pista está en el teléfono. Prestale atención."),
    ],
}
