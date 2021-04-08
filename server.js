const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
})
const RoomsManager = require("./RoomsManager")
const roomsManager = new RoomsManager(io)



server.listen(4000, ()=>{console.log("server iniciado 2")})