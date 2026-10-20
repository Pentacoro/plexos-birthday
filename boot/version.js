// Phones keep a tab alive for days, so a guest coming back to it would still be running the code
// it opened with. /version.txt changes with every deploy: it is read when the page starts, and
// again whenever the page comes back into view; a different one reloads the page, onto the new
// code. Progress is already saved in the browser, so the reload loses nothing.
const url = "/version.txt"
let current = null

async function read() {
    try {
        const response = await fetch(url + "?" + Date.now(), { cache: "no-store" })
        return response.ok ? (await response.text()).trim() : null
    } catch {
        // offline, or the site unreachable: keep going as we are
        return null
    }
}

async function check() {
    const live = await read()
    if (!live) return
    if (current === null) current = live
    else if (live !== current) location.reload()
}

check()
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") check() })
// brought back from the browser's page cache, as it was when left
window.addEventListener("pageshow", e => { if (e.persisted) check() })
