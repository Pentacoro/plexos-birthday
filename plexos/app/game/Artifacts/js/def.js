import {getTask} from "/plexos/lib/functions/dll.js"
import Task from "/plexos/lib/classes/system/task.js"
import {equations} from "/plexos/app/game/Artifacts/equations.js"
import {perPlayer} from "/plexos/app/game/Artifacts/perPlayer.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.party  = Task.get("Party").mem
mem.id     = "artifacts"
mem.player = mem.party.player?.name || ""
// a player without a team (only while testing) plays as spades
mem.team   = mem.party.player?.team || "spades"

// The fifth puzzle needs every team's artifact, so every team gives something to it: six
// stages in a row, each opening the next, the last the player's own password (route.js)
mem.stages = ["equation", "disc", "table", "cells", "symbols", "password"]
// Each stage's entry in the hint book. Placeholders: set them to the book's numbers.
mem.hintEntries = [9, 10, 11, 12, 13]

// The route being played: the player's own, or, once that is done, another player's (route.js).
// Every stage reads the route's: its player's equation, team, own code on spades' papers, cells and symbols
// (perPlayer.js), under their name or one they had before (a spare written in keeps its card
// name there); one of the team's for a player not on the lists (only while testing).
const ofTeam = (list, team) => Object.entries(list).find(([name]) => mem.party.players.find(p => p.name === name)?.team === team)?.[1]
const ofPlayer = (list, player) => [player?.name, ...(player?.formerly || [])].map(name => list[name]).find(Boolean)
mem.setRoute = (name) => {
    mem.routePlayer = mem.party.players.find(p => p.name === name) || mem.party.player
    mem.route = mem.routePlayer?.name || mem.player
    mem.routeTeam = mem.routePlayer?.team || mem.team
    mem.equation = ofPlayer(equations, mem.routePlayer) || ofTeam(equations, mem.routeTeam)
    mem.mine = ofPlayer(perPlayer, mem.routePlayer) || ofTeam(perPlayer, mem.routeTeam)
}
mem.setRoute(mem.player)

// The artifacts the stages need, by the team that found each, for their badges: opened, the
// badge shows that team's suit. Clubs' (the phone's) for the second, spades' (Detective Web's)
// for the third, diamonds' (the Labyrinth's) for the fourth, hearts' (Sync's) for the fifth
mem.stageArtifacts = {
    disc:    { team: "clubs" },
    table:   { team: "spades" },
    cells:   { team: "diamonds" },
    symbols: { team: "hearts" },
}

// The items, as each team's phone character sends them: the unknowns in the equations
mem.itemIcon = (team) => "/plexos/app/game/Party/img/item-" + team + ".svg"

mem.busy = false

mem.root   = task.node.querySelector(".puzzle")
mem.dots   = mem.root.querySelector(".stage-dots")
mem.screen = mem.root.querySelector(".screen")
