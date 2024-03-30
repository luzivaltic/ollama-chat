const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {  
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', (message) => {
      console.log('Received message:', message);
      io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
