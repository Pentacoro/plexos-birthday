import {getTask} from "/plexos/lib/functions/dll.js"
import {teamIcon} from "/plexos/app/game/Party/teams.js"
import {pushBack, leave} from "/plexos/app/game/Party/backStack.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// Every number that picked up is kept as a contact, saved with the player's progress.
// They live in a menu that slides up from the bottom; tapping one dials it straight away.
mem.contactList     = mem.root.querySelector(".contacts")
mem.contactSheet    = mem.root.querySelector(".contact-sheet")
mem.contactButton   = mem.root.querySelector(".contacts-button")
mem.contactBackdrop = mem.root.querySelector(".contact-backdrop")
mem.contactBack     = null

mem.openContacts = () => {
    if (mem.mode !== "dial" || mem.root.classList.contains("contacts-open")) return
    mem.renderContacts()
    mem.root.classList.add("contacts-open")
    mem.contactBack = pushBack(() => mem.closeContacts(true))
}

// The back button has already taken its history step; any other way of closing takes it here
mem.closeContacts = (byBack = false) => {
    if (!mem.root.classList.contains("contacts-open")) return
    mem.root.classList.remove("contacts-open")
    if (!byBack) leave(mem.contactBack)
    mem.contactBack = null
}

mem.contacts = () => mem.party.flag(mem.id, "contacts") || []

mem.addContact = async (who, number) => {
    const contacts = mem.contacts()
    if (contacts.some(contact => contact.number === number)) return
    await mem.party.setFlag(mem.id, "contacts", [...contacts, { who, number }])
}

function contactName(who) {
    return mem.characters[who]?.name || (who === "intro" ? "Fibonacci" : mem.party.teams[who].name)
}

function phoneIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.classList.add("team-icon")
    svg.innerHTML = `<path d="M6.6 3.5l2.6 2.9-1.6 2.4a12 12 0 0 0 7.6 7.6l2.4-1.6 2.9 2.6-1.3 2.4c-.4.7-1.2 1-2 .9C9.8 19.8 4.2 14.2 3.3 6.8c-.1-.8.2-1.6.9-2z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>`
    return svg
}

mem.renderContacts = () => {
    mem.contactList.replaceChildren()
    if (!mem.contacts().length) {
        const empty = document.createElement("p")
        empty.className = "contacts-empty"
        empty.textContent = "Todavía no tenés contactos."
        mem.contactList.append(empty)
    }
    for (const { who, number } of mem.contacts()) {
        const contact = document.createElement("button")
        contact.type = "button"
        contact.className = "contact"
        contact.dataset.number = number
        const text = document.createElement("span")
        const name = document.createElement("b")
        name.textContent = contactName(who)
        const digits = document.createElement("small")
        digits.textContent = number
        text.append(name, digits)
        contact.append(who === "intro" ? phoneIcon() : teamIcon(who), text)
        mem.contactList.append(contact)
    }
}

mem.dialContact = (number) => {
    if (mem.mode !== "dial") return
    mem.closeContacts()
    mem.entry = number
    mem.renderSlots()
    mem.dial(number)
}
