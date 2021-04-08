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
    roomInitialState = {
        name: "first room",
        boardState: this.initialGameState,
        userTurn: this.firstUserTurn
    }
    rooms = []

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
                console.log("entrei na room")
                this.startNewGame(data.roomName, connection)
            })

            connection.on("updateGame", (data)=>{
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
        if(currentRoom === undefined) {
            this.rooms.push(this.roomInitialState)
        }
        userConnection.join(roomName)
        this.socket.to(roomName).emit("startGame", {
            gameState: this.initialGameState,
            userTurn: this.firstUserTurn
        })
    }

    updateBoardState(roomName, pos, type) {
        const currentRoom = this.getRoomDataFromName(roomName)
        if(currentRoom === undefined) return
        if(currentRoom.userTurn !== type) return
        if(currentRoom.boardState[pos] === '-') {
            currentRoom.boardState[pos] = type
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