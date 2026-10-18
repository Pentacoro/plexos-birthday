// English for the players who play in it (lang: "en" in players.js). Everything the game says is
// written in Spanish; this is that text in English, keyed by the Spanish exactly as written. A
// line changed in Spanish shows in Spanish until it is changed here too. Answers, and the names
// of files and folders, stay in Spanish for everyone. Boot reads this before any core exists,
// so it stays a plain module.

// The language being shown, set once the player is known (boot's password.js, Party's def.js)
export const lang = { current: "es" }

const english = {
    // ---- teams
    "Picas": "Spades",
    "Corazones": "Hearts",
    "Tréboles": "Clubs",
    "Diamantes": "Diamonds",

    // ---- welcome
    "Bienvenido": "Welcome",
    "Bienvenida": "Welcome",

    // ---- badges, hints, notices, popups
    "Individual: lo podés resolver por tu cuenta": "Solo: you can solve this on your own",
    "Coordinado: necesitás información de otros equipos": "Coordinated: you need information from other teams",
    "Artefacto: te falta algo...": "Artifact: you're missing something...",
    "Ver fotos": "See photos",
    "Cerrar": "Close",
    "Añadido a Contactos": "Added to Contacts",
    "Carta Guardada": "Letter Saved",
    "Laberinto Revelado": "Maze Revealed",
    "Objeto Recibido": "Item Received",
    "Código Anotado": "Code Noted",
    "Archivo no encontrado": "File not found",
    "El archivo ya no existe.": "The file no longer exists.",
    "Nombre": "Name",
    "Última actualización": "Last updated",
    "Contenido": "Contents",

    // ---- Teléfono Fibonacci
    "Llamando": "Calling",
    "Contactos": "Contacts",
    "Todavía no tenés contactos.": "You don't have any contacts yet.",
    "Fibonacci": "Fibonacci",
    "Desconocido": "Unknown",
    "...¿Hola?": "...Hello?",
    "Soy de ningún equipo": "I'm not on any team",

    // the man on the Fibonacci line
    "¿Hola? Ah, otro que marcó Fibonacci de memoria.": "Hello? Ah, another one who dialed Fibonacci from memory.",
    "Qué maravilla, ¿no? Con solo dos números ya sabés todos los demás.": "Wonderful, isn't it? With just two numbers you know all the rest.",
    "Le podés pasar tu teléfono a cualquiera diciéndole dos dígitos. Genial. Revolucionario.": "You can give anyone your phone number by telling them two digits. Brilliant. Revolutionary.",
    "En fin... seguro te dejaron alguna pista ahí en el teléfono. Mirá bien.": "Anyway... I'm sure they left you a clue somewhere on the phone. Look closely.",
    "¿Otra vez vos? Ya te dije, yo no te puedo ayudar.": "You again? I told you, I can't help you.",
    "La pista está en el teléfono. Prestale atención.": "The clue is on the phone. Pay attention to it.",

    // spades
    "¡Hola! Habla el contacto de Picas.": "Hi! This is the Spades contact.",
    "Todavía no es momento de hablar... Guardá este número, que el 24 a la noche lo vas a necesitar.": "It's not time to talk yet... Save this number, you'll need it on the night of the 24th.",
    "¿De qué equipo sos?": "Which team are you on?",
    "Ah, en este momento no te puedo ayudar.": "Ah, I can't help you right now.",
    "¡Gracias por llamar!": "Thanks for calling!",
    "Perdón, en este momento no te puedo ayudar.": "Sorry, I can't help you right now.",
    "Para seguir necesito un código de nueve dígitos.": "To go on I need a nine-digit code.",
    "Se arma con los códigos de las tarjetas de otros equipos. Ya sabés a quiénes preguntarles.": "It's made from the codes on other teams' cards. You know who to ask.",
    "¡Perfecto! Ese es.": "Perfect! That's the one.",
    "¿En qué le puedo ayudar?": "How can I help you?",
    "OPCIÓN 1": "OPTION 1",
    "RESPUESTA 1": "ANSWER 1",
    "OPCIÓN 2": "OPTION 2",
    "RESPUESTA 2": "ANSWER 2",
    "¡Te estaba esperando!": "I was waiting for you!",

    // hearts: Bombonería Dulcinea
    "¡Hola! Habla el contacto de Corazones.": "Hi! This is the Hearts contact.",
    "¡Llamaste antes de tiempo! Guardá este número y volvé a llamar el 24 a la noche.": "You called too early! Save this number and call again on the night of the 24th.",
    "¡Buenas noches! Habla con la Bombonería Dulcinea.": "Good evening! You've reached Dulcinea's Chocolate Shop.",
    "¿De dónde llama?": "Where are you calling from?",
    "Awww... Disculpame, corazón, acá no es. Tenés que llamar al número de tu localidad.": "Awww... Sorry, sweetheart, this isn't the place. You need to call your local number.",
    "Gracias por entender, gracias por llamar a la Bombonería Dulcinea. ¡Que tengas una linda noche!": "Thanks for understanding, and thanks for calling Dulcinea's Chocolate Shop. Have a lovely night!",
    "Mi vida... No te puedo ayudar ahora; probá más tarde. ¿Sí?": "Darling... I can't help you right now; try again later. Okay?",
    "Gracias por llamar a la Bombonería Dulcinea. ¡Que tengas una linda noche!": "Thanks for calling Dulcinea's Chocolate Shop. Have a lovely night!",
    "¡Un gusto hablar con usted!": "A pleasure to speak with you!",
    "Se lleva entonces una docena de bombones a su domicilio.": "So that's a dozen chocolates delivered to your home.",
    "Tan solo confírmeme el número del pedido para enviárselo. Cuando esté listo, márquelo en el teclado.": "Just confirm the order number for me so I can send it. When you're ready, type it on the keypad.",
    "¡Excelente! Doce bombones camino a Boulogne Sur Mer. Llegan 9:30pm.": "Excellent! Twelve chocolates on their way to Boulogne Sur Mer. Arriving at 9:30pm.",
    "¿No es un poco tarde?": "Isn't it a bit late?",
    "Ayyy ¡Qué confrontacional! Pero sí, estos no son nuestros horarios de jornada usuales.": "Oooh, how confrontational! But yes, these aren't our usual business hours.",
    "Tampoco abrimos sábados, pero hoy reservaron nuestro servicio para los invitados del cumpleaños de un tal... ¿Pentacoro?": "We don't open on Saturdays either, but tonight our service was booked for the guests at the birthday of someone called... Pentacoro?",
    "Asumí que serías alguien del cumple. De cualquier forma, tiene mi número, y estoy a su disposición.": "I assumed you'd be someone from the party. Either way, you have my number, and I'm at your service.",
    "¿Cómo se llama?": "What's your name?",
    "¡Dulcinea! Soy la dueña.": "Dulcinea! I'm the owner.",
    "Decidí tomar control de mi propio determinismo nominativo con el nombre que me dieron. ¡Ser y hacer lo dulce!": "I decided to take charge of my own nominative determinism with the name I was given. To be sweet and make sweets!",
    "...y no la fantasía de un inútil con complejo de grandeza.": "...and not the fantasy of some good-for-nothing with delusions of grandeur.",
    "¡Pero esos son solo cuentos!": "But those are just stories!",
    "Gracias por todo.": "Thanks for everything.",
    "¡Gracias a usted!": "Thank you!",
    "¡Hola! Un gusto.": "Hi! Nice to meet you.",
    "Sí, el código. Un segundo...": "Yes, the code. One second...",

    // clubs: the Clover Club
    "Buenas noches, se comunicó con la línea de redención del Clover Club.": "Good evening, you've reached the Clover Club redemption line.",
    "Nuestras oficinas abren el 24 a la noche. Agende este número; lo vamos a estar esperando.": "Our offices open on the night of the 24th. Save this number; we'll be expecting you.",
    "Buenas noches. Gracias por llamar a la línea de redención de lotería del Clover Club.": "Good evening. Thank you for calling the Clover Club lottery redemption line.",
    "¿Me decís tu afiliación?": "Can you tell me your affiliation?",
    "Ah... Disculpá, no te puedo ayudar en este momento. Probá con la línea de tu club, o llamá mas tarde.": "Ah... Sorry, I can't help you right now. Try your own club's line, or call back later.",
    "¡Gracias!": "Thanks!",
    "Sí, habla con la línea de redención del Clover Club; le reitero que no puedo ayudarle en este momento.": "Yes, this is the Clover Club redemption line; I repeat, I can't help you right now.",
    "Clave. Voy a necesitar sus números.": "Right. I'm going to need your numbers.",
    "Si no lo tiene a mano, tómese su tiempo para encontrarlo e ingréselo por el teclado.": "If you don't have it handy, take your time to find it and enter it on the keypad.",
    "¡Gracias! Un momento...": "Thanks! One moment...",
    "¡Bingo! Le puedo confirmar que son números ganadores, y le corresponde una recompensa de...": "Bingo! I can confirm those are winning numbers, and you're entitled to a reward of...",
    "Siete pesos.": "Seven pesos.",
    "Y según puedo ver ya los debería haber recibido; fueron enviados el 19 de octubre.": "And as far as I can see you should already have received them; they were sent on October 19th.",
    "Hmmm, una vez que me dan un código que funciona...": "Hmmm, the one time someone gives me a code that works...",
    "¡En fin! Disfrute su recompensa. ¡Gracias por llamar a la línea de redención del Clover Club!": "Anyway! Enjoy your reward. Thank you for calling the Clover Club redemption line!",
    "Buenas noches. ¿En qué te puedo ayudar?": "Good evening. How can I help you?",
    "¿Qué estás escuchando?": "What are you listening to?",
    "Nujabes.": "Nujabes.",
    "Buscalo YA.": "Look him up NOW.",
    "Murió el chabón, un ponja, pero genio mal.": "The guy died. Japanese dude, but a total genius.",
    "¿Viste que siempre hay un ponja que es un genio mal?": "Ever notice there's always some Japanese guy who's a total genius?",
    "No sé qué les daran de comer. ¿Sushi? ndeah": "No idea what they feed them. Sushi? nah",
    "Dicen que lo mas parecido a la consistencia del cerebro es el tofu... andá a saber. ¿No?": "They say the closest thing to the texture of a brain is tofu... who knows. Right?",
    "¿Tu nombre?": "Your name?",
    "Hmmm. No me gusta mi nombre.": "Hmmm. I don't like my name.",
    "Decime 'Low Temp'. O 'Low' más fácil.": "Call me 'Low Temp'. Or just 'Low', easier.",
    "Sos re fachero amigo": "You're real good-looking, man",
    "Mirá quien habla.": "Look who's talking.",
    "A ver... ¡Sí! Emparejamiento ¿No?": "Let's see... Yes! Pairing, right?",

    // diamonds: Juguetería Rombic
    "Juguetería Rombic.": "Rombic Toy Store.",
    "Cerrado por inventario. Abrimos el 24 a la noche.": "Closed for stocktaking. We open on the night of the 24th.",
    "¿Afiliación?": "Affiliation?",
    "Llame a su línea de afiliación.": "Call your affiliation's line.",
    "No vuelva a llamar.": "Don't call again.",
    "Tiene un pedido de repuestos para el 'Diamond Fidget Spinner Rubik's Cube 3x3x1'.": "You have an order of spare parts for the 'Diamond Fidget Spinner Rubik's Cube 3x3x1'.",
    "Necesito el código del pedido. Cuando esté listo, ingréselo por el teclado.": "I need the order code. When you're ready, enter it on the keypad.",
    "Un momento...": "One moment...",
    "Las 3 piezas de repuesto ya fueron enviadas. Llegan a las 9:00pm.": "The 3 spare parts have been sent. They arrive at 9:00pm.",
    "Gracias. Hasta luego.": "Thanks. Goodbye.",
    "¿Sí?": "Yes?",
    "¿Eso es tu pelo?": "Is that your hair?",
    "Se.": "Yep.",
    "¿Cómo te llamás?": "What's your name?",
    "Tomás.": "Tomás.",
    "Sos lindo.": "You're cute.",

    // ---- Detective Web
    "Investigar": "Investigate",
    "Reenviar": "Resend",
    "Responder": "Reply",
    "Enviar": "Send",
    "Borrar": "Delete",
    "espacio": "space",
    "Incorrecto": "Incorrect",
    "Lorem ipsum: no hay más cartas por ahora.": "Lorem ipsum: no more letters for now.",

    // ---- Laberinto Yuxtapuesto
    "Lorem ipsum: llegaste al final del laberinto.": "Lorem ipsum: you reached the end of the labyrinth.",
    "Arriba": "Up",
    "Abajo": "Down",
    "Izquierda": "Left",
    "Derecha": "Right",

    // ---- Sincronización Emparejada
    "Siguiente": "Next",
    "¿Con qué equipo te emparejás?": "Which team are you pairing with?",
    "Emparejar": "Pair up",
    "Elijan uno cada uno": "Pick one each",
    "Tecleador": "Typist",
    "Pensador": "Thinker",
    "Encuentra primero lo que hay que teclear": "Finds what has to be typed first",
    "Le dice al otro qué buscar": "Tells the other what to look for",
    "Lorem ipsum: sincronización completa.": "Lorem ipsum: sync complete.",
    "Emparejar con otro equipo": "Pair with another team",
    "Reiniciar emparejamiento": "Restart pairing",
    "¿Seguro? Tocá otra vez": "Sure? Tap again",

    // ---- Caja Fuerte
    "Próximamente": "Coming soon",

    // ---- Mapa
    "Foto": "Photo",
    "Leyenda": "Legend",

    // ---- Entrenador
    "Reloj": "Clock",
    "Equipo": "Team",
    "Progreso": "Progress",
    "Reiniciar todo": "Reset everything",
    "Reiniciar": "Reset",
    "Fiesta": "Party",
    "Hora real": "Real time",
    "Según archivo": "As in the file",
    "Todo abierto": "All open",
    "Por horario": "By schedule",
    "abierto": "open",
    "abierto (forzado)": "open (forced)",
    " (real)": " (real)",
}

const team = (name) => english[name] || name

// Text with something of its own in it: a code, a team, a number
const patterns = [
    [/^Soy de (.+)$/, (_, name) => `I'm from ${team(name)}`],
    [/^(.+) \(tu equipo\)$/, (_, name) => `${team(name)} (your team)`],
    [/^El código es (.+)\. Mandale mecha, y un saludo a mi compañero\.$/, (_, code) => `The code is ${code}. Go for it, and say hi to my partner for me.`],
    [/^El código es (.+)\.$/, (_, code) => `The code is ${code}.`],
    [/^¡Acá está! Es el (.+)\. ¡Gracias por elegirnos!$/, (_, code) => `Here it is! It's ${code}. Thanks for choosing us!`],
    [/^Código anotado: (.*)$/, (_, code) => `Code noted: ${code}`],
    [/^Libro de pistas: (.+)$/, (_, n) => `Hint book: ${n}`],
    [/^en (\d+) min$/, (_, n) => `in ${n} min`],
    // the letters' first lines, while the letters are still drafts
    [/^(Picas|Corazones|Tréboles|Diamantes), paso (\d+)\.$/, (_, name, n) => `${team(name)}, step ${n}.`],
    [/^(Picas|Corazones|Tréboles|Diamantes), carta final\.$/, (_, name) => `${team(name)}, final letter.`],
    [/^(Picas|Corazones|Tréboles|Diamantes), carta secreta\.$/, (_, name) => `${team(name)}, secret letter.`],
    [/^Acá va el mensaje especial\.$/, () => `The special message goes here.`],
]

function translate(text) {
    if (text in english) return english[text]
    const trimmed = text.trim()
    if (trimmed !== text && trimmed in english) return text.replace(trimmed, english[trimmed])
    for (const [pattern, to] of patterns) if (pattern.test(trimmed)) return text.replace(trimmed, trimmed.replace(pattern, to))
    return null
}

// The text in the player's language. Spanish, or anything not translated yet, comes back as is.
// Text of several lines is translated line by line when it isn't known whole.
export function t(text) {
    if (lang.current !== "en" || typeof text !== "string" || !text.trim()) return text
    const whole = translate(text)
    if (whole !== null) return whole
    if (!text.includes("\n")) return text
    return text.split("\n").map(line => translate(line) ?? line).join("\n")
}
