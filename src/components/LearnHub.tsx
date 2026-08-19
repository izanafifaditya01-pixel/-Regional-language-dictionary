import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, CheckCircle2, ChevronRight, Layers, Trophy, RotateCw } from 'lucide-react';
import { WordEntry, Category, Language } from '../types';
import { CATEGORIES_DATA } from '../data/languagesData';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';
import { speakWord } from '../utils/audioSpeech';

interface LearnHubProps {
  targetLang: Language;
  onAddXp: (amount: number) => void;
  onSelectWordDetail: (word: WordEntry) => void;
}

export const LearnHub: React.FC<LearnHubProps> = ({ targetLang, onAddXp, onSelectWordDetail }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filter category words
  const flashcardWords = selectedCategory
    ? DICTIONARY_DATABASE.filter(
        w => w.category === selectedCategory.id || w.category.includes(selectedCategory.id)
      )
    : [];

  const activeWord = flashcardWords[currentFlashcardIdx];

  const handleStartCategoryStudy = (category: Category) => {
    setSelectedCategory(category);
    setCurrentFlashcardIdx(0);
    setIsFlipped(false);
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    if (currentFlashcardIdx < flashcardWords.length - 1) {
      setCurrentFlashcardIdx(prev => prev + 1);
    } else {
      setCurrentFlashcardIdx(0);
    }
  };

  const handleMasterWord = (wordId: string) => {
    if (!masteredWords.includes(wordId)) {
      setMasteredWords(prev => [...prev, wordId]);
      onAddXp(10); // Reward 10 XP
    }
    handleNextFlashcard();
  };

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakWord(text, targetLang.code, () => {
      setIsPlayingAudio(false);
    }, targetLang.name);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-green-50 rounded-full opacity-60 pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-green-700" />
          <span>Modul Pembelajaran Kosakata Tematik</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Belajar Kosakata Bahasa {targetLang.name.replace('Bahasa ', '')}</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
          Pilih kategori di bawah ini untuk belajar melalui kartu hafalan (flashcards) interaktif, audio pelafalan, dan rasakan kemajuan belajar setiap hari.
        </p>
      </div>

      {/* 10 Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES_DATA.map(cat => {
          const categoryWordsCount = DICTIONARY_DATABASE.filter(
            w => w.category === cat.id || w.category.includes(cat.id)
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleStartCategoryStudy(cat)}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer group flex flex-col justify-between"
              id={`category-card-${cat.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`p-3 rounded-2xl ${cat.color} font-bold text-sm`}>
                    <Layers className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold text-green-800 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    {categoryWordsCount || 5} Kosakata
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-green-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-green-700 group-hover:text-green-800">
                <span>Mulai Belajar Flashcard</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Flashcard Study Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Flashcard Belajar
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedCategory.name}</h3>
              </div>

              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-xs"
              >
                ✕ Tutup
              </button>
            </div>

            {flashcardWords.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Belum ada kata khusus di kategori ini untuk bahasa ini.
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Progress Bar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>
                    Kartu {currentFlashcardIdx + 1} dari {flashcardWords.length}
                  </span>
                  <span className="text-emerald-700">Klik kartu untuk membalik &rarr;</span>
                </div>

                {/* Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`min-h-[220px] p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-lg relative ${
                    isFlipped
                      ? 'bg-emerald-900 text-white border-emerald-700'
                      : 'bg-gradient-to-br from-amber-50 to-emerald-50 text-slate-900 border-amber-300'
                  }`}
                >
                  {!isFlipped ? (
                    /* Front side: Regional Word */
                    <div className="space-y-3">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-bold rounded-full">
                        Bahasa {targetLang.name.replace('Bahasa ', '')}
                      </span>
                      <h2 className="text-3xl font-black text-emerald-950 tracking-tight">
                        {activeWord.translation}
                      </h2>
                      <p className="text-xs font-mono text-emerald-800">
                        Cara membaca: "{activeWord.phonetic}"
                      </p>
                      <span className="text-[11px] text-slate-500 block pt-2 italic">
                        (Sentuh/klik untuk lihat arti Bahasa Indonesia)
                      </span>
                    </div>
                  ) : (
                    /* Back side: Indonesian Translation & Audio */
                    <div className="space-y-3">
                      <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-bold rounded-full">
                        Bahasa Indonesia
                      </span>
                      <h2 className="text-3xl font-black text-amber-300">
                        {activeWord.word}
                      </h2>
                      {activeWord.exampleSentence && (
                        <p className="text-xs text-emerald-100 italic bg-black/20 p-2.5 rounded-xl">
                          "{activeWord.exampleSentence}"
                        </p>
                      )}

                      <button
                        onClick={e => handlePlayAudio(e, activeWord.translation)}
                        className="mt-2 px-4 py-2 bg-amber-400 text-slate-950 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Dengarkan Pelafalan</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNextFlashcard}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Lewati</span>
                  </button>

                  <button
                    onClick={() => handleMasterWord(activeWord.id)}
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Paham (+10 XP)</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
