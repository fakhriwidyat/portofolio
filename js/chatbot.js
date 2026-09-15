// Elemen UI
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatBox = document.getElementById('chat-box');
const closeChatBtn = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

// Buka / Tutup Chat Window
chatToggleBtn.addEventListener('click', () => {
  const isHidden = chatBox.style.display === 'none' || chatBox.style.display === '';
  chatBox.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) chatInput.focus();
});

closeChatBtn.addEventListener('click', () => {
  chatBox.style.display = 'none';
});

// Fungsi menampilkan gelembung pesan
function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  
  if (sender === 'user') {
    msgDiv.style.background = '#111';
    msgDiv.style.color = '#fff';
    msgDiv.style.alignSelf = 'flex-end';
    msgDiv.style.borderBottomRightRadius = '2px';
  } else {
    msgDiv.style.background = '#f3f4f6';
    msgDiv.style.color = '#111';
    msgDiv.style.alignSelf = 'flex-start';
    msgDiv.style.borderBottomLeftRadius = '2px';
  }

  msgDiv.style.padding = '10px 14px';
  msgDiv.style.borderRadius = '12px';
  msgDiv.style.maxWidth = '85%';
  msgDiv.style.lineHeight = '1.4';
  msgDiv.textContent = text;
  
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fungsi Mengirim Pesan ke Backend API (/api/chat)
async function sendMessage() {
  const messageText = chatInput.value.trim();
  if (!messageText) return;

  // 1. Tampilkan pesan user di layar
  appendMessage(messageText, 'user');
  chatInput.value = '';

  // 2. Tampilkan indikator loading
  const loadingId = 'loading-' + Date.now();
  const loadingDiv = document.createElement('div');
  loadingDiv.id = loadingId;
  loadingDiv.style.fontSize = '12px';
  loadingDiv.style.color = '#6b7280';
  loadingDiv.style.padding = '4px 8px';
  loadingDiv.textContent = 'Mengetik...';
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // 3. Panggil Serverless API /api/chat.js
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText })
    });

    const data = await response.json();
    document.getElementById(loadingId).remove();

    if (response.ok && data.reply) {
      appendMessage(data.reply, 'bot');
    } else {
      // Menampilkan pesan error spesifik dari backend api/chat.js
      appendMessage(data.error || 'Maaf, ada kendala saat menghubungkan ke AI.', 'bot');
    }
  } catch (error) {
    if (document.getElementById(loadingId)) {
      document.getElementById(loadingId).remove();
    }
    appendMessage('Gagal terhubung ke server.', 'bot');
  }
}

// Event Listener Tombol & Enter
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});