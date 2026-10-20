import Task from "/plexos/lib/classes/system/task.js"
import {pushBack, leave, suspendAbove, resume} from "./backStack.js"

// Closing a puzzle only hides it, so opening it again brings it back exactly as it was.
// An open window is a step back can undo, like closing an app on a phone. Closed with screens
// still open inside it, those come back above it when it reopens, and back closes them first.
function hide(task) {
    task.window.node.style.display = "none"
    task.backEntry = null
    Task.get("Desktop")?.focus()
}

export function hideOnClose(task) {
    task.partyWindow = true
    // the window is made right after: dark from its first frame, not white until its page loads
    queueMicrotask(() => task.window?.node.classList.add("party-app"))
    task.onEnd = () => {
        task.suspended = suspendAbove(task.backEntry)
        leave(task.backEntry)
        hide(task)
        return false
    }
    task.backEntry = pushBack(() => hide(task))
}

export function reopen(task) {
    task.window.node.style.display = ""
    task.focus()
    if (task.backEntry) return
    task.backEntry = pushBack(() => hide(task))
    resume(task.suspended || [])
    task.suspended = null
    // a page that became due while the game was closed, such as the phone's intro after its preview
    task.mem.tellStory?.()
}
