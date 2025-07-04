const socket = io();

// DOM Elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');
let currentChannel = 'general';

// Select Channel
function selectChannel(channel) {
    currentChannel = channel;
    document.getElementById('chat-header').textContent = `#${channel}`;
    messagesContainer.innerHTML = ''; // Clear previous messages

    // Emit an event to join the selected channel
    socket.emit('joinChannel', channel);
}

// Send Message
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== "") {
        // Emit the message to the server
        socket.emit('sendMessage', { channel: currentChannel, message: message });
        messageInput.value = ''; // Clear input
    }
});

// Listen for incoming messages
socket.on('newMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${data.user}: ${data.message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
});
