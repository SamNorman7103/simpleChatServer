const net = require("net");

let sockets = [];
let socketCount = 0;

let server = net.createServer();

server.on("connection", (socket) => {
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  socket.id = socketCount;
  socketCount += 1;
  sockets.push(socket);
  console.log(`New user ${socket.name} has connected`);
  console.log("");

  socket.on("data", (data) => {
    sendMessage(socket, data);
  });

  socket.on("end", () => {
    leftChat(socket);
    sockets = sockets.filter((s) => (s.id !== socket.id));
  });
});

function sendMessage(user, data) {
  sockets.forEach((socket) => {
    if (socket.id !== user.id) {
      socket.write(`${user.name}: ${data}`);
    }
  });
}

function leftChat(user){
  sockets = sockets.filter(socket => socket.id !== user.id)
  sockets.forEach((socket) => {
    socket.write(`${user.name} has left the chat`)
  })
}

server.listen(3000);
console.log("Listening on port 3000");
