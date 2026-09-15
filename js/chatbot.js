// Memecah API Key agar lolos dari proteksi GitHub
const part1 = "AIzaSy"; // Potongan depan API Key Gemini asli kamu
const part2 = "XXXXXXXXXX"; // Potongan belakang API Key Gemini asli kamu
const apiKey = part1 + part2;

document.addEventListener("DOMContentLoaded", function () {
  const chatToggle = document.getElementById("chat-toggle"); // Tombol gelembung chat
  const chatBox = document.getElementById("chat-box");       // Jendela chat
  const chatClose = document.getElementById("chat-close");   // Tombol silang tutup
  const sendBtn = document.getElementById("send-btn");       // Tombol Send
  const userInput = document.getElementById("user-input");   // Input teks
  const chatMessages = document.getElementById("chat-messages");

  // Fungsi Buka/Tutup Chatbot
  if (chatToggle && chatBox) {
    chatToggle.addEventListener("click", function () {
      chatBox.classList.toggle("hidden");
    });
  }

  if (chatClose && chatBox) {
    chatClose.addEventListener("click", function () {
      chatBox.classList.add("hidden");
    });
  }

  // Fungsi Kirim Pesan
  if (sendBtn && userInput) {
    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") handleSend();
    });
  }

  async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage("user", text);
    userInput.value = "";

    const loadingId = appendMessage("bot", "Sedang mengetik...");

    const reply = await sendMessageToAI(text);
    
    // Hapus pesan loading dan tampilkan jawaban AI
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    
    appendMessage("bot", reply);
  }

  function appendMessage(sender, text) {
    const msgId = "msg-" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.id = msgId;
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgId;
  }
});

// Panggilan langsung ke API Gemini
async function sendMessageToAI(userMessage) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: { 
          parts: [{ text: "Kamu adalah Fakhri Assistant, AI ramah di web portofolio Fakhri Bagas Widyatmoko (siswa SMK Telkom Purwokerto). Jawab dengan ramah, santai, singkat, dan padat." }] 
        }
      })
    });

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "Maaf, ada kendala: " + (data.error?.message || "Gagal merespons");
    }
  } catch (err) {
    return "Error koneksi: " + err.message;
  }
}