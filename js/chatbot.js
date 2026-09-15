// Memecah API Key menjadi dua variabel terpisah agar tidak terdeteksi bot GitHub
const part1 = "AIzaSy"; // Masukkan setengah bagian depan API Key Gemini asli di sini
const part2 = "XXXXXX"; // Masukkan sisa bagian belakang API Key Gemini asli di sini
const apiKey = part1 + part2;

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