// The texts each game opens and ends with, shown full screen as a wall of text that scrolls
// (story.js): preview (the phone only) once every team's preview call has been heard before the
// party, intro the first time the game is opened (the phone, already while it is a preview), done once it is
// won, complete once everything in it is found (completion.js). Write them here, between the
// backticks; line breaks are kept as written. button: what ends the intro and starts the game.
// The done and complete texts end with "Continuar", back to the desktop.
// DRAFT: every text below is a placeholder, its title line and then filler.

// filler, so each placeholder fills a phone screen as a real text would
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

export const stories = {
    fibonacci: {
        button: "Marcar",
        // only the phone has one: before the party, once every team's preview has been heard
        preview: `¿Eran... contestadores automáticos?
        
Qué decepción, con las ansias que hay de hablar con alguien en estas épocas de isolación...

Bueno, cuanto menos una promesa: el 24 de octubre, a las 9:00pm...`,
        intro: `"Teléfono Fibonacci"...

Un título peculiar, de no ser porque el contexto en su particularidad lo ubica perfectamente. Un ícono apartado a un rincón, desde una interfaz inusual y aún familiar. ¿Un Escritorio? ¿Una ventana?

Y ahora, un teléfono. Quizás irónicamente lo menos apropiado de encontrarse tres pantallas dentro de una página web, hoy que el teléfono puede navegarlas. ¿Y Teléfonos como estos? Ya no vienen ni con botones.

...Tendré que probarlo.`,
        done: `Lo viejo funciona.

Pero esto no es viejo; esto es... un desafío, y algo me dice que no se terminó. Algo me dice que acá hay algo raro. ¿Grupos? ¿Códigos? ¿Ítems? ¿Cuánto tiene que ver con qué?

Hmm... mejor no sobrepensarlo. Lo que queda claro es que no voy a poder hacerlo por mi cuenta; es un ejercicio en el tráfico de información, y el teléfono fue solo el primer contacto.`,
        complete: `Belleza en la fricción.

Las pequeñas inconveniencias que percibimos prescindibles son las nos presentan la oportunidad de conocer al ser humano. Mientras miro esté teléfono, no me enajeno de mi entorno, no me guardo en un perezoso entrenamiento algorítmico.

No... con este teléfono, mi atención recorre las parábolas periféricas de mi percepción. En lugar del eterno desliz al punto de fuga, el centro de este espiral es el origen de un patrón que se expande, que me alcanza y me acerca a quien siempre estuvo de mi lado sin habernos dado cabida.

Y cuando me doy cuenta, en la distancia entre mi centro de gravedad y su incremental lejanía, el borde me revela una nueva oportunidad.`,
    },
    webdetective: {
        button: "Investigar",
        intro: `"Detective Web".

El tráfico de información dejó de ser el privilegio de la clase mediática: periodistas, escritores, editores y televisadores; hoy difícilmente compiten contra la apertura de una cuarta dimensión de proyección expositiva.

En la web no se distinguen emisores de receptores; la información es universalmente accesible, reciprocable, constante, abundante y permanente. La *verdad* es la que uno quiera, y la infobesidad ofrece incontables realidades a las cuales suscribirse.

Asímismo, quien a una cosa quisiera dedicarse, deberá ser disciplinado en el enfoque de su atención a las regiones de este espacio en donde se encuentre lo que uno busca.

Y yo estoy buscando a alguien...`,
        done: `Revelaciones.

Los misterios nacen en el curioso, y no de lo desconocido en sí. El secreto se practica por primera vez cuando una respuesta no es concedida; la confidencialidad es entonces un ejercicio colectivo, y en esta ocasión nuestras instrucciones fueron su destrucción.

Pero no me conformo con revelar fantasmas; esta es una oportunidad para ahondar aún mas a fondo, encontrar en quien confiar y conocer a las personas detrás de todo esto.

Y hay 4 grupos...`,
        complete: `La muerte de un fantasma.

A menudo se habla de la segunda muerte de la persona: el olvido. Poco se habla de la concepción masiva de fantasmas.

Quien no te conoce no te puede olvidar, y quien solo encontró tus fotografías, textos o perfiles conoció en realidad a uno de tus fantasmas. Presentar nuestros fantasmas al mundo es hoy lo que se espera de nosotros.

Solo uno mismo puede matar a sus fantasmas mientras vivo esté.`,
    },
    labyrinth: {
        button: "Recoger",
        intro: `"Laberinto Yuxtapuesto".

Entre las tantas inconveniencias erradicadas con el dispositivo en mis manos, quizás tan revolucionario como el "acortamiento de distancias" en función de la comunicación, es el trazado del camino a aquello que es distante en función de la dirección.

Nadie "se pierde" hoy día, o no por mas de 10 minutos. En la desconexión entre el cartógrafo digital y nuestro sentido de la orientación se presenta el plan Z: preguntar a cualquier transeúnte. Sin un mapa mágico, preguntar es el plan A.

Parece ser de interés común que todos lleguemos a nuestro destino, parece una oportunidad perdida entonces poder averiguar nuestra posición en el mapa caundo y cuantas veces queramos. Lo cómodo es a cambio antisocial.

Y acá yo, con un paquete que entregar y un mapa que no entiendo.`,
        done: `Paquete entregado.

No se qué, ni a quién, ni supe hasta hoy dónde, pero sé ahora que todo está en su lugar, y confío en que los entregadores como yo que me crucé en el camino van a concretar sus entregas también.

¿Cuánto tiempo tengo? Capaz puedo tomar dos o tres viajes mas, ahora que conozco estas calles.`,
        complete: `Trescientos sesenta grados de oportunidad.

Cada ruta nueva tan solo requiere un giro para ser un rompecabezas a resolver. En la rotación se presenta no solo el riesgo a desviarse, también a desorientarse; "perder el norte". Resolverlo es familiarizarse con sus giros, dónde y cuánto rotar; algoritmos de un plano de rubik.

Las esquinas son entonces nuestra referencia; arrivar a cada cual una confirmación de un rumbo correcto. Los obstáculos son el lujo que nos permite valernos por nuestros propios instrumentos.

Perderse es eventual e inevitable, nuestras brújulas siempre estarán sesgadas por el límite de nuestras experiencias. Una navegación óptima obliga la consulta.

Y a quién mejor que quienes ya conocen estas calles.`,
    },
    sync: {
        button: "Sincronizar",
        intro: `"Sincronización Emparejada".

Si llegué hasta acá es gracias a quienes compartieron su camino conmigo, a encuentros fortuitos que complementaron nuestros potenciales.

Reconozco mis propios méritos, como también las oportunidades de las que dependí, y que otros me dieron.

Se las debo.`,
        done: `Hay algo que hace click.

En cada par de personas hay interfaces en común; el idioma, los medios de emisión y recepción de símbolos (ya sean gráficos o sonoros) y las reglas no escritas de cada contexto de interacción; las que se infieren por un instinto social común.

Pero conocer a alguien, no solo su mensaje sino al ser que hay detrás, produce un lenguaje completamente único en el mundo, encriptado en la sincronía de dos almas entrelazadas, y expresado en la calidez de la compañía.

Y espero poder hablar en cuantos lenguajes de estos mi tiempo dé oportunidad.`,
        complete: `Mi reflejo.
        
No hay yo sin él o ella, como no hay mal sin bien, no hay materia sin espacio, no hay sufrimiento sin deseo. En el vacío de una hoja en blanco, la figura nace en su contraste con el fondo; sin uno, el otro no existe.

No es coincidencia que el mecanismo que hace posible estas proyecciones rectangulares con tan infinitas posibilidades sea, al fin y al cabo, un ordenamiento de prendidos y apagados.

Soy quien soy también por quien no soy. Lo somos todo.`,
    },
    artifacts: {
        button: "Abrir",
        intro: `"Caja Fuerte".

Medianoche, y el inicio de un nuevo día, pero esto todavía no terminó.

Los llamados, las cartas, las entregas y emparejamientos nos hicieron con todas las herramientas que necesitamos para este último desafío.`,
        done: `¡Gracias por participar de *la actividad*!.

Espero que sigas disfrutando mi cumpleaños, y muchísimas gracias por venir y por prestarte a mis caprichos (?`,
        complete: `Yippee!!!.

Decidí considerar Caja Fuerte como "completado" con tan solo hacer una segunda ruta, porque a ver... son simplemente un montón de contraseñas, y es una ruta distinta por invitado entonces, honestamente, no sería muy divertido que fuese mas que eso ah.

Por supuesto que sos libre de probar mas rutas, si te divierten los artefactos.

¡Muchas gracias por disfrutar tanto de *la actividad*!`,
    },
}
