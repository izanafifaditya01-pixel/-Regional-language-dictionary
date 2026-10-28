import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Info,
  ArrowRight,
  RefreshCw,
  Plus,
  ChevronDown,
  X,
} from 'lucide-react';
import { WordEntry, Language } from '../types';
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
  onNavigateToContribute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [originFilter, setOriginFilter] = useState<'all' | 'builtin' | 'contributed'>('all');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<WordEntry | null>(null);

  const wordDataset = allWords || DICTIONARY_DATABASE;

  const filteredWords = useMemo(() => {
    let list = wordDataset;

    if (targetLang.id !== 'ind') {
      list = list.filter(item => item.targetLangId === targetLang.id);
    }

    if (originFilter === 'builtin') {
      list = list.filter(item => !item.isUserContributed);
    } else if (originFilter === 'contributed') {
      list = list.filter(item => item.isUserContributed);
    }

    if (selectedCategory !== 'Semua') {
      list = list.filter(
        item => item.category === selectedCategory || item.category?.includes(selectedCategory)
      );
    }

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
    speakWord(
      word.translation,
      targetLang.code,
      () => {
        setPlayingWordId(null);
      },
      targetLang.name
    );
  };

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
            const returnedTrans = (json.data.translation || '').trim();
            if (
              sourceLang.id === 'ind' &&
              targetLang.id !== 'ind' &&
              returnedTrans.toLowerCase() === searchQuery.toLowerCase()
            ) {
              console.warn('AI returned source language, using offline regional database.');
            } else if (returnedTrans) {
              data = json.data;
            }
          }
        }
      } catch (fetchErr) {
        console.warn('Dictionary AI fetch error, using offline engine:', fetchErr);
      }

      const newWordEntry: WordEntry =
        data && data.translation && data.translation.trim()
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
          : translateOfflineRegional(searchQuery, sourceLang, targetLang, wordDataset);

      setAiResult(newWordEntry);
    } catch {
      const fallback = translateOfflineRegional(searchQuery, sourceLang, targetLang, wordDataset);
      setAiResult(fallback);
    } finally {
      setAiLoading(false);
    }
  };

  const contributedCount = useMemo(() => {
    return wordDataset.filter(
      w => (targetLang.id === 'ind' || w.targetLangId === targetLang.id) && w.isUserContributed
    ).length;
  }, [wordDataset, targetLang]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Control Panel */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 space-y-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
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
              placeholder={`Cari kosakata atau kalimat dalam ${targetLang.name}...`}
              className="w-full pl-11 pr-32 py-3 bg-[#F8F6F1] border border-stone-200/80 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm font-normal transition-colors focus:bg-white"
            />
            {searchQuery && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAITranslate}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-[#14532D] hover:bg-[#166534] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {aiLoading ? 'Memproses...' : 'Terjemahkan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setAiResult(null);
                    setAiError(null);
                  }}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
                  title="Bersihkan Pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Language Picker & Add Word CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenLanguageModal('target')}
              className="inline-flex items-center gap-2 px-4 py-3 bg-[#F8F6F1] hover:bg-[#EFECE4] border border-stone-200 rounded-xl text-stone-800 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Pilih Bahasa Daerah"
            >
              <span>{targetLang.name}</span>
              <ChevronDown className="w-4 h-4 text-stone-500" />
            </button>

            {onNavigateToContribute && (
              <button
                type="button"
                onClick={onNavigateToContribute}
                className="inline-flex items-center gap-1.5 px-4 py-3 bg-[#14532D] hover:bg-[#166534] text-white rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kata</span>
              </button>
            )}
          </div>
        </div>

        {/* Segmented Origin Filter & Category Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-stone-100">
          {/* Segmented Control */}
          <div className="inline-flex items-center gap-1 bg-[#EFECE4] p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setOriginFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                originFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Entri
            </button>
            <button
              type="button"
              onClick={() => setOriginFilter('builtin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                originFilter === 'builtin'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Leksikon Resmi
            </button>
            <button
              type="button"
              onClick={() => setOriginFilter('contributed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer tabular-nums ${
                originFilter === 'contributed'
                  ? 'bg-[#14532D] text-white'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Kontribusi ({contributedCount})
            </button>
          </div>

          {/* Horizontal Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('Semua')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCategory === 'Semua'
                  ? 'bg-stone-900 text-white'
                  : 'bg-[#F8F6F1] text-stone-600 hover:bg-[#EFECE4] hover:text-stone-900'
              }`}
            >
              Semua Kategori
            </button>

            {CATEGORIES_DATA.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#14532D] text-white'
                    : 'bg-[#F8F6F1] text-stone-600 hover:bg-[#EFECE4] hover:text-stone-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Instant Translation Prompt Bar when typing */}
      {searchQuery.trim() !== '' && !aiResult && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Penerjemahan Kontekstual · {targetLang.name}
            </p>
            <h4 className="font-serif text-lg font-semibold text-stone-900">
              Terjemahkan &ldquo;{searchQuery}&rdquo; secara langsung
            </h4>
          </div>

          <button
            type="button"
            onClick={handleAITranslate}
            disabled={aiLoading}
            className="px-4 py-2.5 bg-[#14532D] hover:bg-[#166534] text-white font-medium text-sm rounded-xl inline-flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menerjemahkan...</span>
              </>
            ) : (
              <>
                <span>Terjemahkan Kalimat</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {aiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl">
          {aiError}
        </div>
      )}

      {/* AI / Instant Translation Result Card */}
      {aiResult && (
        <article className="bg-white border border-[#14532D]/40 p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between gap-2 text-xs text-stone-500 uppercase tracking-wider font-medium">
            <span>Hasil Terjemahan Leksikal · {targetLang.name}</span>
            <span>{aiResult.category}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-3xl font-semibold text-stone-900">
                {aiResult.translation}
              </h3>
              <p className="font-mono text-xs text-stone-500 mt-1">
                /{aiResult.phonetic || '-'}/
              </p>
            </div>

            <button
              type="button"
              onClick={e => handleAudioPlay(e, aiResult)}
              className="w-11 h-11 bg-[#14532D] text-white hover:bg-[#166534] rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Dengarkan Pelafalan"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200/80 space-y-2 text-sm">
            <p className="text-stone-800">
              <span className="text-stone-500">Makna ({sourceLang.name}): </span>
              <strong className="font-semibold text-stone-900">{aiResult.word}</strong>
            </p>
            {aiResult.exampleSentence && (
              <p className="font-serif italic text-stone-700 pt-1">
                &ldquo;{aiResult.exampleSentence}&rdquo;
                {aiResult.exampleTranslation && (
                  <span className="not-italic font-sans text-xs text-stone-500">
                    {' '}— {aiResult.exampleTranslation}
                  </span>
                )}
              </p>
            )}
          </div>

          {aiResult.culturalContext && (
            <p className="text-xs text-stone-600 leading-relaxed pt-3 border-t border-stone-100">
              <strong className="font-semibold text-stone-800">Konteks Budaya: </strong>
              {aiResult.culturalContext}
            </p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => onSelectWordDetail(aiResult)}
              className="text-xs font-semibold text-[#14532D] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Lembar Leksikon Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </article>
      )}

      {/* Dictionary Catalog Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 px-1">
          <div className="flex items-center gap-2 tabular-nums">
            <span className="font-semibold text-stone-800">{filteredWords.length} Entri Leksikon</span>
            <span aria-hidden="true">·</span>
            <span>{targetLang.name}</span>
            {selectedCategory !== 'Semua' && (
              <>
                <span aria-hidden="true">·</span>
                <span>Kategori {selectedCategory}</span>
              </>
            )}
          </div>

          {onNavigateToContribute && (
            <button
              type="button"
              onClick={onNavigateToContribute}
              className="text-[#14532D] hover:underline font-medium cursor-pointer"
            >
              Usulkan Kosakata Daerah Baru &rarr;
            </button>
          )}
        </div>

        {filteredWords.length === 0 ? (
          <div className="bg-white p-10 sm:p-14 text-center rounded-2xl border border-stone-200/90 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8F6F1] text-stone-600 flex items-center justify-center mx-auto border border-stone-200">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-stone-900">
              Entri Belum Tercatat dalam Katalog
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Kosakata &ldquo;{searchQuery || selectedCategory}&rdquo; belum tersedia di arsip {targetLang.name}. Anda dapat menerjemahkannya secara otomatis atau menyumbangkan kosakata baru.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAITranslate}
                disabled={aiLoading}
                className="px-4 py-2.5 bg-[#14532D] hover:bg-[#166534] text-white font-medium text-sm rounded-xl inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Terjemahkan Otomatis</span>
              </button>
              {onNavigateToContribute && (
                <button
                  type="button"
                  onClick={onNavigateToContribute}
                  className="px-4 py-2.5 bg-[#EFECE4] hover:bg-stone-300/70 text-stone-900 font-medium text-sm rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan ke Katalog</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredWords.map(word => {
              const isBookmarked = bookmarks.includes(word.id);
              const isPlaying = playingWordId === word.id;

              return (
                <article
                  key={word.id}
                  onClick={() => onSelectWordDetail(word)}
                  id={`word-card-${word.id}`}
                  className="bg-white p-6 rounded-2xl border border-stone-200/90 hover:border-stone-300 transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* Unboxed Metadata Line + Bookmark Action */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                        <span className="font-medium text-stone-700">{word.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {word.isUserContributed ? 'Kontribusi Komunitas' : 'Leksikon Resmi'}
                        </span>
                        {word.isPopular && !word.isUserContributed && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#9A3412] font-medium">Sering Digunakan</span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onToggleBookmark(word.id);
                        }}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-stone-400 hover:text-stone-700 hover:bg-[#F8F6F1]'
                        }`}
                        title={isBookmarked ? 'Hapus dari Tersimpan' : 'Simpan Kosakata'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-600/20" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Headword, Phonetic & Audio Button */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-serif text-2xl font-semibold text-stone-900 group-hover:text-[#14532D] transition-colors">
                          {word.translation}
                        </h4>
                        <p className="font-mono text-xs text-stone-500 mt-1">
                          /{word.phonetic || '-'}/
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={e => handleAudioPlay(e, word)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#F8F6F1] hover:bg-[#14532D] text-stone-700 hover:text-white border border-stone-200/80'
                        }`}
                        title="Dengarkan Pelafalan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Indonesian Gloss */}
                    <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between gap-3">
                      <span className="text-xs text-stone-500">Bahasa Indonesia</span>
                      <p className="text-sm font-semibold text-stone-900 text-right">{word.word}</p>
                    </div>

                    {/* Unboxed Editorial Example Preview */}
                    {word.exampleSentence && (
                      <p className="font-serif italic text-xs sm:text-sm text-stone-600 line-clamp-1 pt-1">
                        &ldquo;{word.exampleSentence}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400">
                      {word.isUserContributed
                        ? `Oleh ${word.contributorName || 'Penutur Komunitas'}`
                        : `Arsip ${targetLang.name.replace('Bahasa ', '')}`}
                    </span>
                    <span className="font-medium text-[#14532D] inline-flex items-center gap-1">
                      <span>Catatan &amp; Contoh</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
