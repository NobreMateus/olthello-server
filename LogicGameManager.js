class LogicGameManager {

    setGameState(gameState, x, y, currentType) {
        this.setLine(gameState, x, y, currentType, oldX => oldX+1, oldY => oldY+1)
        this.setLine(gameState, x, y, currentType, oldX => oldX+1, oldY => oldY-1)
        this.setLine(gameState, x, y, currentType, oldX => oldX-1, oldY => oldY+1)
        this.setLine(gameState, x, y, currentType, oldX => oldX-1, oldY => oldY-1)
        this.setLine(gameState, x, y, currentType, oldX => oldX, oldY => oldY+1)
        this.setLine(gameState, x, y, currentType, oldX => oldX, oldY => oldY-1)
        this.setLine(gameState, x, y, currentType, oldX => oldX+1, oldY => oldY)
        this.setLine(gameState, x, y, currentType, oldX => oldX-1, oldY => oldY)
        return gameState
    }

    setLine(gameState, x, y, currentType, setNewX, setNewY) {
        var newX = parseInt(x)
        var newY = parseInt(y)
        let advType
        currentType === 'x' ? advType = 'o' : advType = 'x'
        let changesCount = 0
        let currentPos

        do {
            newX = setNewX(newX) 
            newY = setNewY(newY)
            if (newX > 7 || newX < 0 || newY > 7 || newY < 0) {
                changesCount = 0
                break
            }
            currentPos = gameState[newX][newY]
            if (currentPos === currentType) break
            if (currentPos === advType) changesCount = changesCount + 1
            if (currentPos === '-') changesCount = 0
        } while (currentPos || currentPos !== '-')

        newX = parseInt(x)
        newY = parseInt(y)

        for (let i = 0; i < changesCount; i++) {
            newX = setNewX(newX) 
            newY = setNewY(newY)
            if (newX > 7 || newX < 0 || newY > 7 || newY < 0) {
                changesCount = 0
                break
            }
            gameState[newX][newY] = currentType
        }
    }

    getPontuations(gameState) {
        
        var countUser1 = 0
        var countUser2 = 0

        for(var r = 0; r<8; r++) {
            for(var c = 0; c< 8; c++) {
                if(gameState[r][c] === 'x') countUser1 = countUser1 + 1
                if(gameState[r][c] === 'o') countUser2 = countUser2 + 1
            }
        }
        return { user1Points: countUser1, user2Points: countUser2 }
    }
}

module.exports = LogicGameManager
