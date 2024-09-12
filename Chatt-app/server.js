const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this if the client is hosted elsewhere
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (username) => {
    onlineUsers.push({ id: socket.id, username });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('message', (data) => {
    io.emit('message', data); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    io.emit('onlineUsers', onlineUsers);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
