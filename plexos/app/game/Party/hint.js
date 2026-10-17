// The hint button in a puzzle's top right corner. It only gives the puzzle's entry in the
// hint book, the physical book of hints, numbered in Roman numerals. It shares its row with
// the category badge, and only one of the two is open at a time (badge.css).
export function roman(number) {
    const numerals = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]
    let out = ""
    for (const [value, numeral] of numerals) {
        while (number >= value) {
            out += numeral
            number -= value
        }
    }
    return out
}

export function hintButton(entry) {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "hint-button"
    const label = document.createElement("span")
    label.className = "hint-label"
    label.textContent = "Libro de pistas: " + roman(entry)
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11c.6 0 1 .4 1 1v15c0-.6-.4-1-1-1H5.5c-.8 0-1.5-.7-1.5-1.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13c-.6 0-1 .4-1 1v15c0-.6.4-1 1-1h5.5c.8 0 1.5-.7 1.5-1.5z"/><path d="M15 8.5h2.5M15 11.5h2.5" stroke-linecap="round"/></svg>`
    button.prepend(label)
    button.onclick = () => button.classList.toggle("open")
    return button
}
