class RoomsManager {
    
    socket
    
    initialGameState = [
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
    ]
    firstUserTurn = 'x'
    rooms = [
        {id: 1, name: "first room", userTurn: 'x', amountPlayers: 1, boardState: this.initialGameState.concat(), arrPos: 0},
        {id: 2, name: "second room", userTurn: 'x', amountPlayers: 1, boardState: this.initialGameState.concat(), arrPos: 1},
        {id: 3, name: "third room", userTurn: 'x', amountPlayers: 1, boardState: this.initialGameState.concat(), arrPos: 2},
        {id: 4, name: "fourth room", userTurn: 'x', amountPlayers: 1, boardState: this.initialGameState.concat(), arrPos: 3},
        {id: 5, name: "fifth room", userTurn: 'x', amountPlayers: 1, boardState: this.initialGameState.concat(), arrPos: 4},
    ]

    constructor(socket) {
        this.socket = socket
        this.setListeners()
    }

    setListeners() {
        if(this.socket == undefined) return
        this.socket.on("connection", (connection)=> {
            console.log("Client Conectado")
            connection.emit("getRooms", this.rooms)

            connection.on("enterRoom", (data)=>{
                console.log("entrei na room: " + data.roomName )
                this.startNewGame(data.roomName, connection)
            })

            connection.on("updateGame", (data)=>{
                console.log(data.roomName)
                const currentRoom = this.getRoomDataFromName(data.roomName)
                if(currentRoom === undefined) return

                this.updateBoardState(data.roomName, data.pos, data.userTurn)
            })
        
            //Implementar a Logia de Desconexão

            connection.on("newMessage", (data) => {
                console.log("Nova Mensagem Recebida")
                console.log(data)
                this.socket.to(data.roomName).emit("newMessage", {
                    user: data.user,
                    message: data.message,
                    userType: "data.userType"
                })
            })
        })
    }

    startNewGame(roomName, userConnection) {
        //Logica para verificar se a sala não está cheia
        const currentRoom = this.getRoomDataFromName(roomName)
        // if(currentRoom === undefined) {
        //     this.rooms.push({name: roomName, ...this.roomInitialState})
        // }
        userConnection.join(roomName)
        this.socket.to(roomName).emit("startGame", {
            gameState: this.rooms[currentRoom.arrPos].boardState,
            userTurn: this.rooms[currentRoom.arrPos].userTurn
        })
    }

    updateBoardState(roomName, pos, type) {
        console.log("Excutei")
        const currentRoom = this.getRoomDataFromName(roomName)
        if(currentRoom === undefined) return
        if(currentRoom.userTurn !== type) return

        if(currentRoom.boardState[pos] === '-') {
            this.rooms[currentRoom.arrPos].boardState[pos] = type
            // currentRoom.boardState[pos] = type
            currentRoom.userTurn==='x'?currentRoom.userTurn='o':currentRoom.userTurn='x'
            
            this.sendBoardState(roomName)
        }
    }

    sendBoardState(roomName) {
        const currentRoom = this.getRoomDataFromName(roomName)
        if(currentRoom === undefined) return 
        this.socket.to(roomName).emit("updateBoardState", {
            gameState: currentRoom.boardState,
            userTurn: currentRoom.userTurn
        })
    }

    getRoomDataFromName(roomName) {
        const room = this.rooms.find(r => r.name === roomName)
        return room
    }
}

module.exports = RoomsManager