const targetWords = [
    "clone",
    "black",
    "point",
    "clear",
    "dream",
    "close",
    "plead",
    "ocean",
    "throw",
    "place",
    "house",
]

const dictionary = [
    "clone",
    "black",
    "point",
    "clear",
    "dream",
    "close",
    "plead",
    "ocean",
    "throw",
    "place",
    "house",
    "fleet",
    "fight",
    "small",
    "score",
    "sorry",
    "stole",
    "ghost",
    "slide",
    "smell"
]


const wordLenght = 5
const alertContainer = document.querySelector("[data-alert-container]")
let guessGrid = document.querySelector("[data-guess-grid]")
const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
console.log(dayOffset)
const targetWord = targetWords[Math.floor(dayOffset)]

startInteraction()

function startInteraction() {
    document.addEventListener('click', handleMouseClick)
    document.addEventListener('keydown', handleKeypress)
}

function stopInteraction() {
    document.removeEventListener('click', handleMouseClick)
    document.removeEventListener('keydown', handleKeypress)
}

function handleMouseClick(e){
    if (e.target.matches("[data-key]")){
        pressKey(e.target.dataset.key)
        return
    }

    if (e.target.matches("[data-enter]")){
        submitGuess()
        return
    }

    if (e.target.matches("[data-delete]")){
        deleteKey()
        return
    }


}

function handleKeypress(e){

    if (e.key === "Enter"){
        submitGuess()
        return
    }

    if (e.key === "Backspace" || e.key === "Delete"){
        deleteKey()
        return
    }

    if (e.key.match(/^[a-z]$/)){
        pressKey(e.key)
        return
    }

}

function pressKey (key){
    let activeTiles = getActiveTiles()
    let activeLetters  = activeTiles.length
    if (activeLetters >= 5){
        return
    }
    else{
        let nextTile = guessGrid.querySelector(":not([data-letter])")
        nextTile.dataset.letter = key.toLowerCase()
        nextTile.textContent = key
        nextTile.dataset.state = "active"
    }
    
}

function deleteKey() {
    const activeTiles = getActiveTiles()
    let activeLetters  = activeTiles.length
    const lastTile = activeTiles[activeLetters - 1]
    if(lastTile == null) return
    lastTile.textContent = ""
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}

function submitGuess (){
    const activeTiles = [...getActiveTiles()]
    let activeLetters  = activeTiles.length
    if (activeLetters !== 5){
        showAlert("Not enough letters")
        shakeTiles(activeTiles)
        return
    }
    const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter
    },"")

    if (dictionary.includes(guess)){
        showAlert("Not in word List")
        shakeTiles(activeTiles)
        return
    }

    stopInteraction()
    activeTiles.forEach((...params) => flipTile(...params, guess))
}

function getActiveTiles(){
    return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000){
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add("hide")
        alert
        .addEventListener("transitioned", () => {
            alert.remove()
        })
    }, duration)
}

function shakeTiles(tiles) {  
    tiles.forEach(tile => {
        tile.classList.add("shake")
        tile.addEventListener("animationed",
        () =>{
            tile.classList.remove("shake")
        }, {once: true}
        )
    })
}