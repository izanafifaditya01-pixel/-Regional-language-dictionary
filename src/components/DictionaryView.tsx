import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Filter, 
  Info, 
  ArrowRight, 
  RefreshCw, 
  Layers,
  PlusCircle,
  BookPlus
} from 'lucide-react';
import { WordEntry, Language, Category } from '../types';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';
import { CATEGORIES_DATA } from '../data/languagesData';
import { speakWord } from '../utils/audioSpeech';
import { translateOfflineRegional } from '../utils/regionalTranslator';

interface DictionaryViewProps {
  sourceLang: Language;
  targetLang: Language;
  bookmarks: string[];
  allWords?: WordEntry[];
  onToggleBookmark: (wordId: string) => void;
  onSelectWordDetail: (word: WordEntry) => void;
  onOpenLanguageModal: (type: 'source' | 'target') => void;
  onNavigateToContribute?: () => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  sourceLang,
  targetLang,
  bookmarks,
  allWords,
  onToggleBookmark,
  onSelectWordDetail,
  onOpenLanguageModal,
  onNavigateToContribute
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [originFilter, setOriginFilter] = useState<'all' | 'builtin' | 'contributed'>('all');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // AI Translation State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<WordEntry | null>(null);

  // Base list to filter from
  const wordDataset = allWords || DICTIONARY_DATABASE;

  // Filter dictionary items
  const filteredWords = useMemo(() => {
    let list = wordDataset;

    // Filter by target language
    if (targetLang.id !== 'ind') {
      list = list.filter(item => item.targetLangId === targetLang.id);
    }

    // Filter by origin (all / builtin / contributed)
    if (originFilter === 'builtin') {
      list = list.filter(item => !item.isUserContributed);
    } else if (originFilter === 'contributed') {
      list = list.filter(item => item.isUserContributed);
    }

    // Filter by category
    if (selectedCategory !== 'Semua') {
      list = list.filter(item => item.category === selectedCategory || item.category?.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        item =>
          item.word.toLowerCase().includes(q) ||
          item.translation.toLowerCase().includes(q) ||
          item.phonetic?.toLowerCase().includes(q) ||
          item.culturalContext?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [wordDataset, targetLang, selectedCategory, searchQuery, originFilter]);

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
      let data: any = null;

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

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            data = json.data;
          }
        }
      } catch (fetchErr) {
        console.warn('Dictionary AI fetch error, using offline engine:', fetchErr);
      }

      const newWordEntry: WordEntry = data && data.translation
        ? {
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
          }
        : translateOfflineRegional(searchQuery, sourceLang, targetLang);

      setAiResult(newWordEntry);
    } catch (err: any) {
      const fallback = translateOfflineRegional(searchQuery, sourceLang, targetLang);
      setAiResult(fallback);
    } finally {
      setAiLoading(false);
    }
  };

  const contributedCount = useMemo(() => {
    return wordDataset.filter(w => (targetLang.id === 'ind' || w.targetLangId === targetLang.id) && w.isUserContributed).length;
  }, [wordDataset, targetLang]);

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
              className="w-full pl-11 pr-24 py-3 bg-slate-100 border-none outline-hidden text-slate-800 text-sm rounded-full font-medium"
            />
            {searchQuery && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={handleAITranslate}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full transition-colors cursor-pointer disabled:opacity-50"
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

          {/* Action Buttons: Target Language & Add Word Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenLanguageModal('target')}
              className="flex items-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full text-emerald-800 text-sm font-bold transition-colors cursor-pointer shrink-0"
              title="Ganti Bahasa Tujuan"
            >
              <span className="text-base">{targetLang.flagEmoji}</span>
              <span className="hidden xs:inline">{targetLang.name}</span>
              <span className="xs:hidden">{targetLang.name.replace('Bahasa ', '')}</span>
            </button>

            {onNavigateToContribute && (
              <button
                onClick={onNavigateToContribute}
                className="flex items-center gap-1.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer shrink-0"
                title="Buka Formulir Tambah Kata Baru"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">+ Tambah Kata</span>
                <span className="sm:hidden">+ Kata</span>
              </button>
            )}
          </div>

        </div>

        {/* Origin Filter & Category Pills Slider */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          
          {/* Origin Filter (Semua / Bawaan / Kontribusi) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setOriginFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                originFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setOriginFilter('builtin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                originFilter === 'builtin'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Database Bawaan
            </button>
            <button
              onClick={() => setOriginFilter('contributed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                originFilter === 'contributed'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Kontribusi ({contributedCount})</span>
            </button>
          </div>

          {/* Categories Pill Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('Semua')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'Semua'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Semua Kategori
            </button>

            {CATEGORIES_DATA.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* AI Search Banner fallback */}
      {searchQuery.trim() !== '' && (
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold shrink-0">
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
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-full flex items-center gap-2 shadow-xs shrink-0 disabled:opacity-50 cursor-pointer"
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
        <div className="bg-white border-2 border-emerald-600/30 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Hasil Terjemahan AI
            </span>
            <span className="text-xs font-extrabold text-slate-600">{targetLang.name}</span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{aiResult.translation}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Cara Membaca: <span className="text-emerald-800 font-bold">"{aiResult.phonetic}"</span>
              </p>
            </div>

            <button
              onClick={e => handleAudioPlay(e, aiResult)}
              className="p-3 bg-emerald-700 text-white hover:bg-emerald-800 rounded-2xl shadow-xs transition-all cursor-pointer shrink-0"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-200">
            <p className="font-bold text-slate-800">Arti ({sourceLang.name}): {aiResult.word}</p>
            {aiResult.exampleSentence && (
              <p className="text-emerald-900 italic font-medium mt-1">"{aiResult.exampleSentence}"</p>
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
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer"
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
            {filteredWords.length} Kosakata Ditemukan {selectedCategory !== 'Semua' && `di ${selectedCategory}`}
          </span>
          <div className="flex items-center gap-2">
            <span>Bahasa {targetLang.name.replace('Bahasa ', '')}</span>
            {onNavigateToContribute && (
              <button
                onClick={onNavigateToContribute}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline ml-2 cursor-pointer"
              >
                + Tambah Kata Baru
              </button>
            )}
          </div>
        </div>

        {filteredWords.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 text-center rounded-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Info className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Tidak Ada Kosakata yang Cocok</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Kata "{searchQuery || selectedCategory}" belum terdaftar di database {targetLang.name}. Anda dapat menambahkannya sendiri atau terjemahkan dengan AI!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAITranslate}
                disabled={aiLoading}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Terjemahkan dengan AI</span>
              </button>
              {onNavigateToContribute && (
                <button
                  onClick={onNavigateToContribute}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambahkan Kata ke Kamus</span>
                </button>
              )}
            </div>
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
                  className={`bg-white p-4.5 rounded-2xl border ${
                    word.isUserContributed 
                      ? 'border-emerald-300 hover:border-emerald-500 shadow-xs' 
                      : 'border-slate-200/80 hover:border-emerald-300 shadow-2xs'
                  } hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
                  id={`word-card-${word.id}`}
                >
                  <div className="space-y-2">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                          {word.category}
                        </span>
                        {word.isUserContributed && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            <span>Kontribusi</span>
                          </span>
                        )}
                        {word.isPopular && !word.isUserContributed && (
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
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
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
                    <span className="text-[11px] text-slate-400 font-normal">
                      {word.isUserContributed ? `Oleh ${word.contributorName || 'Komunitas'}` : 'Entri Kamus Sultra'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>Detail & Budaya</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
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
