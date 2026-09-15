export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY belum dipasang di Environment Variables Vercel!' });
    }

    const { message } = req.body;

    // TRIK ANTI-ERROR: Memisahkan nama model secara manual dengan tanda setrip statis
    const modelName = 'gemini' + '-' + '1.5' + '-' + 'flash';
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        systemInstruction: { 
          parts: [{ text: "Kamu adalah Fakhri Assistant, AI ramah di web portofolio Fakhri Bagas Widyatmoko (siswa SMK Telkom Purwokerto). Jawab dengan ramah, santai, singkat, dan padat." }] 
        }
      })
    });

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: data.error?.message || 'Gagal memproses balasan dari Gemini.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}