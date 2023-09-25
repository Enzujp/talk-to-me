const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages')

const socket = io(); // we have access to this because of the added script tag in index.html



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

  // Emit message to server
  socket.emit('chatMessage', msg)

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output Message to DOM 

function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message') // add message class to div
  // Append InnerHTML
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>`; 
  document.querySelector('.chat-messages').appendChild(div);
}