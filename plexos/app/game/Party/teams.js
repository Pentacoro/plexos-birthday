// The four teams, with the code printed on their members' ID cards and the color scheme
// the system takes for them. Drawn as paths, never as suit characters, because phones swap those for emoji.
export const teams = {
    spades: {
        name: "Picas",
        code: "526",
        scheme: "Blue",
        color: "#3fa9f5",
        path: "M12 2.5C9.5 6 3.5 9 3.5 13.5a4.2 4.2 0 0 0 7.3 2.8L9.5 21h5l-1.3-4.7a4.2 4.2 0 0 0 7.3-2.8C20.5 9 14.5 6 12 2.5z",
    },
    hearts: {
        name: "Corazones",
        code: "918",
        scheme: "Red",
        color: "#ff4a5a",
        path: "M12 20.5s-8-5-8-11a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 6-8 11-8 11z",
    },
    clubs: {
        name: "Tréboles",
        code: "777",
        scheme: "Green",
        color: "#3ddc6a",
        path: "M12 3a3.6 3.6 0 0 0-3.1 5.5A3.6 3.6 0 1 0 10.6 15L9.5 21h5l-1.1-6a3.6 3.6 0 1 0 1.7-6.5A3.6 3.6 0 0 0 12 3z",
    },
    diamonds: {
        name: "Diamantes",
        code: "403",
        scheme: "Purple",
        color: "#c94cff",
        path: "M12 2.5 19.5 12 12 21.5 4.5 12z",
    },
}

export const teamOrder = ["spades", "hearts", "clubs", "diamonds"]

export function teamIcon(team) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.classList.add("team-icon", team)
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", teams[team].path)
    path.setAttribute("fill", "none")
    path.setAttribute("stroke", teams[team].color)
    path.setAttribute("stroke-width", "1.8")
    path.setAttribute("stroke-linejoin", "round")
    svg.append(path)
    return svg
}
