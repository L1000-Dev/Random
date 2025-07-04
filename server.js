const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let channels = { general: [], random: [], help: [] };

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Join the default channel (general)
    socket.emit('joinChannel', 'general');

    // Join the selected channel
    socket.on('joinChannel', (channel) => {
        socket.join(channel);
        console.log(`${socket.id} joined ${channel}`);
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
        const { channel, message } = data;
        const user = socket.id; // You can replace this with a username
        io.to(channel).emit('newMessage', { user, message });
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
