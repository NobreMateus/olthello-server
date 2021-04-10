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
            if (currentPos === '-' || currentPos === 'p') {
                changesCount = 0
                break
            }
        } while (currentPos || currentPos !== '-' ||currentPos !== 'p')

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

    checkAllPosssiblePositions(gameState, currentType) {
        for(var r = 0; r<8; r++) {
            for(var c = 0; c< 8; c++) {
                this.seeIfCanPlayPosition(gameState, r, c, currentType)
            }
        }
    }

    seeIfCanPlayPosition(gameState, x, y, currentType) {

        if(gameState[x][y] === 'x') return
        if(gameState[x][y] === 'o') return

        const line1 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX+1, oldY => oldY+1)
        const line2 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX+1, oldY => oldY-1)
        const line3 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX-1, oldY => oldY+1)
        const line4 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX-1, oldY => oldY-1)
        const line5 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX, oldY => oldY+1)
        const line6 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX, oldY => oldY-1)
        const line7 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX+1, oldY => oldY)
        const line8 = this.seeIfCanPlayLine(gameState, x, y, currentType, oldX => oldX-1, oldY => oldY)

        if(
            line1 ||
            line2 ||
            line3 ||
            line4 ||
            line5 ||
            line6 ||
            line7 ||
            line8
        ) {
            gameState[x][y] = 'p'
        } else {
            gameState[x][y] = '-'
        }
    }

    seeIfCanPlayLine(gameState, x, y, currentType, setNewX, setNewY) {
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
            if (currentPos === '-' || currentPos === 'p') {
                changesCount = 0
                break;
            }
        } while (currentPos || currentPos !== '-' || currentPos !== 'p')

        return changesCount > 0
    }
}

module.exports = LogicGameManager
