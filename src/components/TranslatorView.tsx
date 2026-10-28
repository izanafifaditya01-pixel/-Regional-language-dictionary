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
import { translateOfflineRegional } from '../utils/regionalTranslator';

interface TranslatorViewProps {
  sourceLang: Language;
  targetLang: Language;
  onSelectLanguage: (type: 'source' | 'target', lang: Language) => void;
  onSwapLanguages: () => void;
  bookmarks: string[];
  onToggleBookmark: (wordId: string) => void;
  onSelectWordDetail: (word: WordEntry) => void;
  allWords?: WordEntry[];
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
  { label: 'Salam Pagi', text: 'Selamat pagi, bagaimana kabarmu hari ini?' },
  { label: 'Terima Kasih', text: 'Terima kasih banyak atas bantuannya.' },
  { label: 'Mengajak Makan', text: 'Mari kita makan siang bersama.' },
  { label: 'Menanyakan Harga', text: 'Berapa harga barang ini?' },
  { label: 'Menanyakan Arah', text: 'Permisi, di mana jalan menuju pusat kota?' },
  { label: 'Senang Bertemu', text: 'Saya sangat senang bisa berkunjung dan bertemu Anda.' },
];

export const TranslatorView: React.FC<TranslatorViewProps> = ({
  sourceLang,
  targetLang,
  onSelectLanguage,
  onSwapLanguages,
  bookmarks,
  onToggleBookmark,
  onSelectWordDetail,
  allWords = [],
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
      let data: any = null;

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

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const returnedTrans = (json.data.translation || '').trim();
            // Validate: if translating from Indonesian to regional, the translation cannot be identical to source text
            if (sourceLang.id === 'ind' && targetLang.id !== 'ind' && returnedTrans.toLowerCase() === text.toLowerCase()) {
              console.warn('API returned Indonesian instead of regional language, falling back to local linguistic engine.');
            } else if (returnedTrans) {
              data = json.data;
            }
          }
        }
      } catch (fetchErr) {
        console.warn('Network translation fetch failed, using offline engine:', fetchErr);
      }

      // If backend API returned valid data, use it; otherwise, use local regional translation engine
      const newEntry: WordEntry = data && data.translation && data.translation.trim()
        ? {
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
          }
        : translateOfflineRegional(text, sourceLang, targetLang, allWords);

      setTranslationResult(newEntry);

      // Add to history
      const histItem: TranslationHistoryItem = {
        id: newEntry.id,
        sourceText: text,
        translatedText: newEntry.translation,
        sourceLangName: sourceLang.name,
        targetLangName: targetLang.name,
        targetLangCode: targetLang.code,
        phonetic: newEntry.phonetic,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory(prev => [histItem, ...prev.filter(h => h.sourceText !== text)].slice(0, 10));
    } catch (err: any) {
      // Guaranteed safe fallback
      const fallbackEntry = translateOfflineRegional(text, sourceLang, targetLang, allWords);
      setTranslationResult(fallbackEntry);
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
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#14532D]">
          Penerjemah Kontekstual · Rumpun Sulawesi Tenggara & Nusantara
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Terjemahkan Kalimat ke Bahasa Daerah
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Ketik kata, frasa, atau kalimat lengkap dalam Bahasa Indonesia untuk diterjemahkan langsung ke bahasa daerah pilihan Anda lengkap dengan panduan fonetis dan catatan kesantunan budaya.
        </p>
      </div>

      {/* Language Selector Bar & Swap */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Source Language Select */}
          <div className="w-full sm:flex-1">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5 px-1">
              Bahasa Asal
            </label>
            <select
              value={sourceLang.id}
              onChange={e => {
                const found = LANGUAGES_DATA.find(l => l.id === e.target.value);
                if (found) onSelectLanguage('source', found);
              }}
              className="w-full px-4 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-sm font-semibold text-stone-800 outline-none focus:border-[#14532D] cursor-pointer"
            >
              {LANGUAGES_DATA.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.province})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={onSwapLanguages}
            className="p-2.5 bg-[#EFECE4] hover:bg-stone-200 border border-stone-200/90 rounded-xl text-stone-700 hover:text-stone-900 transition-colors cursor-pointer shrink-0 mt-2 sm:mt-5"
            title="Tukar Bahasa"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Target Language Select */}
          <div className="w-full sm:flex-1">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5 px-1">
              Bahasa Tujuan
            </label>
            <select
              value={targetLang.id}
              onChange={e => {
                const found = LANGUAGES_DATA.find(l => l.id === e.target.value);
                if (found) onSelectLanguage('target', found);
              }}
              className="w-full px-4 py-2.5 bg-[#14532D]/5 border border-[#14532D]/25 rounded-xl text-sm font-semibold text-[#14532D] outline-none focus:border-[#14532D] cursor-pointer"
            >
              {LANGUAGES_DATA.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.province})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Preset Quick Suggestions */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 shrink-0 mr-1 whitespace-nowrap">
              Contoh Kalimat:
            </span>
            {PRESET_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(phrase.text);
                  handleTranslate(phrase.text);
                }}
                className="px-3 py-1.5 bg-[#EFECE4]/80 hover:bg-stone-200/80 border border-stone-200/80 rounded-lg text-xs font-semibold text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation Input & Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        
        {/* Source Input Box */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 text-xs font-semibold text-stone-500">
              <span>Teks Sumber ({sourceLang.name})</span>
              <span className="font-mono tabular-nums">{inputText.length}/300</span>
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
              placeholder={`Ketik kata atau kalimat untuk diterjemahkan ke ${targetLang.name}...`}
              maxLength={300}
              rows={5}
              className="w-full mt-3 p-3.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-stone-900 text-sm outline-none resize-none focus:border-[#14532D] leading-relaxed"
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
                className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer whitespace-nowrap"
              >
                Bersihkan Teks
              </button>
            )}

            <button
              onClick={() => handleTranslate()}
              disabled={isLoading || !inputText.trim()}
              className="ml-auto px-5 py-2.5 bg-[#14532D] hover:bg-[#166534] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Menerjemahkan...</span>
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  <span>Terjemahkan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Output Box */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 text-xs font-semibold text-stone-500">
              <span className="text-[#14532D] font-bold">
                Hasil Terjemahan · {targetLang.name}
              </span>
              {translationResult && (
                <button
                  onClick={() => handleCopy(translationResult.translation)}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-900 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                  title="Salin Hasil Terjemahan"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#14532D]" />
                      <span className="text-[#14532D]">Tersalin</span>
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
              <div className="p-4 mt-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {error}
              </div>
            ) : translationResult ? (
              <div className="mt-3.5 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                      {translationResult.translation}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono mt-1">
                      /{translationResult.phonetic}/
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(translationResult.translation, targetLang.code, targetLang.name)}
                    className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-[#14532D] text-white hover:bg-[#166534]'
                    }`}
                    title="Dengarkan Suara Pelafalan"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Example sentence & Cultural insight */}
                {translationResult.exampleSentence && (
                  <div className="p-3.5 bg-[#F8F6F1] border border-stone-200/80 rounded-xl text-xs space-y-1">
                    <p className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">Contoh Penggunaan</p>
                    <p className="text-stone-900 font-serif italic text-sm">"{translationResult.exampleSentence}"</p>
                    {translationResult.exampleTranslation && (
                      <p className="text-stone-600">{translationResult.exampleTranslation}</p>
                    )}
                  </div>
                )}

                {translationResult.culturalContext && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-stone-700 leading-relaxed">
                    <span className="font-semibold text-amber-900">Konteks Budaya:</span> {translationResult.culturalContext}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Languages className="w-9 h-9 mx-auto text-stone-300 stroke-1" />
                <p className="text-xs">
                  Hasil terjemahan {targetLang.name} beserta panduan fonetis akan ditampilkan di sini.
                </p>
              </div>
            )}
          </div>

          {translationResult && (
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <button
                onClick={() => onToggleBookmark(translationResult.id)}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {bookmarks.includes(translationResult.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#14532D]" />
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
                className="text-xs font-semibold text-[#14532D] hover:text-[#166534] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Lembar Leksikon</span>
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Translation History */}
      {history.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
              <Clock className="w-4 h-4 text-stone-500" />
              <span>Riwayat Terjemahan Terakhir</span>
            </div>
            <button
              onClick={() => setHistory([])}
              className="text-xs font-semibold text-stone-400 hover:text-stone-700 cursor-pointer whitespace-nowrap"
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
                className="p-3.5 rounded-xl border border-stone-200/80 bg-[#F8F6F1] hover:bg-white hover:border-[#14532D]/40 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-stone-500">
                  <span>{item.targetLangName}</span>
                  <span className="font-mono tabular-nums">{item.timestamp}</span>
                </div>
                <p className="text-xs font-medium text-stone-700 truncate">"{item.sourceText}"</p>
                <p className="font-serif text-sm font-bold text-[#14532D] truncate">→ {item.translatedText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
