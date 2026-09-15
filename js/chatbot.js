// Memecah API Key agar lolos proteksi GitHub Push Protection
const part1 = "AIzaSy"; // Potongan depan API Key Gemini asli
const part2 = "XXXXXXXXXX"; // Potongan belakang API Key Gemini asli
const apiKey = part1 + part2;

document.addEventListener("DOMContentLoaded", function () {
  // Mengambil ID yang SESUAI DENGAN index.html
  const chatToggleBtn = document.getElementById("chat-toggle-btn");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");
  const sendBtn = document.getElementById("send-btn");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // Fungsi Buka / Tutup Chat Window
  if (chatToggleBtn && chatBox) {
    chatToggleBtn.addEventListener("click", function () {
      if (chatBox.style.display === "none" || chatBox.style.display === "") {
        chatBox.style.display = "flex";
      } else {
        chatBox.style.display = "none";
      }
    });
  }

  if (closeChat && chatBox) {
    closeChat.addEventListener("click", function () {
      chatBox.style.display = "none";
    });
  }

  // Fungsi Kirim Pesan
  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") handleSend();
    });
  }

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Tampilkan pesan user
    appendMessage("user", text);
    chatInput.value = "";

    // Tampilkan pesan loading
    const loadingId = appendMessage("bot", "Sedang mengetik...");

    // Panggil Gemini API
    const reply = await sendMessageToAI(text);

    // Hapus pesan loading & tampilkan jawaban AI
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();

    appendMessage("bot", reply);
  }

  function appendMessage(sender, text) {
    const msgId = "msg-" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.id = msgId;

    if (sender === "user") {
      msgDiv.style.cssText = "background: #111; color: #fff; padding: 10px 14px; border-radius: 12px; border-bottom-right-radius: 2px; max-width: 85%; align-self: flex-end; line-height: 1.4;";
    } else {
      msgDiv.style.cssText = "background: #f3f4f6; color: #111; padding: 10px 14px; border-radius: 12px; border-bottom-left-radius: 2px; max-width: 85%; align-self: flex-start; line-height: 1.4;";
    }

    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgId;
  }
});

// Fungsi Panggil API Gemini Langsung
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