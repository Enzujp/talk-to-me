const formatMessage = require("../../utils/messages");
const { getCurrentUser } = require("../../utils/users");


const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages')

// Get query params from search bar

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


const socket = io(); // we have access to this because of the added script tag in index.html

// Join chat room
socket.emit('joinRoom', {username, room})


// Get room and Users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

// Message from server
socket.on('message', message => {
  outputMessage(message);
  console.log(message);

  // Scroll down in chats
  chatMessages.scrollTop = chatMessages.scrollHeight;
})


// Submit Message

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // get msg value from form using the id name
  const msg = e.target.elements.msg.value

  // Listen for chat messages
  socket.emit('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  })

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output Message to DOM 

function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message') // add message class to div
  // Append InnerHTML
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`; 
  document.querySelector('.chat-messages').appendChild(div);
}

// Add roomname to DOM
function outputRoomName(room) {
  roomName.innerText = room;

}

// Add users to Dom 
function outputUsers(users) { // Turn array into string and output
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')} 
  `
} 