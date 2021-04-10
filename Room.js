const LogicGameManager = require("./LogicGameManager")

class Room {

    id
    name
    amountUsers
    userTurn
    boardState
    arrPos
    user1Id = ""
    user2Id = ""
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
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', 'x', 'o', '-', '-', '-'],
            ['-', '-', '-', 'o', 'x', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
        ]
    }

    addUser(userId, userConnection) {
        if(this.isFull) return false

        if(this.user1Id === ""){
            this.user1Id = userId
            this.amountUsers = this.amountUsers + 1
            if(this.amountUsers === 2) this.isFull = true
            userConnection.on("disconnect", () => {
                this.user1Id = ""
                this.amountUsers = this.amountUsers - 1
                this.isFull = false
            })
            return true
        }

        if(this.user2Id === ""){
            this.user2Id = userId
            this.amountUsers = this.amountUsers + 1
            if(this.amountUsers === 2) this.isFull = true
            userConnection.on("disconnect", () => {
                this.user2Id = ""
                this.amountUsers = this.amountUsers - 1
                this.isFull = false
            })
            return true
        }

        return false
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
    }
}

module.exports = Room