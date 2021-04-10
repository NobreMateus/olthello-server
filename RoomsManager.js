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
                this.startNewGame(data.roomName, data.userName, connection)
            })

            connection.on("updateGame", (data)=>{
                const currentRoom = Room.getRoomByName(this.rooms, data.roomName)
                if(currentRoom === undefined) return

                this.updateBoardState(data.roomName, data.x, data.y, connection.id)
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

    startNewGame(roomName, userName,userConnection) {
        const currentRoom = Room.getRoomByName(this.rooms, roomName)
        if(currentRoom.isFull) {
            console.log("Room Cheia")
            userConnection.emit("cantEnterRoom", {
                roomName: roomName,
                message: "Sala está cheia"
            })
            return
        }

        if(this.roomOfUser(userConnection.id) !== undefined){
            console.log("User Já pertence a uma room")
            userConnection.emit("cantEnterRoom", {
                roomName: roomName,
                message: "Esse usuário já está em uma sala"
            })
            return      
        }  

        currentRoom.addUser(userConnection.id, userName, userConnection, this.socket, this.rooms)
        userConnection.join(roomName)
        this.socket.to(roomName).emit("startGame", {
            gameState: this.rooms[currentRoom.arrPos].boardState,
            userTurn: this.rooms[currentRoom.arrPos].userTurn
        })

        console.log(currentRoom.user1Name)
        console.log(currentRoom.user2Name)

        this.socket.to(roomName).emit("getInfo", {
            user1Name: currentRoom.user1Name,
            user2Name: currentRoom.user2Name,
            roomName: currentRoom.name
        })

        this.socket.emit("getRooms", this.rooms)
    }

    updateBoardState(roomName, x, y, userId) {
        const currentRoom = Room.getRoomByName(this.rooms, roomName)
        if(currentRoom === undefined) return
        // if(currentRoom.userTurn !== type) return

        currentRoom.updateBoardState(x, y, userId)
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

    roomOfUser(id) {
        for(let room of this.rooms) {
            if(room.user1Id === id || room.user2Id === id) return room
        }
        return undefined
    }
}

module.exports = RoomsManager