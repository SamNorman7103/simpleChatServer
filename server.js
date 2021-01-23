const net = require("net");
const fs = require("fs");


let sockets = [];
let socketCount = 0;
const file = fs.createWriteStream("./server-log.txt");

let server = net.createServer();

server.on("connection", (socket) => {
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  socket.id = socketCount;
  socketCount += 1;
  sockets.push(socket);
  console.log(`New user ${socket.name} has connected`);
  writeToLog(`New user ${socket.name} has connected`)
  console.log("");
  hello(socket);
  socket.on("data", (data) => {
    sendMessage(socket, data);
  });

  socket.on("end", () => {
    leftChat(socket);
    sockets = sockets.filter((s) => s.id !== socket.id);
  });
});

function writeToLog(data) {
    let d = new Date();
    let timestamp = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}:${d.getTime()}`
    file.write(timestamp + ': ' + data + '\n');
  ;
}

function hello(user) {
  sockets.forEach((socket) => {
    if (socket.id !== user.id) {
      socket.write(`${user.name} has joined the chat`);
    }
    
  });
}

function sendMessage(user, data) {
  writeToLog(`${user.name}: ${data}`)
  sockets.forEach((socket) => {
    if (socket.id !== user.id) {
      socket.write(`${user.name}: ${data}`);
    }
  });
}

function leftChat(user) {
  writeToLog(`${user.name} has left the chat`)
  sockets = sockets.filter((socket) => socket.id !== user.id);
  sockets.forEach((socket) => {
    socket.write(`${user.name} has left the chat`);
  });
}

server.listen(3000);
console.log("Listening on port 3000");
