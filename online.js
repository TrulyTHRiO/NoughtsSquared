var currentTurn = 0
var currentBoard = -1

// const smallGridsTemplate = [
//     [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//     [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1],
//     [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1]
// ]

var smallGrids
var bigGrid

// const bigGridTemplate = [
//     -1, -1, -1, 
//     -1, -1, -1, 
//     -1, -1, -1
// ]

// var currentBoard = window.localStorage.getItem("currentBoard")
// if (currentBoard == null) {
//     currentBoard = -1
//     window.localStorage.setItem("currentBoard", currentBoard)
// } else {
//     currentBoard = Number(window.localStorage.getItem("currentBoard"))
// }

var winner = -1
var gameOver = false // can also be determined if currentBoard == -2

const tiles = document.querySelectorAll(".tile")
const grids = document.querySelectorAll(".small-grid")

var droppedDown = true
document.getElementById("dropdown-button").addEventListener("click", () => {droppedDown ? document.getElementById("dropdown").classList.add("hidden") : document.getElementById("dropdown").classList.remove("hidden"); droppedDown = !droppedDown})

function PlaceToken(location) {
    let board = Math.floor(location/9)
    console.log(board)

    if (currentBoard == -1 || board == currentBoard) {
        if(smallGrids[board][location%9] == -1 && bigGrid[board] == -1) {
            DrawToken(board, location, currentTurn)
            let win = CheckWin(smallGrids[board], location%9, currentTurn)
            // console.log(win)
            if (win) {
                console.log("WINNER WINNER CHICKEN DINNER WEINER :D WINNER CHICKEN DINNER WINNER WINNER CHICKEN DINNER")
                bigGrid[board] = currentTurn
                DrawWin(board, currentTurn)
                gameOver = CheckWin(bigGrid, board, currentTurn)
                if (gameOver) { // document.getElementsByTagName("body")[0].classList.add(["nought-win", "cross-win"][currentTurn])
                    // document.getElementsByTagName("body")[0].classList.add(["nought-body", "cross-body"][currentTurn])
                    // document.getElementsByTagName("body")[0].classList.remove(["cross-body", "nought-body"][currentTurn])
                    winner = currentTurn
                } else {
                    gameOver = CheckStale(bigGrid)
                    if (gameOver) { // document.getElementsByTagName("body")[0].classList.add(["nought-win", "cross-win"][currentTurn])
                        // document.getElementsByTagName("body")[0].classList.add(["nought-body", "cross-body"][currentTurn])
                        // document.getElementsByTagName("body")[0].classList.remove(["cross-body", "nought-body"][currentTurn])
                        console.log("BROTHERMAN THE GAME IS OVER GO HOME IT'S A DRAW GO TO SLEEP NIGHTY NIGHT")
                        winner = -2
                    }
                }
                console.log(gameOver, "game over?")
            } else {
                let stale = CheckStale(smallGrids[board])
                if (stale) {
                    bigGrid[board] = -2
                    console.log("STALER STALER BEEF BREAKFAST STALER STALER LAMB LUNCH STALER STALER CHICKEN DINNER")
                    grids[board].classList.add("stale-win")
                    let winToken = document.createElement("div")
                    winToken.classList.add("win-token", "stale-token")
                    winToken.innerHTML = "□"
                    grids[board].appendChild(winToken)
                    gameOver = CheckStale(bigGrid)
                    if (gameOver) { // document.getElementsByTagName("body")[0].classList.add(["nought-win", "cross-win"][currentTurn])
                        // document.getElementsByTagName("body")[0].classList.add(["nought-body", "cross-body"][currentTurn])
                        // document.getElementsByTagName("body")[0].classList.remove(["cross-body", "nought-body"][currentTurn])
                        console.log("BROTHERMAN THE GAME IS OVER GO HOME IT'S A DRAW GO TO SLEEP NIGHTY NIGHT")
                        winner = -2
                    }
                }
            }
            currentTurn = currentTurn == 0 ? 1 : 0
            DrawCurrentTurn()
            console.log(location%9, "loco")
            currentBoard = bigGrid[location%9] != -1 ? -1 : (smallGrids[location%9].includes(-1) ? location%9 : -1)
            if (gameOver) {
                currentBoard = -2
                GameOver(false)
            }
            ColourGrids()
        }
        
    }
}

function RestartGame() {
    grids.forEach(element => {
        element.classList.remove("cross-win", "nought-win", "stale-win")
    })
    tiles.forEach(tile => tile.classList.remove("cross-token", "nought-token"))
    tiles.forEach(tile => tile.classList.add("available"))
    smallGrids = structuredClone(smallGridsTemplate)
    console.log(smallGrids)
    currentTurn = 0
    currentBoard = -1
    winner = -1
    gameOver = false
    DrawFromMemory()
}

function DrawFromMemory() {
    bigGrid = DetermineAllBoardWinners()
    if (DetermineBoardWinner(bigGrid) != -1) {
        gameOver = true
        winner = DetermineBoardWinner(bigGrid)
        GameOver(true)
    }
    bigGrid.forEach((token, location) => {
        DrawWin(location, token)
    })
    smallGrids.forEach((grid, gridNo) => {
        grid.forEach((token, location) => {
            DrawToken(gridNo, gridNo*9+location, token)
            console.log(gridNo)
        })
    })
    let count = 0
    smallGrids.forEach(grid => grid.forEach(token => {if (token == -1) count++}))
    console.log(count)
    currentTurn = count%2 == 1 ? 0 : 1
    ColourGrids()
    DrawCurrentTurn()
}

function DrawCurrentTurn () {
    // if (gameOver) {
        
    //     return
    // }
    document.body.classList.add(["nought-body", "cross-body"][currentTurn])
    document.body.classList.remove(["cross-body", "nought-body"][currentTurn])
    if (currentTurn == 1) {
        // if (!gameOver) 
        document.getElementById("nought-icon").classList.remove("turn")
        document.getElementById("cross-icon").classList.add("turn")
    } else {
        // if (!gameOver) 
        document.getElementById("cross-icon").classList.remove("turn")
        document.getElementById("nought-icon").classList.add("turn")
    }
}

function DetermineAllBoardWinners() {
    let winners = []
    smallGrids.forEach(grid => winners.push(DetermineBoardWinner(grid)))
    return winners
    // bigGrid = winners // return winners
}

function DetermineBoardWinner(board) { // because I am lazy
    let boardWinner = -1
    board.forEach((token, location) => {
        if (!(token == -1)) {
            let win = CheckWin(board, location, token)
            if (win) boardWinner = token
        }
    })
    if (boardWinner == -1 && CheckStale(board)) boardWinner = -2
    return boardWinner
}

function CheckWin(board, lastToken, tokenType) {
    let differences = []
    let win = false
    board.forEach((token, index) => {
        if (token != tokenType) return
        let difference = [Math.floor(lastToken/3 - Math.floor(index/3)), lastToken%3 - index%3]
        // console.log(difference)
        if (JSON.stringify(differences).includes(JSON.stringify([-difference[0], -difference[1]])) || JSON.stringify(differences).includes(JSON.stringify([difference[0]*2, difference[1]*2])) || JSON.stringify(differences).includes(JSON.stringify([difference[0]/2, difference[1]/2]))) {
            win = true
            return
        }
        differences.push(difference)
    })
    // console.log(differences)
    return win
}

function CheckStale(board) { // only to be used if win has already been checked and not found
    return !board.includes(-1)
}

function DrawToken(board, location, token) {
    if (token == -1) {
        tiles[location].innerHTML = ""
        return
    }
    tiles[location].innerHTML = "○×"[token]
    document.getElementsByTagName("body")[0].classList.add(["cross-body", "nought-body"][token])
    document.getElementsByTagName("body")[0].classList.remove(["nought-body", "cross-body"][token])
    tiles[location].classList.remove("available")
    tiles[location].classList.add(["nought-token", "cross-token"][token])
    smallGrids[board][location%9] = token
}

function DrawWin(board, token) {
    if (token == -1) {
        grids[board].querySelectorAll(".win-token").forEach(el => el.remove())
        return
    } else if (token == -2) token = 2
    grids[board].classList.add(["nought-win", "cross-win", "stale-win"][token])
    let winToken = document.createElement("div")
    winToken.classList.add("win-token", ["nought-token", "cross-token", "stale-token"][token])
    winToken.innerHTML = "○×□"[token]
    grids[board].appendChild(winToken)
}

function ColourGrids() {
    grids.forEach(element => {
        element.classList.remove("cross", "nought")
        // element.classList.remove(["cross", "nought"][currentTurn])
    })
    if (currentBoard == -2) return
    grids.forEach(element => {
        console.log(currentBoard)
        if (currentBoard == -1) element.classList.add(["nought", "cross"][currentTurn])
    })
    if (currentBoard != -1) grids[currentBoard].classList.add(["nought", "cross"][currentTurn])
}

function GameOver(refreshed) {
    let dropdownMenu = document.getElementById("dropdown")
    if (!refreshed) {
        setTimeout(() => {dropdownMenu.classList.remove("hidden"); droppedDown = true}, 1000)
    }
    dropdownMenu.querySelector("#win-text").innerHTML = winner == -2 ? "DRAW!" : `${"○×"[winner]} WINS!`
    if (winner == -2) document.body.classList.add("stale-body")
}