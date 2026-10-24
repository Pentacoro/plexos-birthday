// The letters that arrive in Detective Web, one per step, in order, each team with its own.
// Write them here. Line breaks are kept as written. {falsa} is the reader's own fake password:
// the third letter gives it to them.

export const letters = [
    // Step 1 — gold envelope, team-specific message and answer
    {
        spades: `Buenas noches, {nombre}.

Me comunico con usted por este medio en motivo de reclutamiento. Soy un investigador, y en este momento cuento con un equipo que está recolectando información sobre alguien que probablemente conocés: un tal "Pentacoro" o también conocido como "Norrum", cumplió años el lunes.

Mirá, sé que estás en su cumple, y con mi equipo saboteamos este paso de su "actividad" para ponernos en contacto con cada invitado de su cumpleaños porque necesitamos su ayuda. Sabemos también que fueron separados en grupos, lo cual de hecho nos viene como anillo al dedo para encarar la investigación por distintos ejes

A ustedes, los "Picas", les doy la siguiente tarea: Pudimos confirmar que el cumpleañero fue un estudiante en la "Matchmaking Academy", una institución orientada a la formación de jugadores de Counter-Strike. El profesor, TheWarOwl, sube sus clases a YouTube, y a todos sus alumnos les pregunta su "pez favorito", detallado al principio de la lección.

Necesitamos que nos confirmes cual es el pez favorito del cumpleañero. Su clase fue la 47:

https://www.youtube.com/@TheWarOwl`,
        hearts: `Buenas noches, {nombre}.

Me comunico con usted por este medio en motivo de reclutamiento. Soy un investigador, y en este momento cuento con un equipo que está recolectando información sobre alguien que probablemente conocés: un tal "Pentacoro" o también conocido como "Norrum", cumplió años el lunes.

Mirá, sé que estás en su cumple, y con mi equipo saboteamos este paso de su "actividad" para ponernos en contacto con cada invitado de su cumpleaños porque necesitamos su ayuda. Sabemos también que fueron separados en grupos, lo cual de hecho nos viene como anillo al dedo para encarar la investigación por distintos ejes

A ustedes, los "Corazones", les doy la siguiente tarea: Si hay algo que al cumpleañero le gusta son los jueguitos de computadora, tiene como quinientos y escribe extensamente al respecto de ellos. En particular, él menciona dos ejemplos de "experiencias narrativas" en su página de introducción personal; necesitamos que nos confirmes el segundo ejemplo.

Vas a encontrar lo que necesitás en su página web personal:

https://blog.plexos.app/`,
        clubs: `Buenas noches, {nombre}.

Me comunico con usted por este medio en motivo de reclutamiento. Soy un investigador, y en este momento cuento con un equipo que está recolectando información sobre alguien que probablemente conocés: un tal "Pentacoro" o también conocido como "Norrum", cumplió años el lunes.

Mirá, sé que estás en su cumple, y con mi equipo saboteamos este paso de su "actividad" para ponernos en contacto con cada invitado de su cumpleaños porque necesitamos su ayuda. Sabemos también que fueron separados en grupos, lo cual de hecho nos viene como anillo al dedo para encarar la investigación por distintos ejes

A ustedes, los "Treboles", les doy la siguiente tarea: Según lo que pudimos descubrir, al cumpleañero le gustan los juegos de mesa y de azar, a tal punto que creó él su propio juego de cartas, con un mazo original de 9 cartas solo para este juego. El nombre del juego es Duel, se juega de a dos, y en particular necesitamos que nos confirmes el nombre de una de las cartas, una que contiene la ilustración de una torre de ajedrez.

Podés encontrar detalles sobre Duel en su perfil de Steam, enlazado en su sección de links en su página web personal:

https://blog.plexos.app/`,
        diamonds: `Buenas noches, {nombre}.

Me comunico con usted por este medio en motivo de reclutamiento. Soy un investigador, y en este momento cuento con un equipo que está recolectando información sobre alguien que probablemente conocés: un tal "Pentacoro" o también conocido como "Norrum", cumplió años el lunes.

Mirá, sé que estás en su cumple, y con mi equipo saboteamos este paso de su "actividad" para ponernos en contacto con cada invitado de su cumpleaños porque necesitamos su ayuda. Sabemos también que fueron separados en grupos, lo cual de hecho nos viene como anillo al dedo para encarar la investigación por distintos ejes

A ustedes, los "Treboles", les doy la siguiente tarea: No es secreto que el cumpleañero es alguien atravesado (y radicalizado) por la pérdida del patrimonio inmobiliario de su familia nuclear, y quizás una manifestación de este trauma es su recurrente compulsión a coleccionar. Entre mudanzas ha perdido varios de los objetos que han constituido sus colecciones físicas, sin embargo su colección mas extensa se encuentra en formato digital.

Sí, "Norrum" tiene muchos juegos. Queremos saber cuántos. Podés encontrar su perfil de Steam en su página web personal:

https://blog.plexos.app/`,
    },
    // Step 2 — gold envelope, team-specific message and answer; spades answer with their artifact code
    {
        spades: `SOLO PARA LOS OJOS DE PICAS.

Ese era, sí; muy lindo pez, mas concretamente el "Crown Betta Fish".

Okay, ahora leé con atención. Les envié otro sobre con información sobre cada uno de los invitados del cumpleaños. Necesito que me confirmen su presencia en el cumpleaños yendo a buscar sus sobres y confirmándome sus códigos.

Tan simple como eso.`,
        hearts: `¡Correcto! Un hittazo del survival horror, Signalis, lanzado en 2022.

Hay... otro juego que al cumpleañero parece gustarle bastante, comunicándolo así, bajo el verbo "To Love" en uno de los títulos de sus videos. Si pudieras encontrarlo, nos sirven las iniciales de este juego.

Podés encontrar su canal de YouTube en su página web personal:

https://blog.plexos.app/`,
        clubs: `¡Precisamente! "Burg" eh, porque "Tower" era muy mainstream.

Bien, ahora necesito que verifiques una cosa. Sé que te invitaron a ese cumple, pero necesito estar seguro de que conocés a quien estamos investigando. Su DeviantArt tiene varios auto retratos; uno en particular presentado en una fila de retratos de diferentes personas.

Identificá al cumpleañero, y verificá la descripción debajo de su auto retrato. Su DeviantArt se encuentra en la sección de enlaces de su página web:

https://blog.plexos.app/`,
        diamonds: `¡Exactamente! Guau, cuánto tiempo le damos para que llegue a mil.

En fin, hay otra cosa que nos está inquietando, y es que el cumpleañero posiblemente esté en contacto con espías del gigante asiático. Su primer contacto habría sido bajo el pretexto de una traducción; un "mod" desarrollado por Norrum nominado "[MED SPRAY]".

Podés encontrar el link al artículo de este mod en la descripción de su video en YouTube, y su canal en su página web. Una vez lo encuentres, confirmanos quién le proveyó su traducción china:

https://blog.plexos.app/`,
    },
    // Step 3 — team-colored envelope, gives the fake password, answered with any own-team password
    {
        spades: `SOLO PARA LOS OJOS DE {nombre}.

Fuiste de gran utilidad, y tan solo necesitamos una última cosa. Si bien enviamos este mismo mensaje a cada invitado, solo queremos que vos, {nombre}, leas esto.

Esto es una prueba de confianza; queremos averiguar en qué medida podemos aprovechar el expertiz de campo de cada uno de ustedes.

Todos recibieron contraseñas falsas. Tu contraseña falsa es: {falsa}

El ejercicio es simple; envianos la contraseña de un invitado/a de tu mismo grupo. Real o falsa, cualquier contraseña se considerará correcta. Depende de cada uno cual ceder.

Esperamos sus respuestas.`,
        hearts: `SOLO PARA LOS OJOS DE {nombre}.

Fuiste de gran utilidad, y tan solo necesitamos una última cosa. Si bien enviamos este mismo mensaje a cada invitado, solo queremos que vos, {nombre}, leas esto.

Esto es una prueba de confianza; queremos averiguar en qué medida podemos aprovechar el expertiz de campo de cada uno de ustedes.

Todos recibieron contraseñas falsas. Tu contraseña falsa es: {falsa}

El ejercicio es simple; envianos la contraseña de un invitado/a de tu mismo grupo. Real o falsa, cualquier contraseña se considerará correcta. Depende de cada uno cual ceder.

Esperamos sus respuestas.`,
        clubs: `SOLO PARA LOS OJOS DE {nombre}.

Fuiste de gran utilidad, y tan solo necesitamos una última cosa. Si bien enviamos este mismo mensaje a cada invitado, solo queremos que vos, {nombre}, leas esto.

Esto es una prueba de confianza; queremos averiguar en qué medida podemos aprovechar el expertiz de campo de cada uno de ustedes.

Todos recibieron contraseñas falsas. Tu contraseña falsa es: {falsa}

El ejercicio es simple; envianos la contraseña de un invitado/a de tu mismo grupo. Real o falsa, cualquier contraseña se considerará correcta. Depende de cada uno cual ceder.

Esperamos sus respuestas.`,
        diamonds: `SOLO PARA LOS OJOS DE {nombre}.

Fuiste de gran utilidad, y tan solo necesitamos una última cosa. Si bien enviamos este mismo mensaje a cada invitado, solo queremos que vos, {nombre}, leas esto.

Esto es una prueba de confianza; queremos averiguar en qué medida podemos aprovechar el expertiz de campo de cada uno de ustedes.

Todos recibieron contraseñas falsas. Tu contraseña falsa es: {falsa}

El ejercicio es simple; envianos la contraseña de un invitado/a de tu mismo grupo. Real o falsa, cualquier contraseña se considerará correcta. Depende de cada uno cual ceder.

Esperamos sus respuestas.`,
    },
]

// The last letter, after the last step is answered: it comes in a black envelope with a gold
// seal. DRAFT: write them here.
export const final = {
    spades: `Bien hecho, {carta}.

Confirmamos la contraseña de {carta2}. Analizaremos los descubrimientos que hicimos hoy.

Nos fuiste de ayuda, pero la prueba aún no termina. Hay 3 grupos mas con quienes intercambiar.

Estaremos atentos.`,
    hearts: `Bien hecho, {carta}.

Confirmamos la contraseña de {carta2}. Analizaremos los descubrimientos que hicimos hoy.

Nos fuiste de ayuda, pero la prueba aún no termina. Hay 3 grupos mas con quienes intercambiar.

Estaremos atentos.`,
    clubs: `Bien hecho, {carta}.
    
Confirmamos la contraseña de {carta2}. Analizaremos los descubrimientos que hicimos hoy.

Nos fuiste de ayuda, pero la prueba aún no termina. Hay 3 grupos mas con quienes intercambiar.

Estaremos atentos.`,
    diamonds: `Bien hecho, {carta}.
    
Confirmamos la contraseña de {carta2}. Analizaremos los descubrimientos que hicimos hoy.

Nos fuiste de ayuda, pero la prueba aún no termina. Hay 3 grupos mas con quienes intercambiar.

Estaremos atentos.`,
}

// The secret letter, for answering the final one with passwords of three other teams: it comes
// in an envelope of the team's color with a rainbow stamp and a gem for a seal. DRAFT.
export const secret = {
    spades: `Estimado/a {nombre}.

Sus capacidades serán tomadas en cuenta. Por lo pronto, deberá cesar nuestra comunicación.

Muchas gracias por su contribución a esta investigación.`,
    hearts: `Estimado/a {nombre}.

Sus capacidades serán tomadas en cuenta. Por lo pronto, deberá cesar nuestra comunicación.

Muchas gracias por su contribución a esta investigación.`,
    clubs: `Estimado/a {nombre}.

Sus capacidades serán tomadas en cuenta. Por lo pronto, deberá cesar nuestra comunicación.

Muchas gracias por su contribución a esta investigación.`,
    diamonds: `Estimado/a {nombre}.

Sus capacidades serán tomadas en cuenta. Por lo pronto, deberá cesar nuestra comunicación.

Muchas gracias por su contribución a esta investigación.`,
}

// Only for Mariana: once she answers the secret letter (with a heart), this comes in velvet red,
// from Pentacoro. Write it here.
export const queen = `SOLO PARA LOS OJOS DE MARIANA.

24/10/26

Hola mi amorrrr. Jeje, encontraste mi cartita. Si estás en pleno cumple, te recomiendo quizás leerla en otro momento?

Quería decirte lo que ya sabés, pero para que no te olvides: te amo muchísimo, te aprecio muchísimo, me siento muy afortunado de tenerte, de que seas mi hermosa novia, que me ama tanto y como nadie mas en el mundo, y así mismo te amo yo como no amo a nadie mas.

Muchas gracias por ayudarme con el cumple, con los sobres y sus contenidos, con las chipas y los muffins, con las compras; gracias por jugar mi juego con tantas ganas, gracias por existir y darme tanto de tu tiempo. Te amoooooo.

Y te voy a amar siempre. Recuerdo aquel cumpleaños donde preparaste toda tu habitación para mí, y me dió mucha pena que no hayas podido ver mi cara de sorpresa al entrar u.u valoré muchísimo ese gesto, quiero que lo sepas; a menudo lo recuerdo y exploto del asombro y de lo imposible que es concebir la suerte que debo tener para haberte conocido.

Y espero que la hayas pasado bien en mi cumple :) y que te haya gustado *la actividad*.

Sos el amor de mi vida, la reina de mi corazón. Te quiero muchísimo, te amo, y te voy a amar siempre.

- Sebastián <3
`

// Heads the letter that comes back after a wrong answer, above that same letter again
export const wrong = `Incorrecto`

// What the screen says once every letter has been answered
export const finished = `No tenés mas cartas.`
