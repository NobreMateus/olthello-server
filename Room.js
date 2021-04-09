
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

    constructor(id, arrPos, name, user1Id) {
        this.id = id
        this.name = name
        this.amountUsers = 1
        this.userTurn = 'x'
        this.arrPos = arrPos
        this.user1Id = user1Id
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

    addUser(userId) {
        if(this.isFull) return false

        if(this.user1Id === ""){
            this.user1Id = userId
            this.amountUsers = this.amountUsers + 1
            if(this.amountUsers === 2) this.isFull = true
            return true
        }

        if(this.user2Id === ""){
            this.user2Id = userId
            this.amountUsers = this.amountUsers + 1
            if(this.amountUsers === 2) this.isFull = true
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

    updateBoardState(pos, type) {
        this.boardState[pos] = type
    }

    checkNewResult() {

    }

}