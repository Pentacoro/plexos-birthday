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
    button.style.display = "none"
    return button
}
