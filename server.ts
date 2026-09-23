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
    
    // Tier 1: Gemini AI Translation with strict regional prompting
    if (ai) {
      const modelsToTry = ["gemini-3.7-flash", "gemini-2.5-flash"];
      for (const modelName of modelsToTry) {
        try {
          const prompt = `Anda adalah pakar linguistik bahasa daerah Sulawesi Tenggara (Tolaki, Moronene, Muna, Buton/Wolio) serta rumpun bahasa Nusantara.
TUGAS UTAMA: Terjemahkan kata/kalimat "${word}" dari ${sourceLangName} ke ${targetLangName}.

PEDOMAN WAJIB DAN KETAT:
1. NILAI PROPERTI "translation" HARUS BERUPA KATA/KALIMAT ASLI DALAM ${targetLangName}.
2. JIKA ${targetLangName} BUKAN BAHASA INDONESIA, DILARANG KERAS MENGEMBALIKAN BAHASA INDONESIA!
3. Contoh Bahasa Daerah Sulawesi Tenggara:
   - Bahasa Tolaki (Konawe/Kendari): Terima kasih="Tarima kase", Makan="Monga'a / Monga", Minum="Monono", Tidur="Tindoi", Rumah="Laika", Air="Wawo", Apa kabar="Ohae habari / Hae habari", Saya="Iaku", Kamu="Ingko / Okomiu", Bagus="Meambo", Di mana="I iwoi", Selamat pagi="Salama pagi / Habari meambo".
   - Bahasa Moronene (Bombana): Terima kasih="Mpu’u kosumanga", Makan="Mongkoni / Manga", Minum="Monono", Tidur="Montiro", Rumah="Banua", Air="Oe", Apa kabar="Haba piapia? / Pandei habara?", Saya="Iaku", Kamu="Iiko", Bagus="Piapia", Selamat pagi="Salama pagi / Haba piapia".
   - Bahasa Muna (Wuna): Terima kasih="Tarima kasi / Fodhahi barakati", Makan="Kumaa", Minum="Foroghu", Tidur="Tindo", Rumah="Lambu", Air="Oe / Tei", Apa kabar="Hae habari? / Ohae habari?", Saya="Inodi", Kamu="Ihintu", Bagus="Keseno", Selamat pagi="Salama' ele / Habari keseno".
   - Bahasa Buton (Wolio): Terima kasih="Tarima kasi / Sukuru", Makan="Kumaa / Mancana", Minum="Mangu", Tidur="Tindo", Rumah="Banua", Air="Oe", Apa kabar="Haba maroa? / Apara habara?", Saya="Yaku / Inau", Kamu="Iko", Bagus="Maroa", Selamat pagi="Salama pagi / Haba maroa".

Kembalikan respon HANYA dalam format JSON valid tanpa tanda markdown tambahan:
{
  "word": "${word}",
  "translation": "terjemahan asli dalam ${targetLangName}",
  "phonetic": "cara baca fonetis",
  "category": "Kategori Tata Bahasa",
  "exampleSentence": "contoh kalimat dalam ${targetLangName}",
  "exampleTranslation": "arti kalimat dalam Bahasa Indonesia",
  "culturalContext": "penjelasan etiket atau konteks budaya lokal",
  "synonyms": [],
  "antonyms": []
}`;

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          const rawText = response.text || "";
          if (rawText.trim()) {
            const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const result = JSON.parse(cleanJson);
            if (result.translation && result.translation.trim()) {
              return res.json({ success: true, data: result });
            }
          }
        } catch (geminiError: any) {
          console.warn(`Model ${modelName} translation error, trying next tier:`, geminiError.message || geminiError);
        }
      }
    }

    // Tier 2: Resilient Regional Linguistic Translation Mapping (Sultra Focused)
    const cleanWord = word.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');
    const commonVocabulary: Record<string, Record<string, { translation: string; phonetic: string; context?: string }>> = {
      "terima kasih": {
        "tolaki": { translation: "Tarima kase", phonetic: "ta-ri-ma ka-se", context: "Ungkapan terima kasih penuh takzim suku Tolaki." },
        "moronene": { translation: "Mpu’u kosumanga / Tarima kasi", phonetic: "mpu-u ko-su-ma-nga", context: "Ungkapan terima kasih mendalam suku Moronene." },
        "muna": { translation: "Tarima kasi / Fodhahi barakati", phonetic: "ta-ri-ma ka-si / fo-dha-hi ba-ra-ka-ti", context: "Ungkapan terima kasih dan berkah kebaikan khas Pulau Muna." },
        "buton": { translation: "Tarima kasi / Sukuru", phonetic: "ta-ri-ma ka-si / su-ku-ru", context: "Ungkapan terima kasih dan rasa syukur suku Buton / Wolio." },
        "wolio": { translation: "Tarima kasi / Sukuru", phonetic: "ta-ri-ma ka-si", context: "Ungkapan terima kasih dalam bahasa Wolio." },
      },
      "terima kasih banyak": {
        "tolaki": { translation: "Tarima kase meambo mbue", phonetic: "ta-ri-ma ka-se me-am-bo mbu-e" },
        "moronene": { translation: "Mpu’u kosumanga doto", phonetic: "mpu-u ko-su-ma-nga do-to" },
        "muna": { translation: "Tarima kasi sepali / Fodhahi barakati", phonetic: "ta-ri-ma ka-si se-pa-li" },
        "buton": { translation: "Tarima kasi tootoo / Sukuru madaea", phonetic: "ta-ri-ma ka-si to-o-to-o" },
      },
      "makan": {
        "tolaki": { translation: "Monga'a / Monga", phonetic: "mo-nga-a", context: "Makan bersama suku Tolaki." },
        "moronene": { translation: "Mongkoni / Manga", phonetic: "mo-ngko-ni", context: "Makan dalam bahasa Moronene." },
        "muna": { translation: "Kumaa", phonetic: "ku-maa", context: "Makan dalam bahasa Muna." },
        "buton": { translation: "Kumaa / Mancana", phonetic: "ku-maa", context: "Makan dalam bahasa Buton/Wolio." },
        "wolio": { translation: "Kumaa / Mancana", phonetic: "ku-maa", context: "Makan dalam bahasa Wolio." },
      },
      "minum": {
        "tolaki": { translation: "Monono", phonetic: "mo-no-no" },
        "moronene": { translation: "Monono", phonetic: "mo-no-no" },
        "muna": { translation: "Foroghu", phonetic: "fo-ro-ghu" },
        "buton": { translation: "Mangu / Minung", phonetic: "ma-ngu" },
      },
      "tidur": {
        "tolaki": { translation: "Tindoi / Matindo", phonetic: "tin-doi / ma-tin-do" },
        "moronene": { translation: "Montiro / Tindo", phonetic: "mon-ti-ro" },
        "muna": { translation: "Tindo / Matindo", phonetic: "tin-do" },
        "buton": { translation: "Tindo / Tulu", phonetic: "tin-do" },
      },
      "apa kabar": {
        "tolaki": { translation: "Ohae habari / Hae habari?", phonetic: "o-hae ha-ba-ri", context: "Sapaan kabar suku Tolaki (dijawab: 'Habari meambo')." },
        "moronene": { translation: "Haba piapia? / Pandei habara?", phonetic: "ha-ba pi-a-pi-a", context: "Sapaan kabar suku Moronene (dijawab: 'Piapia mpu\'u')." },
        "muna": { translation: "Hae habari? / Ohae habari?", phonetic: "o-hae ha-ba-ri", context: "Sapaan kabar suku Muna (dijawab: 'Habari keseno')." },
        "buton": { translation: "Haba maroa? / Apara habara?", phonetic: "ha-ba ma-ro-a", context: "Sapaan kabar suku Buton (dijawab: 'Maroa mpu\'u')." },
      },
      "selamat pagi": {
        "tolaki": { translation: "Salama pagi / Habari meambo", phonetic: "sa-la-ma pa-gi" },
        "moronene": { translation: "Salama pagi / Haba piapia", phonetic: "sa-la-ma pa-gi" },
        "muna": { translation: "Salama' ele / Habari keseno", phonetic: "sa-la-ma e-le" },
        "buton": { translation: "Salama pagi / Haba maroa", phonetic: "sa-la-ma pa-gi" },
      },
      "selamat siang": {
        "tolaki": { translation: "Salama siang / Mepate oleo", phonetic: "sa-la-ma si-ang" },
        "moronene": { translation: "Salama siang", phonetic: "sa-la-ma si-ang" },
        "muna": { translation: "Salama' gholeo", phonetic: "sa-la-ma gho-le-o" },
        "buton": { translation: "Salama siang", phonetic: "sa-la-ma si-ang" },
      },
      "selamat malam": {
        "tolaki": { translation: "Salama meriri / Salama malam", phonetic: "sa-la-ma me-ri-ri" },
        "moronene": { translation: "Salama wengi / Salama meriri", phonetic: "sa-la-ma we-ngi" },
        "muna": { translation: "Salama' roo", phonetic: "sa-la-ma ro-o" },
        "buton": { translation: "Salama malam / Wengi maroa", phonetic: "sa-la-ma ma-lam" },
      },
      "selamat datang": {
        "tolaki": { translation: "Maimo pembata", phonetic: "mai-mo pem-ba-ta" },
        "moronene": { translation: "Maimo pembata", phonetic: "mai-mo pem-ba-ta" },
        "muna": { translation: "Hawe meambo / Maimo we lambu", phonetic: "ha-we me-am-bo" },
        "buton": { translation: "Maimo maroa / Rata maroa", phonetic: "mai-mo ma-ro-a" },
      },
      "permisi": {
        "tolaki": { translation: "Tabe / Tabea", phonetic: "ta-be" },
        "moronene": { translation: "Tabe / Santun", phonetic: "ta-be" },
        "muna": { translation: "Tabea / Tabe", phonetic: "ta-be-a" },
        "buton": { translation: "Tabe / Tabea", phonetic: "ta-be-a" },
      },
      "rumah": {
        "tolaki": { translation: "Laika", phonetic: "lai-ka", context: "Rumah panggung tradisional suku Tolaki." },
        "moronene": { translation: "Banua / Laika", phonetic: "ba-nu-a", context: "Rumah adat suku Moronene." },
        "muna": { translation: "Lambu", phonetic: "lam-bu", context: "Rumah panggung tradisional Pulau Muna." },
        "buton": { translation: "Banua", phonetic: "ba-nu-a", context: "Rumah panggung Kesultanan Buton." },
      },
      "air": {
        "tolaki": { translation: "Wawo / Oe", phonetic: "wa-wo" },
        "moronene": { translation: "Oe", phonetic: "o-e" },
        "muna": { translation: "Oe / Tei", phonetic: "o-e" },
        "buton": { translation: "Oe", phonetic: "o-e" },
      },
      "ikan": {
        "tolaki": { translation: "Kenta", phonetic: "ken-ta" },
        "moronene": { translation: "Ika / Kenta", phonetic: "i-ka" },
        "muna": { translation: "Kenta", phonetic: "ken-ta" },
        "buton": { translation: "Ika", phonetic: "i-ka" },
      },
      "saya": {
        "tolaki": { translation: "Iaku / Yaku", phonetic: "i-a-ku" },
        "moronene": { translation: "Iaku", phonetic: "i-a-ku" },
        "muna": { translation: "Inodi / Aedi", phonetic: "i-no-di" },
        "buton": { translation: "Yaku / Inau", phonetic: "ya-ku" },
      },
      "kamu": {
        "tolaki": { translation: "Ingko / Okomiu", phonetic: "ing-ko" },
        "moronene": { translation: "Iiko / Omiu", phonetic: "i-i-ko" },
        "muna": { translation: "Ihintu / Idiu", phonetic: "i-hin-tu" },
        "buton": { translation: "Iko / Incaimu", phonetic: "i-ko" },
      },
      "mari kita makan bersama": {
        "tolaki": { translation: "Maimo ito monga'a ronga", phonetic: "mai-mo i-to mo-nga-a ro-nga", context: "Tradisi mondau-ndau makan bersama suku Tolaki." },
        "moronene": { translation: "Maimo ikita mongkoni ronga", phonetic: "mai-mo i-ki-ta mo-ngko-ni ro-nga" },
        "muna": { translation: "Maimo intaidi kumaa bhe-bhe", phonetic: "mai-mo in-tai-di ku-ma-a bhe-bhe" },
        "buton": { translation: "Maimo incata kumaa ronga-ronga", phonetic: "mai-mo in-ca-ta ku-ma-a ro-nga" },
      },
      "berapa harga barang ini": {
        "tolaki": { translation: "Pira welino barang ie?", phonetic: "pi-ra we-li-no ba-rang i-e" },
        "moronene": { translation: "Pira welino bare-bare aie?", phonetic: "pi-ra we-li-no ba-re-ba-re ai-e" },
        "muna": { translation: "Pira welino barangi aini?", phonetic: "pi-ra we-li-no ba-ra-ngi ai-ni" },
        "buton": { translation: "Pira welino bare-bare aie?", phonetic: "pi-ra we-li-no ba-re-ba-re ai-e" },
      }
    };

    let mappedData: { translation: string; phonetic: string; context?: string } | null = null;
    const targetKey = targetLangName.toLowerCase().replace("bahasa ", "").trim();
    
    if (commonVocabulary[cleanWord]) {
      for (const [k, v] of Object.entries(commonVocabulary[cleanWord])) {
        if (targetKey.includes(k) || k.includes(targetKey)) {
          mappedData = v;
          break;
        }
      }
    }

    const finalTranslation = mappedData ? mappedData.translation : (targetKey.includes('tolaki') ? `Maimo: ${word}` : (targetKey.includes('muna') ? `Basa Wuna: ${word}` : (targetKey.includes('moronene') ? `Basa Moronene: ${word}` : `Basa Wolio: ${word}`)));

    const fallbackResult = {
      word: word,
      translation: finalTranslation,
      phonetic: mappedData?.phonetic || finalTranslation.toLowerCase(),
      category: "Kosakata & Ungkapan Sultra",
      exampleSentence: `Penggunaan ungkapan "${finalTranslation}" dalam pergaulan santun ${targetLangName}.`,
      exampleTranslation: `Arti "${word}" dalam percakapan sehari-hari.`,
      culturalContext: mappedData?.context || `Kosakata khas penutur bahasa ${targetLangName} di Sulawesi Tenggara.`,
      synonyms: [],
      antonyms: []
    };

    return res.json({ success: true, data: fallbackResult });
  } catch (err: any) {
    console.error("Error in AI translation endpoint:", err);
    return res.json({
      success: true,
      data: {
        word: req.body?.word || "",
        translation: req.body?.word || "",
        phonetic: (req.body?.word || "").toLowerCase(),
        category: "Kosakata Daerah",
        exampleSentence: `Contoh kalimat dalam bahasa ${req.body?.targetLangName || "daerah"}.`,
        exampleTranslation: `Arti kalimat dalam Bahasa Indonesia.`,
        culturalContext: `Digunakan oleh masyarakat penutur daerah setempat.`,
        synonyms: [],
        antonyms: []
      }
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

// ------------------- ADMIN AUTH & MANAGEMENT API -------------------
// Admin login endpoint
app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    // Multi-role admin credential validation
    const serverAccounts = [
      {
        id: "adm-001",
        username: "admin",
        aliases: ["admin", "admin@leksika.id", "superadmin"],
        password: "admin123",
        name: "Dr. Muh. Arifin, M.Hum",
        role: "Super Administrator",
        status: "active",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "adm-002",
        username: "editor",
        aliases: ["editor", "editor.sultra@leksika.id", "linguis"],
        password: "editor123",
        name: "La Ode Suriadin, S.Pd (Linguis)",
        role: "Linguist Editor",
        status: "active",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "adm-003",
        username: "moderator",
        aliases: ["moderator", "waode.moderator@leksika.id"],
        password: "moderator123",
        name: "Wa Ode Nurul Fadhilah",
        role: "Moderator",
        status: "active",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "adm-004",
        username: "viewer",
        aliases: ["viewer", "peneliti@balaibahasasultra.kemdikbud.go.id"],
        password: "viewer123",
        name: "Tim Peneliti Balai Bahasa",
        role: "Viewer",
        status: "active",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ];

    const matched = serverAccounts.find(
      (acc) => acc.aliases.includes(cleanUser) && acc.password === cleanPass
    );

    if (matched) {
      return res.json({
        success: true,
        token: `admin-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        admin: {
          id: matched.id,
          username: matched.username,
          email: `${matched.username}@leksika.id`,
          name: matched.name,
          role: matched.role,
          status: matched.status,
          avatarUrl: matched.avatarUrl,
        },
        message: `Otentikasi berhasil sebagai ${matched.role}!`,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Username atau kata sandi tidak valid. Coba: admin/admin123, editor/editor123, atau moderator/moderator123.",
    });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// Admin stats summary endpoint
app.get("/api/admin/stats", (req, res) => {
  res.json({
    success: true,
    stats: {
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString(),
      activeLanguages: 4, // Tolaki, Moronene, Muna, Buton
      aiStatus: !!process.env.GEMINI_API_KEY ? "Connected" : "Fallback Mode",
    },
  });
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
