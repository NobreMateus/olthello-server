const Room = require('./Room')

class RoomsManager {
    
    socket
  
    rooms = [
        new Room(1, 0, "first"),
        new Room(2, 1, "second"),
        new Room(3, 2, "third")
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
                const currentRoom = Room.getRoomByName(this.rooms, data.roomName)
                if(currentRoom === undefined) return

                this.updateBoardState(data.roomName, data.pos, connection.id)
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
        const currentRoom = Room.getRoomByName(this.rooms, roomName)
        if(currentRoom.isFull) {
            console.log("Room Cheia")
            userConnection.emit("fullRoom", roomName)
            return
        }
        currentRoom.addUser(userConnection.id, userConnection)
        userConnection.join(roomName)
        this.socket.to(roomName).emit("startGame", {
            gameState: this.rooms[currentRoom.arrPos].boardState,
            userTurn: this.rooms[currentRoom.arrPos].userTurn
        })
        this.socket.emit("getRooms", this.rooms)
    }

    updateBoardState(roomName, pos, userId) {
        const currentRoom = Room.getRoomByName(this.rooms, roomName)
        if(currentRoom === undefined) return
        // if(currentRoom.userTurn !== type) return

        currentRoom.updateBoardState(pos, userId)
        this.sendBoardState(roomName)

        
    }

    sendBoardState(roomName) {
        const currentRoom = Room.getRoomByName(this.rooms, roomName)
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

    getAllRooms() {

    }
}

module.exports = RoomsManager