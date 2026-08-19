import React, { useState, useEffect } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Info,
  Clock,
  Send,
  Zap
} from 'lucide-react';
import { Language, WordEntry } from '../types';
import { LANGUAGES_DATA } from '../data/languagesData';
import { speakWord } from '../utils/audioSpeech';

interface TranslatorViewProps {
  sourceLang: Language;
  targetLang: Language;
  onSelectLanguage: (type: 'source' | 'target', lang: Language) => void;
  onSwapLanguages: () => void;
  bookmarks: string[];
  onToggleBookmark: (wordId: string) => void;
  onSelectWordDetail: (word: WordEntry) => void;
}

interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLangName: string;
  targetLangName: string;
  targetLangCode: string;
  phonetic?: string;
  timestamp: string;
}

const PRESET_PHRASES = [
  { label: '👋 Salam Pagi', text: 'Selamat pagi, bagaimana kabarmu hari ini?' },
  { label: '🙏 Terima Kasih', text: 'Terima kasih banyak atas bantuannya.' },
  { label: '🍽️ Mengajak Makan', text: 'Mari kita makan siang bersama.' },
  { label: '💰 Menanyakan Harga', text: 'Berapa harga barang ini?' },
  { label: '📍 Menanyakan Arah', text: 'Permisi, di mana jalan menuju pusat kota?' },
  { label: '🤝 Senang Bertemu', text: 'Saya sangat senang bisa berkunjung dan bertemu Anda.' },
];

export const TranslatorView: React.FC<TranslatorViewProps> = ({
  sourceLang,
  targetLang,
  onSelectLanguage,
  onSwapLanguages,
  bookmarks,
  onToggleBookmark,
  onSelectWordDetail,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<WordEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('leksika_translator_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('leksika_translator_history', JSON.stringify(history.slice(0, 10)));
    } catch {
      // ignore
    }
  }, [history]);

  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate || inputText).trim();
    if (!text) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: text,
          sourceLangName: sourceLang.name,
          targetLangName: targetLang.name,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menerjemahkan dengan AI');
      }

      const data = json.data;
      const newEntry: WordEntry = {
        id: `trans-${Date.now()}`,
        sourceLangId: sourceLang.id,
        targetLangId: targetLang.id,
        word: text,
        translation: data.translation,
        phonetic: data.phonetic || '-',
        category: data.category || 'Terjemahan Bebas',
        exampleSentence: data.exampleSentence || '',
        exampleTranslation: data.exampleTranslation || '',
        culturalContext: data.culturalContext || '',
        synonyms: data.synonyms || [],
        antonyms: data.antonyms || [],
      };

      setTranslationResult(newEntry);

      // Add to history
      const histItem: TranslationHistoryItem = {
        id: newEntry.id,
        sourceText: text,
        translatedText: data.translation,
        sourceLangName: sourceLang.name,
        targetLangName: targetLang.name,
        targetLangCode: targetLang.code,
        phonetic: data.phonetic,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory(prev => [histItem, ...prev.filter(h => h.sourceText !== text)].slice(0, 10));
    } catch (err: any) {
      setError(err.message || 'Terjadi kendala saat menerjemahkan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = (text: string, langCode: string, langName: string) => {
    setIsPlayingAudio(true);
    speakWord(text, langCode, () => {
      setIsPlayingAudio(false);
    }, langName);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-green-50 rounded-full opacity-60 pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold">
            <Languages className="w-4 h-4 text-green-700" />
            <span>Penerjemah Bahasa Daerah Nusantara</span>
          </div>
          <span className="text-xs text-green-800 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            Didukung Gemini AI
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Terjemahkan ke Bahasa Daerah Pilihanmu
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
          Ketik kata, frasa, atau kalimat lengkap dalam Bahasa Indonesia untuk diterjemahkan langsung ke bahasa daerah pilihan Anda dengan pelafalan fonetis dan wawasan budaya lokal.
        </p>
      </div>

      {/* Language Selector Bar & Swap */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Source Language Select */}
          <div className="w-full sm:flex-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
              Bahasa Asal
            </label>
            <select
              value={sourceLang.id}
              onChange={e => {
                const found = LANGUAGES_DATA.find(l => l.id === e.target.value);
                if (found) onSelectLanguage('source', found);
              }}
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-700/20 cursor-pointer"
            >
              {LANGUAGES_DATA.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.flagEmoji} {lang.name} ({lang.province})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={onSwapLanguages}
            className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs shrink-0 mt-2 sm:mt-5"
            title="Tukar Bahasa"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          {/* Target Language Select */}
          <div className="w-full sm:flex-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
              Bahasa Tujuan (Pilihan Anda)
            </label>
            <select
              value={targetLang.id}
              onChange={e => {
                const found = LANGUAGES_DATA.find(l => l.id === e.target.value);
                if (found) onSelectLanguage('target', found);
              }}
              className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-2xl text-sm font-bold text-green-900 outline-none focus:ring-2 focus:ring-green-700/20 cursor-pointer"
            >
              {LANGUAGES_DATA.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.flagEmoji} {lang.name} ({lang.province})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Preset Quick Suggestions */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Contoh Kalimat:
            </span>
            {PRESET_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(phrase.text);
                  handleTranslate(phrase.text);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation Input & Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Source Input Box */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-500">
              <span>Masukkan Teks ({sourceLang.name})</span>
              <span>{inputText.length}/300 Karakter</span>
            </div>

            <textarea
              id="translator-input-textarea"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  handleTranslate();
                }
              }}
              placeholder={`Ketik kata atau kalimat apa saja di sini untuk diterjemahkan ke ${targetLang.name}...`}
              maxLength={300}
              rows={5}
              className="w-full mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium outline-none resize-none focus:border-green-700/50"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setTranslationResult(null);
                  setError(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
              >
                Hapus Teks
              </button>
            )}

            <button
              onClick={() => handleTranslate()}
              disabled={isLoading || !inputText.trim()}
              className="ml-auto px-5 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-full flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Menerjemahkan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Terjemahkan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Output Box */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 relative">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-green-800 font-extrabold">
                <span className="text-sm">{targetLang.flagEmoji}</span>
                Hasil Terjemahan ({targetLang.name})
              </span>
              {translationResult && (
                <button
                  onClick={() => handleCopy(translationResult.translation)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer transition-colors"
                  title="Salin Hasil Terjemahan"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-700" />
                      <span className="text-green-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {error ? (
              <div className="p-4 mt-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
                {error}
              </div>
            ) : translationResult ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                      {translationResult.translation}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      Cara Membaca: <span className="text-green-800 font-bold">"{translationResult.phonetic}"</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(translationResult.translation, targetLang.code, targetLang.name)}
                    className={`p-3 rounded-2xl shadow-xs transition-all cursor-pointer shrink-0 ${
                      isPlayingAudio
                        ? 'bg-amber-400 text-slate-950 animate-bounce'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                    title="Dengarkan Suara Pelafalan"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Example sentence & Cultural insight */}
                {translationResult.exampleSentence && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                    <p className="font-bold text-slate-700">Contoh Kalimat Penggunaan:</p>
                    <p className="text-green-900 font-medium italic">"{translationResult.exampleSentence}"</p>
                    {translationResult.exampleTranslation && (
                      <p className="text-slate-500">{translationResult.exampleTranslation}</p>
                    )}
                  </div>
                )}

                {translationResult.culturalContext && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-slate-700">
                    <span className="font-bold text-amber-900">Wawasan Budaya & Kesantunan:</span> {translationResult.culturalContext}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Languages className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-medium">
                  Hasil terjemahan {targetLang.name} beserta pelafalan fonetis akan muncul di sini.
                </p>
              </div>
            )}
          </div>

          {translationResult && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => onToggleBookmark(translationResult.id)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                {bookmarks.includes(translationResult.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-green-700" />
                    <span>Tersimpan di Favorit</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Simpan ke Favorit</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onSelectWordDetail(translationResult)}
                className="text-xs font-bold text-green-800 hover:text-green-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Detail Kata</span>
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Translation History */}
      {history.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Riwayat Terjemahan Terakhir</span>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Bersihkan Riwayat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setInputText(item.sourceText);
                  handleTranslate(item.sourceText);
                }}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-green-300 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>{item.targetLangName}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">"{item.sourceText}"</p>
                <p className="text-xs font-extrabold text-green-800 truncate">→ {item.translatedText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
