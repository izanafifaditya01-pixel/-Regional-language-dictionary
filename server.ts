import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ------------------- API ROUTES -------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Kamus Bahasa Nusantara" });
});

// AI Translation endpoint
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { word, sourceLangName, targetLangName } = req.body;

    if (!word || !sourceLangName || !targetLangName) {
      return res.status(400).json({ error: "Missing word, sourceLangName, or targetLangName" });
    }

    const ai = getGeminiClient();
    
    // If Gemini client is available, generate translation with Gemini 3.7 Flash
    if (ai) {
      try {
        const prompt = `Anda adalah pakar bahasa daerah Indonesia dan linguis terkemuka. Terjemahkan kata atau kalimat "${word}" dari ${sourceLangName} ke ${targetLangName}.
Kembalikan respon DALAM FORMAT JSON murni tanpa markdown formatting dengan struktur:
{
  "word": "${word}",
  "translation": "kata atau frasa terjemahan dalam ${targetLangName}",
  "phonetic": "cara membaca / pelafalan fonetis yang mudah dipahami (contoh: 'man-reh')",
  "category": "kategori kata (contoh: 'Kata Kerja', 'Kata Benda', 'Salam', 'Percakapan', 'Frasa')",
  "exampleSentence": "contoh kalimat penggunaan dalam ${targetLangName}",
  "exampleTranslation": "terjemahan contoh kalimat tersebut dalam Bahasa Indonesia",
  "culturalContext": "penjelasan etiket lokal atau wawasan budaya penggunaan kata ini",
  "synonyms": ["sinonim1", "sinonim2"],
  "antonyms": ["antonim1"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                translation: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                category: { type: Type.STRING },
                exampleSentence: { type: Type.STRING },
                exampleTranslation: { type: Type.STRING },
                culturalContext: { type: Type.STRING },
                synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["word", "translation", "phonetic", "category", "exampleSentence", "exampleTranslation"],
            },
          },
        });

        const rawText = response.text || "";
        if (rawText.trim()) {
          // Clean JSON string in case of backticks
          const cleanJson = rawText.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();
          const result = JSON.parse(cleanJson);
          return res.json({ success: true, data: result });
        }
      } catch (geminiError: any) {
        console.warn("Gemini 3.7 Flash translation failed, attempting text fallback:", geminiError);
      }
    }

    // Heuristic Smart Fallback if API key is not ready or network fails
    const fallbackResult = {
      word: word,
      translation: `${word} (${targetLangName})`,
      phonetic: word.toLowerCase(),
      category: "Kosakata Daerah",
      exampleSentence: `Contoh penggunaan kata "${word}" dalam konteks percakapan ${targetLangName}.`,
      exampleTranslation: `Terjemahan contoh kalimat "${word}" dalam Bahasa Indonesia.`,
      culturalContext: `Kata ini umum digunakan dalam interaksi sehari-hari masyarakat penutur ${targetLangName}.`,
      synonyms: [],
      antonyms: []
    };

    return res.json({ success: true, data: fallbackResult, note: "Fallback translation generated" });
  } catch (err: any) {
    console.error("Error in AI translation:", err);
    return res.status(500).json({
      error: "Gagal menerjemahkan dengan AI",
      details: err.message,
    });
  }
});

// AI Language Tutor Chatbot endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, selectedLanguage } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        text: `Halo! Saya Tutor Leksika AI untuk ${selectedLanguage || "Bahasa Daerah Nusantara"}. Apa kosakata, tata bahasa, atau ungkapan daerah yang ingin Anda tanyakan hari ini?`,
      });
    }

    const lastMessage = messages[messages.length - 1]?.text || "";

    const systemInstruction = `Anda adalah "Tutor Leksika AI", tutor pembelajaran dan pakar bahasa daerah di Nusantara (seperti Bugis, Jawa, Sunda, Bali, Makassar, Minang, Aceh, Batak, Banjar, Madura, Dayak, Toraja, Gorontalo, dll.).
Tugas Anda:
1. Menjawab pertanyaan seputar tata bahasa, kosakata, etiket kesantunan, serta ragam dialek daerah di Indonesia.
2. Memberikan penjelasan ramah, edukatif, dan menyertakan contoh kalimat beserta terjemahan Bahasa Indonesia.
3. Jawab dalam Bahasa Indonesia yang hangat, menyenangkan, dan bersemangat melestarikan budaya Nusantara.
4. Jika disuruh menerjemahkan kalimat kompleks, berikan analisis per kata secara jelas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Bahasa daerah yang sedang dipelajari pengguna: ${selectedLanguage || "Umum"}\nPertanyaan pengguna: ${lastMessage}`,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return res.json({
      success: true,
      text: response.text || "Mohon maaf, AI Tutor sedang berpikir. Silakan coba lagi.",
    });
  } catch (err: any) {
    console.error("Error in AI Chat:", err);
    return res.json({
      success: true,
      text: `Mohon maaf, terjadi kendala koneksi AI saat ini. Anda tetap bisa menanyakan arti kata, percakapan, atau etiket kesantunan bahasa daerah. Silakan coba lagi sebentar lagi.`,
    });
  }
});

// AI Text-to-Speech (TTS) endpoint for regional language audio pronunciation
app.post("/api/ai/tts", async (req, res) => {
  try {
    const { text, langName } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "AI service unavailable" });
    }

    const promptText = `Ucapkan kata atau frasa berikut dalam bahasa daerah ${langName || "Nusantara"} dengan pelafalan asli yang jelas dan santun: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audio: base64Audio });
    }

    return res.status(500).json({ error: "No audio generated from AI model" });
  } catch (err: any) {
    console.error("Error in AI TTS:", err);
    return res.status(500).json({ error: "Failed to generate TTS audio", details: err.message });
  }
});

// ------------------- VITE SERVER INTEGRATION -------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kamus Bahasa Nusantara] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
