import React, { useState, useMemo } from 'react';
import { Search, Volume2, Bookmark, BookmarkCheck, Sparkles, Filter, Info, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { WordEntry, Language, Category } from '../types';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';
import { CATEGORIES_DATA } from '../data/languagesData';
import { speakWord } from '../utils/audioSpeech';

interface DictionaryViewProps {
  sourceLang: Language;
  targetLang: Language;
  bookmarks: string[];
  onToggleBookmark: (wordId: string) => void;
  onSelectWordDetail: (word: WordEntry) => void;
  onOpenLanguageModal: (type: 'source' | 'target') => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  sourceLang,
  targetLang,
  bookmarks,
  onToggleBookmark,
  onSelectWordDetail,
  onOpenLanguageModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // AI Translation State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<WordEntry | null>(null);

  // Filter dictionary items
  const filteredWords = useMemo(() => {
    let list = DICTIONARY_DATABASE;

    // Filter by target language if regional
    if (targetLang.id !== 'ind') {
      list = list.filter(item => item.targetLangId === targetLang.id || item.targetLangId === 'bug');
    }

    // Filter by category
    if (selectedCategory !== 'Semua') {
      list = list.filter(item => item.category === selectedCategory || item.category.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        item =>
          item.word.toLowerCase().includes(q) ||
          item.translation.toLowerCase().includes(q) ||
          item.phonetic.toLowerCase().includes(q)
      );
    }

    return list;
  }, [targetLang, selectedCategory, searchQuery]);

  const handleAudioPlay = (e: React.MouseEvent, word: WordEntry) => {
    e.stopPropagation();
    setPlayingWordId(word.id);
    speakWord(word.translation, targetLang.code, () => {
      setPlayingWordId(null);
    }, targetLang.name);
  };

  // Call AI Endpoint for custom unlisted translations
  const handleAITranslate = async () => {
    if (!searchQuery.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: searchQuery,
          sourceLangName: sourceLang.name,
          targetLangName: targetLang.name,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menerjemahkan dengan AI');
      }

      const data = json.data;
      const newWordEntry: WordEntry = {
        id: `ai-${Date.now()}`,
        sourceLangId: sourceLang.id,
        targetLangId: targetLang.id,
        word: data.word || searchQuery,
        translation: data.translation,
        phonetic: data.phonetic || '-',
        category: data.category || 'Kata Umum',
        exampleSentence: data.exampleSentence || '',
        exampleTranslation: data.exampleTranslation || '',
        culturalContext: data.culturalContext || '',
        synonyms: data.synonyms || [],
        antonyms: data.antonyms || [],
      };

      setAiResult(newWordEntry);
    } catch (err: any) {
      setAiError(err.message || 'Terjadi kesalahan pada AI. Silakan coba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="dictionary-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleAITranslate();
                }
              }}
              placeholder={`Cari atau terjemahkan kata/kalimat ke ${targetLang.name}... (Tekan Enter)`}
              className="w-full pl-11 pr-24 py-3 bg-slate-100 border-none outline-none text-slate-800 text-sm rounded-full font-medium"
            />
            {searchQuery && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={handleAITranslate}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-full transition-colors cursor-pointer disabled:opacity-50"
                  title="Terjemahkan"
                >
                  {aiLoading ? '...' : 'Translate'}
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setAiResult(null);
                    setAiError(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Target Language Indicator / Selector Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenLanguageModal('target')}
              className="flex items-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full text-green-800 text-sm font-bold transition-colors cursor-pointer shrink-0"
              title="Ganti Bahasa Tujuan"
            >
              <span className="text-base">{targetLang.flagEmoji}</span>
              <span className="hidden xs:inline">{targetLang.name}</span>
              <span className="xs:hidden">{targetLang.name.replace('Bahasa ', '')}</span>
            </button>
          </div>

        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Kategori:
          </span>

          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'Semua'
                ? 'pill-active shadow-xs'
                : 'pill-inactive border border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            Semua
          </button>

          {CATEGORIES_DATA.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'pill-active shadow-xs'
                  : 'pill-inactive border border-slate-200 hover:bg-slate-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Search Banner fallback if query exists and no results or user wants AI */}
      {searchQuery.trim() !== '' && (
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-50 border border-green-200 text-green-800 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Terjemahkan "{searchQuery}" dengan AI Leksika
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Dapatkan terjemahan instan, pelafalan fonetis, dan contoh kalimat ke {targetLang.name}.
              </p>
            </div>
          </div>

          <button
            onClick={handleAITranslate}
            disabled={aiLoading}
            className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm rounded-full flex items-center gap-2 shadow-xs shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menerjemahkan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Terjemahkan Sekarang</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* AI Error Alert */}
      {aiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl">
          {aiError}
        </div>
      )}

      {/* AI Translation Result Card */}
      {aiResult && (
        <div className="bg-white border-2 border-green-600/30 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-green-50 text-green-800 border border-green-200 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Hasil Terjemahan AI
            </span>
            <span className="text-xs font-extrabold text-slate-600">{targetLang.name}</span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{aiResult.translation}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Cara Membaca: <span className="text-green-800 font-bold">"{aiResult.phonetic}"</span>
              </p>
            </div>

            <button
              onClick={e => handleAudioPlay(e, aiResult)}
              className="p-3 bg-green-700 text-white hover:bg-green-800 rounded-2xl shadow-xs transition-all cursor-pointer shrink-0"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-200">
            <p className="font-bold text-slate-800">Arti ({sourceLang.name}): {aiResult.word}</p>
            {aiResult.exampleSentence && (
              <p className="text-green-900 italic font-medium mt-1">"{aiResult.exampleSentence}"</p>
            )}
            {aiResult.exampleTranslation && (
              <p className="text-slate-600">{aiResult.exampleTranslation}</p>
            )}
          </div>

          {aiResult.culturalContext && (
            <div className="text-xs text-slate-700 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80">
              <span className="font-bold text-amber-900">Wawasan Budaya & Konteks:</span> {aiResult.culturalContext}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => onSelectWordDetail(aiResult)}
              className="text-xs font-bold text-green-800 hover:text-green-900 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Detail Lengkap & Simpan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Dictionary Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>
            {filteredWords.length} Kosakata Ditemukan {selectedCategory !== 'Semua' && `in ${selectedCategory}`}
          </span>
          <span>Bahasa {targetLang.name.replace('Bahasa ', '')}</span>
        </div>

        {filteredWords.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Tidak Ada Kosakata Offline</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Kata "{searchQuery}" belum terdaftar di database offline {targetLang.name}. Klik tombol "Terjemahkan dengan AI" di atas untuk hasil instan!
            </p>
            <button
              onClick={handleAITranslate}
              disabled={aiLoading}
              className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gunakan AI Leksika Nusantara</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredWords.map(word => {
              const isBookmarked = bookmarks.includes(word.id);
              const isPlaying = playingWordId === word.id;

              return (
                <div
                  key={word.id}
                  onClick={() => onSelectWordDetail(word)}
                  className="bg-white p-4.5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  id={`word-card-${word.id}`}
                >
                  <div className="space-y-2">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                          {word.category}
                        </span>
                        {word.isPopular && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Populer
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleBookmark(word.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isBookmarked ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Regional Word & Indonesian Translation */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {word.translation}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Pelafalan: <span className="text-emerald-800 font-medium">"{word.phonetic}"</span>
                        </p>
                      </div>

                      {/* Pronunciation Speaker Button */}
                      <button
                        onClick={e => handleAudioPlay(e, word)}
                        className={`p-2 rounded-xl transition-all ${
                          isPlaying
                            ? 'bg-amber-400 text-slate-950 animate-pulse'
                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900'
                        }`}
                        title="Dengarkan Pelafalan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Indonesian Word */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium block">Bahasa Indonesia:</span>
                      <p className="text-sm font-bold text-slate-800">{word.word}</p>
                    </div>

                    {/* Example Sentence Preview */}
                    {word.exampleSentence && (
                      <p className="text-xs text-slate-600 line-clamp-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{word.exampleSentence}"
                      </p>
                    )}

                  </div>

                  {/* Card Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-900">
                    <span>Lihat Detail & Budaya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
