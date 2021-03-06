const LogicGameManager = require("./LogicGameManager")

class Room {

    id
    name
    amountUsers
    userTurn
    boardState
    arrPos
    user1Id = ""
    user1Name = ""
    user2Name = ""
    user2Id = ""
    user1Points = 0
    user2Points = 0
    user1Con
    user2Con
    isFull

    static getRoomByName(allRooms, roomName) {
        return allRooms.find( r => r.name === roomName)
    }

    constructor(id, arrPos, name) {
        this.id = id
        this.name = name
        this.amountUsers = 0
        this.userTurn = 'x'
        this.arrPos = arrPos
        this.isFull = false
        this.boardState = [
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', 'p', '-', '-', '-'],
            ['-', '-', '-', 'x', 'o', 'p', '-', '-'],
            ['-', '-', 'p', 'o', 'x', '-', '-', '-'],
            ['-', '-', '-', 'p', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
        ]
    }

    addUser(userId, userName, userConnection, socket, rooms) {
        if(this.isFull) return false

        if(this.user1Id === ""){
            this.user1Id = userId
            this.user1Name = userName
            this.amountUsers = this.amountUsers + 1
            if(this.amountUsers === 2) this.isFull = true
            // this.user1Con = userConnection

            userConnection.on("disconnect", () => {
                socket.to(this.name).emit("endGame", {
                    message: `Player 1 desconectou`,
                    winner: 'Player 2'
                })
                userConnection.leave(this.name)
                this.restartRoom()
                socket.emit("getRooms", rooms)
            })
            userConnection.on("giveUp", () => {
                console.log("Player 2  desistiu")
                userConnection.leave(this.name)
                socket.to(this.name).emit("endGame", {
                    message: `Player 1 desistiu`,
                    winner: 'Player 2'
                })
                userConnection.leave(this.name)
                this.restartRoom()
                socket.emit("getRooms", rooms)
            })

            return true
        }

        if(this.user2Id === ""){
            this.user2Id = userId
            this.user2Name = userName
            this.amountUsers = this.amountUsers + 1
            if(this.amountUsers === 2) this.isFull = true
            // this.user2Con = userConnection

            userConnection.on("disconnect", () => {
                userConnection.leave(this.name)
                socket.to(this.name).emit("endGame", {
                    message: `Player 2 desconectou`,
                    winner: 'Player 1'
                })
                this.restartRoom()
                socket.emit("getRooms", rooms)
            })
            userConnection.on("giveUp", () => {
                userConnection.leave(this.name)
                console.log("Player 1  desistiu")
                socket.to(this.name).emit("endGame", {
                    message: `Player 2 desistiu`,
                    winner: 'Player 1'
                })
                this.restartRoom()
                socket.emit("getRooms", rooms)
            })

            return true
        }

        return false
    }

    restartRoom() {
        this.amountUsers = 0
        this.userTurn = 'x'
        this.isFull = false
        this.boardState = [
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', 'p', '-', '-', '-'],
            ['-', '-', '-', 'x', 'o', 'p', '-', '-'],
            ['-', '-', 'p', 'o', 'x', '-', '-', '-'],
            ['-', '-', '-', 'p', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
        ]
        this.user1Id = ""
        this.user2Id = ""
        this.user1Name = ""
        this.user2Name = ""
    }

    removeUser(userId) {
        if(this.user1Id === userId){
            this.user1Id = ""
            return true
        }

        if(this.user2Id === userId){
            this.user2Id = ""
            return true
        }
        return false
    }

    updateBoardState(x, y, userId) {

        if(this.user1Id === "" || this.user2Id === "") return

        if(this.userTurn === 'x') {
            if(userId !== this.user1Id) return
            this.boardState[x][y] = this.userTurn
            this.checkNewResult(x, y, 'x')
            this.userTurn = 'o'
        }

        if(this.userTurn === 'o') {
            if(userId !== this.user2Id) return
            this.boardState[x][y] = this.userTurn
            this.checkNewResult(x, y, 'o')
            this.userTurn = 'x'
        }
    }

    checkNewResult(x, y, type) {
        const logicGameManager = new LogicGameManager()
        this.boardState = logicGameManager.setGameState(this.boardState, x, y, type)
        let newType
        type === 'x' ? newType = 'o' : newType = 'x'
        logicGameManager.checkAllPosssiblePositions(this.boardState, newType)
        const pontuation = logicGameManager.getPontuations(this.boardState)
        this.user1Points = pontuation.user1Points
        this.user2Points = pontuation.user2Points
    }

    desconnectUser(userConnection) {
        userConnection.leave(this.name)
    }
}

module.exports = Room