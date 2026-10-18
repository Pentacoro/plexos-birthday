import {getTask} from "/plexos/lib/functions/dll.js"
import plexos from "/boot/plexos.js"
import {players, playerByName} from "./players.js"
import {teams} from "./teams.js"
import {access} from "./puzzles.js"
import {lang} from "./lang.js"

let task = getTask(/TASKID/)
let mem  = task.mem

mem.players = players
mem.teams   = teams
// The profile name is the player name, set by the password at boot
mem.player  = playerByName(plexos.User)
// the test users play with everything open, whatever the time
access.tester = !!mem.player?.tester
// the language the game speaks to this player (lang.js)
lang.current = mem.player?.lang || "es"
