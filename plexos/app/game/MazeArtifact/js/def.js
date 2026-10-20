import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Artifact 3 on the desktop: diamonds' whole maze, the artifact laid over their own card as
// printed (assets/MazeArtifact/print.mjs), shown as the Map shows its own, one picture to zoom into
mem.root = task.node.querySelector(".map")
