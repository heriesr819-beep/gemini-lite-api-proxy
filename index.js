import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = process.env.PORT || 8000;

// Izinkan akses dari mana saja (biar HP bisa masuk)
app.use(cors());
app.use(express.json());

// Setup Gemini
// Pastikan di Koyeb nanti kuncinya bernama GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.get('/', (req, res) => {
  res.send('Server Gemini Lite Aktif di Koyeb! Gas!');
});

// Ini jalur yang dipanggil Sketchware: /api/ask
app.post('/api/ask', async (req, res) => {
  try {
    // Ambil pesan dari Sketchware
    const prompt = req.body.prompt || req.body.message || "Halo";
    
    // Panggil Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Kirim balik ke HP
    res.json({ text: text });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server nyala di port ${port}`);
});
      
