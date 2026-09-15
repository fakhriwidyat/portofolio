export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Hanya menerima POST request' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Diambil dari environment Vercel
  
  // Konteks agar AI tahu dia adalah asistenmu
  const systemInstruction = "Kamu adalah Fakhri Assistant, AI ramah di web portofolio Fakhri Bagas Widyatmoko (siswa SMK Telkom Purwokerto). Jawab pertanyaan singkat, padat, dan profesional tentang skill (JS, React, Node.js), proyek (Trashure, Stemla, SMK Redesign), atau kontak Fakhri (bagasf534@gmail.com).";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghubungi AI' });
  }
}