class MessagesManager {

    socket
    connection
    roomName

    constructor(socket, connection, roomName){
        this.socket = socket
        this.connection = connection
        this.roomName = roomName

        setListeners()

    }

    setListeners() {
        
    }

}

module.exports = MessagesManager