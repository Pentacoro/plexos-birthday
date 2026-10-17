import {getTask} from "/plexos/lib/functions/dll.js"

let task = getTask(/TASKID/)
let mem  = task.mem

// One sheet of paper carries the whole puzzle: it arrives as the letter, becomes the page in
// the typewriter, and leaves folded in the reply. Flat, it shows its live content. Folding and
// unfolding play on two halves that copy that content, the lower one hinged at the middle.

// Every tween animates from where the element is to where it goes, then stays there
mem.tween = (el, to, duration, easing = "ease") => {
    const from = el.style.transform || "none"
    el.style.transform = to
    return el.animate([{ transform: from }, { transform: to }], { duration, easing }).finished
}

// A letter can open with a heading, as the reply to a wrong answer does
mem.letterHeading = null
mem.showLetterText = (text, heading = mem.letterHeading) => {
    mem.letterHeading = heading
    mem.letterText.replaceChildren()
    if (heading) {
        const title = document.createElement("strong")
        title.className = "letter-heading"
        title.textContent = heading
        mem.letterText.append(title)
    }
    mem.letterText.append(text)
    mem.letterText.scrollTop = 0
    mem.letter.classList.remove("mode-answer")
    mem.letter.classList.add("mode-text")
}

mem.showAnswerSheet = () => {
    mem.letter.classList.remove("mode-text")
    mem.letter.classList.add("mode-answer")
}

function copyToHalves() {
    const content = mem.letter.querySelector(".letter-full").innerHTML
    for (const half of mem.letter.querySelectorAll(".half-content")) half.innerHTML = content
    // the copies keep the scroll of the letter they were made from
    const scroll = mem.letterText.scrollTop
    for (const text of mem.letter.querySelectorAll(".half-content .letter-text")) text.scrollTop = scroll
}

// Folded without animation: how a letter sits in an envelope
mem.setFolded = () => {
    copyToHalves()
    mem.foldHalf.style.transform = "rotateX(180deg)"
    mem.letter.classList.remove("flat")
    mem.letter.classList.add("folded")
}

// Flat without animation: a letter brought back to read again
mem.setFlat = () => {
    mem.foldHalf.style.transform = "rotateX(0deg)"
    mem.letter.classList.remove("folded")
    mem.letter.classList.add("flat")
}

mem.unfold = async () => {
    copyToHalves()
    await mem.tween(mem.foldHalf, "rotateX(0deg)", 650, "cubic-bezier(0.3, 0.7, 0.3, 1)")
    mem.letter.classList.remove("folded")
    mem.letter.classList.add("flat")
}

mem.fold = async () => {
    copyToHalves()
    mem.foldHalf.style.transform = "rotateX(0deg)"
    mem.letter.classList.remove("flat")
    mem.letter.classList.add("folded")
    await mem.tween(mem.foldHalf, "rotateX(180deg)", 600, "cubic-bezier(0.5, 0, 0.6, 1)")
}
