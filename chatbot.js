const chatBtn = document.getElementById('chat-btn');
console.log('chatBtn:', chatBtn);
const chatWindow = document.getElementById('chat-window');
console.log('chatWindow:', chatWindow);
const chatInput = document.getElementById('chat-input');
console.log('chatInput:', chatInput);
const chatBody = document.getElementById('chat-body');
console.log('chatBody:', chatBody);
const closeBtn = document.getElementById('close-btn');
console.log('closeBtn:', closeBtn);
const zunoGreeting = document.getElementById('zuno-greeting');
console.log('zunoGreeting:', zunoGreeting);

// Show Zuno greeting bubble after 1.5s, hide after 5s or on chat open
let zunoGreetingTimeout;

function showGreetingWords() {
  const words = document.querySelectorAll('.zuno-greet-text .word-animation');
  words.forEach((word, index) => {
    setTimeout(() => {
      word.style.opacity = '1';
      word.style.transform = 'translateY(0)';
    }, index * 150); // Adjust delay as needed (e.g., 100ms per word for faster animation)
  });
}

setTimeout(() => {
  zunoGreeting.style.display = 'block'; // Ensure it's block so 'show' class can transition effectively
  setTimeout(() => {
    zunoGreeting.classList.add('show');
    showGreetingWords(); // Call function to reveal words sequentially
    zunoGreetingTimeout = setTimeout(() => {
      zunoGreeting.classList.remove('show');
      setTimeout(() => {
        zunoGreeting.style.display = 'none';
      }, 500);
    }, 5000); // Hide after 5 seconds
  }, 100);
}, 1000);

// Show the chat window when user clicks icon
chatBtn.onclick = () => {
  console.log('Chat button clicked!');
  chatWindow.style.display = 'flex';
  chatBtn.style.display = 'none';
  // Hide the greeting popup immediately if open
  zunoGreeting.classList.remove('show');
  zunoGreeting.style.display = 'none';
  if (zunoGreetingTimeout) clearTimeout(zunoGreetingTimeout);
  chatBody.scrollTop = chatBody.scrollHeight;
};

// Close chat window
closeBtn.onclick = () => {
  chatWindow.style.display = 'none';
  chatBtn.style.display = 'block';
};

// Handle user input
chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && chatInput.value.trim() !== '') {
    const msg = chatInput.value.trim();
    chatInput.value = '';
    chatBody.innerHTML += `<div class=\"message user\"><b>You:</b> ${msg}</div>`;
    chatBody.innerHTML += `<div class=\"message ai\" id=\"loading\">AI is typing...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const res = await fetch('http://localhost:5500/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();
      document.getElementById('loading').remove();
      chatBody.innerHTML += `<div class=\"message ai\"><b>AI:</b> ${data.response}</div>`;
    } catch (error) {
      document.getElementById('loading').remove();
      chatBody.innerHTML += `<div class=\"message ai\"><b>AI:</b> Sorry, I couldn't connect to the server.</div>`;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }
});
