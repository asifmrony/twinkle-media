import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

let onlineUsers = [];

//Add new users to Socket server
const addNewUser = (username, socketId) => {
    !onlineUsers.some(user => user.username === username) && onlineUsers.push({username, socketId})
}

//Remove user
const removeUser = (socketId) => {
   onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

//Get a new socket user
const getUser = (username) => {
    return onlineUsers.find(user => user.username === username)
}

io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        addNewUser(username, socket.id)
    })
    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
});

io.listen(5000);