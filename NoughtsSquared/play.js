const server = new WebSocket("wss://home.chessarmies.com:5072")

function GetCookies() { // gets stored cookies
    let cookies = document.cookie
    let splitCookies = cookies.split("; ")
    var parseCookies = {}
    splitCookies.forEach(function(element) {
        element = (element.replace("=", ";")).split(";") // split on only the first "="
        parseCookies[element[0]] = element[1]
    })
    return parseCookies
}


{
    var cookies = GetCookies()
    var UUID = cookies.UUID
    var gameCode = cookies.gameCode
    if (UUID == undefined || gameCode == undefined) {
        window.location.href = "https://thrio.dev/NoughtsSquared/"
    } else {
        document.getElementById("code").innerHTML = gameCode
        var sendReq = true
    }
}

tiles.forEach(element => {
    element.addEventListener("click", event => {
        // console.log([...tiles].indexOf(element))

        RequestToken([...tiles].indexOf(element))
    })
})

function RequestGame() {
    let request = {
        requestType: "REQUESTGAMEOBJECT",
        gameCode: gameCode,
    }
    server.send(JSON.stringify(request))
}

function RequestToken(location) {
    let request = {
        requestType: "REQUESTTOKEN",
        gameCode: gameCode,
        location: location
    }
}

document.getElementById("startGameButton").onclick = function() {
    let request = {
        requestType: "STARTPIECEASSIGNMENT",
        gameCode: gameCode,
    }
    server.send(JSON.stringify(request))
}

server.onopen = function(event) { // on connecting to the server, sets up the event listener to handle any received data 
    if (sendReq == true) {
        let request = {
            requestType: "ASSIGNCLIENT",
            UUID: UUID,
            gameCode: gameCode,
        }
        server.send(JSON.stringify(request))
        RequestGame()
    }
    server.onmessage = function(data) { // handles data received from the server
        let parseData = JSON.parse(data.data)
        switch (parseData.responseType) {
            case "GAMEOBJECT": {
                smallGrids = parseData.smallGrids
                DrawFromMemory()
                break
            }
            case "PLACETOKEN": {
                let location = parseData.location
                PlaceToken(location)
                break
            }
            case "GAMEOVER": {
                gameState = "over"
                let piece = boardArr[alphabet.indexOf(parseData.from[0])][parseData.from[1]-1]
                let posTo = parseData.to
                MovePiece(piece, posTo, undefined)
                break
            }
        }
    }
}
