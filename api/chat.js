export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya POST request yang diizinkan' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key Vercel belum terbaca!' });
    }

    const { message } = req.body;

    // Trik aman: Gabungkan instruksi sifat AI langsung ke dalam pesan
    // karena gemini-pro (versi 1.0) membaca instruksi dengan cara berbeda.
    const systemPrompt = "Kamu adalah Fakhri Assistant, AI ramah di web portofolio Fakhri Bagas Widyatmoko (siswa SMK Telkom Purwokerto). Jawab dengan ramah, santai, singkat, dan padat.\n\nUser bilang: " + message;

    // Menggunakan gemini-pro murni yang paling stabil
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      // Perhatikan teks ini, kalau errornya ganti jadi ini, berarti kode sukses update!
      return res.status(500).json({ error: data.error?.message || 'Gagal memproses balasan dari Gemini Pro.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}