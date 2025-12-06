// Mengimpor SDK Google Gemini
const { GoogleGenAI } = require("@google/genai");

// Inisialisasi Gemini. Kunci API diambil dari Environment Variable (disimpan di Vercel)
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Fungsi utama yang dipanggil oleh Vercel
export default async function handler(req, res) {
  
  // Hanya terima metode POST dari APK
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // --- 1. Menerima Data dari APK ---
  // Pastikan header content-type di APK diset ke application/json
  const { query, image_base64 } = req.body;

  if (!query || !image_base64) {
    return res.status(400).json({ error: 'Query dan image_base64 wajib diisi.' });
  }

  try {
    
    // --- 2. Membuat Payload Gambar untuk Gemini ---
    const imagePart = {
      inlineData: {
        data: image_base64,
        // Kita asumsikan gambar dari Android dikompres ke JPEG
        mimeType: "image/jpeg", 
      },
    };

    // --- 3. Memanggil Gemini Pro Vision API ---
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Model multimodal yang ringan dan cepat
      contents: [
        { role: "user", parts: [imagePart, { text: query }] } 
      ],
      config: {
        temperature: 0.2, 
      }
    });

    // --- 4. Mengirim Respons Balik ke APK ---
    const geminiText = response.text; 
    
    // Mengembalikan respons dalam bentuk JSON yang mudah diurai APK
    res.status(200).json({ success: true, text: geminiText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      success: false, 
      text: "Terjadi error pada server proxy saat menghubungi Gemini API. Cek log Vercel Anda." 
    });
  }
}
