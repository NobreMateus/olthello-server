
class Room {

    // id: 1, name: "first room", userTurn: 'x', amountPlayers: 1, boardState: this.initialGameState.concat(), arrPos: 0, amountUsers: 0, user1Id: '', user2Id: ''
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
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', 'x', 'o', '-', '-', '-',
            '-', '-', '-', 'o', 'x', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
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

    updateBoardState(pos, userId) {

        console.log(pos)
        console.log(userId)
        console.log(this.user1Id)
        console.log(this.user2Id)

        if(this.userTurn === 'x') {
            console.log("Entrei 1")
            if(userId !== this.user1Id) return
            this.boardState[pos] = this.userTurn
            this.userTurn = 'o'
        }

        if(this.userTurn === 'o') {
            console.log("Entrei 2")
            if(userId !== this.user2Id) return
            this.boardState[pos] = this.userTurn
            this.userTurn = 'x'
        }
    }

    checkNewResult() {
        var gameState = [
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', 'o', '-', '-'],
            ['-', '-', '-', 'x', 'x', '-', 'x', '-'],
            ['-', '-', '-', 'o', 'x', '-', '-', 'x'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
        ]
    }

    setDiag1(gamesState, x, y, currentType) {
        newX = parseInt(x)
        newY = parseInt(y)
        let advType
        currentType==='x' ? advType = 'o' : advType = 'x' 
        let changesCount = 0
        let currentPos

        do {
            newX = newX + 1
            newY = newY + 1
            
            if(gamesState[newX]) currentPos = gamesState[newX][newY]
            else currentPos = undefined

            if (currentPos === currentType) break
            if (currentPos === advType) changesCount = changesCount + 1
            if (currentPos === undefined || currentPos === '-') changesCount = 0

        } while (currentPos !== undefined || currentPos !== '-') 

        return changesCount
    }

}

module.exports = Room