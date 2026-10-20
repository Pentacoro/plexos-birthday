// The texts each game opens and ends with, shown full screen as a wall of text that scrolls
// (story.js): preview (the phone only) once every team's preview call has been heard before the
// party, intro the first time the game is opened once it is open for play, done once it is
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

Bueno, cuanto menos una promesa: el 24 de octubre, a las 10:00pm...`,
        intro: `"Teléfono Fibonacci"...

Un título peculiar, de no ser porque el contexto en su particularidad lo ubica perfectamente. Un ícono apartado a un rincón, desde una interfaz inusual y aún familiar. ¿Un Escritorio? ¿Una ventana?

Y ahora, un teléfono. Quizás irónicamente lo menos apropiado de encontrarse tres pantallas dentro de una página web, hoy que el teléfono puede acceder a ellas. ¿Y Teléfonos como estos? Uno imaginaría que ya no funcionan.

Tendré que probarlo.`,
        done: `Texto de Teléfono Fibonacci hecho.

${lorem}`,
        complete: `Texto de Teléfono Fibonacci completo.

${lorem}`,
    },
    webdetective: {
        button: "Investigar",
        intro: `Texto de inicio de Detective Web.

${lorem}`,
        done: `Texto de Detective Web hecho.

${lorem}`,
        complete: `Texto de Detective Web completo.

${lorem}`,
    },
    labyrinth: {
        button: "Recoger",
        intro: `Texto de inicio de Laberinto Yuxtapuesto.

${lorem}`,
        done: `Texto de Laberinto Yuxtapuesto hecho.

${lorem}`,
        complete: `Texto de Laberinto Yuxtapuesto completo.

${lorem}`,
    },
    sync: {
        button: "Sincronizar",
        intro: `Texto de inicio de Sincronización Emparejada.

${lorem}`,
        done: `Texto de Sincronización Emparejada hecha.

${lorem}`,
        complete: `Texto de Sincronización Emparejada completa.

${lorem}`,
    },
    artifacts: {
        button: "Abrir",
        intro: `Texto de inicio de Caja Fuerte.

${lorem}`,
        done: `Texto de Caja Fuerte hecha.

${lorem}`,
        complete: `Texto de Caja Fuerte completa.

${lorem}`,
    },
}
