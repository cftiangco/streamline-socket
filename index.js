const io = require('socket.io')(8900, {
    cors:{
        origin:"http://localhost:3000"
    }
});

let clients = [];

const addClient = (clientId,socketId) => {
    if(clientId) {
        !clients.some((client) => client.clientId === clientId) &&
        clients.push({clientId,socketId});
    }
}

const removeUser = (socketId) => {
    clients = clients.filter((client) => client.socketId !== socketId);
}

const getClient = (clientId) => {
    return clients.find((client) => client.clientId === clientId)
}

io.on('connection',(socket) => {
    console.log('user connected');

    socket.on("addClients", (clientId) => {
        addClient(clientId,socket.id);
        io.emit("getClients",clients);
    });

    //send message
    socket.on("sendMessage",({senderId,recieverId,text,body})=> {
        console.log('body:',body)
        let client = getClient(recieverId);
        if(client) {
            io.to(client.socketId).emit("getMessage", {
                senderId,
                text,
                body
            });
        }
        
    })

    socket.on('disconnect', () => {
        console.log("disconnected",socket.id);
        removeUser(socket.id);
        io.emit("getClients",clients);
    });
});

