import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Trophy, 
  RotateCw, 
  ListFilter, 
  Search, 
  ArrowLeft, 
  Globe, 
  Check, 
  HelpCircle,
  Award,
  ChevronLeft,
  Filter
} from 'lucide-react';
import { WordEntry, Category, Language } from '../types';
import { CATEGORIES_DATA, LANGUAGES_DATA } from '../data/languagesData';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';
import { speakWord } from '../utils/audioSpeech';

interface LearnHubProps {
  targetLang: Language;
  onAddXp: (amount: number) => void;
  onSelectWordDetail: (word: WordEntry) => void;
}

export const LearnHub: React.FC<LearnHubProps> = ({ targetLang, onAddXp, onSelectWordDetail }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeMode, setActiveMode] = useState<'flashcard' | 'list' | 'quiz'>('flashcard');
  const [langFilterMode, setLangFilterMode] = useState<'selected' | 'all'>('selected');
  const [activeLangId, setActiveLangId] = useState<string>(targetLang.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [bodySubFilter, setBodySubFilter] = useState<'all' | 'kepala' | 'badan' | 'ekstremitas'>('all');

  // Flashcard State
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Quick Quiz State
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sync active language when prop changes
  React.useEffect(() => {
    setActiveLangId(targetLang.id);
  }, [targetLang.id]);

  // Filter category words
  const categoryWords = useMemo(() => {
    if (!selectedCategory) return [];

    let list = DICTIONARY_DATABASE.filter(
      w => w.category === selectedCategory.id || w.category.includes(selectedCategory.id)
    );

    // Filter by language if in selected mode
    if (langFilterMode === 'selected' && activeLangId !== 'ind') {
      const specificLangWords = list.filter(w => w.targetLangId === activeLangId);
      // If there are words for this language, use them; otherwise show all with relevant badge
      if (specificLangWords.length > 0) {
        list = specificLangWords;
      }
    }

    // Sub-filter for Tubuh & Anggota Badan
    if (selectedCategory.id === 'Tubuh' && bodySubFilter !== 'all') {
      if (bodySubFilter === 'kepala') {
        const kepalaTerms = ['kepala', 'rambut', 'mata', 'telinga', 'hidung', 'mulut', 'gigi', 'lidah', 'wajah'];
        list = list.filter(w => kepalaTerms.some(t => w.word.toLowerCase().includes(t)));
      } else if (bodySubFilter === 'badan') {
        const badanTerms = ['leher', 'dada', 'perut', 'pinggang', 'punggung', 'hati', 'jantung', 'kulit'];
        list = list.filter(w => badanTerms.some(t => w.word.toLowerCase().includes(t)));
      } else if (bodySubFilter === 'ekstremitas') {
        const ekstremitasTerms = ['tangan', 'jari', 'bahu', 'kaki', 'lutut', 'telapak'];
        list = list.filter(w => ekstremitasTerms.some(t => w.word.toLowerCase().includes(t)));
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        w =>
          w.word.toLowerCase().includes(q) ||
          w.translation.toLowerCase().includes(q) ||
          w.phonetic.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, langFilterMode, activeLangId, bodySubFilter, searchQuery]);

  const activeWord = categoryWords[currentFlashcardIdx] || categoryWords[0];

  const handleStartCategoryStudy = (category: Category, mode: 'flashcard' | 'list' | 'quiz' = 'flashcard') => {
    setSelectedCategory(category);
    setActiveMode(mode);
    setCurrentFlashcardIdx(0);
    setIsFlipped(false);
    setSearchQuery('');
    setBodySubFilter('all');
    setQuizQuestionIdx(0);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    if (currentFlashcardIdx < categoryWords.length - 1) {
      setCurrentFlashcardIdx(prev => prev + 1);
    } else {
      setCurrentFlashcardIdx(0);
    }
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    if (currentFlashcardIdx > 0) {
      setCurrentFlashcardIdx(prev => prev - 1);
    } else {
      setCurrentFlashcardIdx(categoryWords.length - 1);
    }
  };

  const handleMasterWord = (wordId: string) => {
    if (!masteredWords.includes(wordId)) {
      setMasteredWords(prev => [...prev, wordId]);
      onAddXp(10); // Reward 10 XP
    }
    handleNextFlashcard();
  };

  const handlePlayAudio = (e: React.MouseEvent, text: string, langId?: string) => {
    e.stopPropagation();
    const targetLangObj = LANGUAGES_DATA.find(l => l.id === (langId || activeLangId)) || targetLang;
    setPlayingWordId(text);
    speakWord(text, targetLangObj.code, () => {
      setPlayingWordId(null);
    }, targetLangObj.name);
  };

  // Generate Quiz Options for Current Question
  const quizCurrentWord = categoryWords[quizQuestionIdx];
  const quizOptions = useMemo(() => {
    if (!quizCurrentWord || categoryWords.length < 2) return [];

    const correctAnswer = quizCurrentWord.translation;
    const otherWords = categoryWords
      .filter(w => w.id !== quizCurrentWord.id)
      .map(w => w.translation);

    // Shuffle and pick 3 wrong options
    const shuffledOthers = [...new Set(otherWords)].sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [correctAnswer, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return allOptions;
  }, [quizCurrentWord, categoryWords, quizQuestionIdx]);

  const handleSelectQuizOption = (option: string) => {
    if (isQuizSubmitted) return;
    setSelectedQuizOption(option);
  };

  const handleSubmitQuizAnswer = () => {
    if (!selectedQuizOption || isQuizSubmitted) return;
    setIsQuizSubmitted(true);

    if (selectedQuizOption === quizCurrentWord.translation) {
      setQuizScore(prev => prev + 1);
      onAddXp(15); // 15 XP for correct quiz answer
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);

    if (quizQuestionIdx < Math.min(categoryWords.length - 1, 9)) {
      setQuizQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-green-50 rounded-full opacity-70 pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-green-700" />
            <span>Modul Pembelajaran Kosakata Nusantara</span>
          </div>

          {/* Mastered Counter Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-900">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>{masteredWords.length} Kosakata Dikuasai</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Belajar Kosakata {targetLang.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
          Eksplorasi kosakata tematik lengkap mulai dari <strong>Bagian Tubuh & Anggota Badan</strong>, <strong>Keluarga</strong>, <strong>Makanan Khas</strong>, <strong>Hewan</strong>, <strong>Angka 1-10+</strong>, hingga ungkapan percakapan sehari-hari dengan pelafalan audio interaktif.
        </p>

        {/* Quick Language Filter Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-green-700" /> Fokus Bahasa:
          </span>

          <button
            onClick={() => { setLangFilterMode('selected'); setActiveLangId(targetLang.id); }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              langFilterMode === 'selected' && activeLangId === targetLang.id
                ? 'bg-green-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {targetLang.name} ({targetLang.flagEmoji || '🏛️'})
          </button>

          {/* Popular Regional Fast Toggles */}
          {[
            { id: 'mun', name: 'Muna' },
            { id: 'mrn', name: 'Moronene' },
            { id: 'bug', name: 'Bugis' },
            { id: 'jav', name: 'Jawa' },
            { id: 'sun', name: 'Sunda' },
            { id: 'min', name: 'Minang' },
            { id: 'btk', name: 'Batak' }
          ].map(l => (
            <button
              key={l.id}
              onClick={() => { setLangFilterMode('selected'); setActiveLangId(l.id); }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                langFilterMode === 'selected' && activeLangId === l.id
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {l.name}
            </button>
          ))}

          <button
            onClick={() => setLangFilterMode('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              langFilterMode === 'all'
                ? 'bg-green-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Nusantara
          </button>
        </div>
      </div>

      {/* 10 Thematic Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES_DATA.map(cat => {
          let count = DICTIONARY_DATABASE.filter(
            w => w.category === cat.id || w.category.includes(cat.id)
          ).length;

          const isSpecialCategory = cat.id === 'Tubuh' || cat.id === 'Keluarga' || cat.id === 'Angka';

          return (
            <div
              key={cat.id}
              onClick={() => handleStartCategoryStudy(cat, 'flashcard')}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-green-300 transition-all cursor-pointer group flex flex-col justify-between"
              id={`category-card-${cat.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`p-3 rounded-2xl ${cat.color} font-bold text-sm shadow-xs`}>
                    <Layers className="w-5 h-5" />
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {isSpecialCategory && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Lengkap
                      </span>
                    )}
                    <span className="text-xs font-bold text-green-800 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      {count} Kosakata
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-green-700 transition-colors flex items-center gap-2">
                    <span>{cat.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-green-700 group-hover:text-green-800">
                <span className="flex items-center gap-1">
                  <span>Mulai Belajar</span>
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Study Modal (Flashcard, List, Quiz) */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative p-5 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header & Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className={`p-2.5 rounded-2xl ${selectedCategory.color}`}>
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                      Kategori Tematik
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">
                      {categoryWords.length} kata
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">{selectedCategory.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs px-3.5 transition-colors"
                >
                  ✕ Tutup
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setActiveMode('flashcard')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeMode === 'flashcard'
                      ? 'bg-white text-green-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Kartu Hafalan (Flashcard)</span>
                </button>

                <button
                  onClick={() => setActiveMode('list')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeMode === 'list'
                      ? 'bg-white text-green-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Daftar Kosakata Lengkap</span>
                </button>

                <button
                  onClick={() => setActiveMode('quiz')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeMode === 'quiz'
                      ? 'bg-white text-green-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kuis Kilat (+15 XP)</span>
                </button>
              </div>

              {/* Language Switcher inside Modal */}
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500 pl-2">
                <span className="hidden sm:inline text-[11px]">Bahasa:</span>
                <select
                  value={langFilterMode === 'all' ? 'all' : activeLangId}
                  onChange={e => {
                    if (e.target.value === 'all') {
                      setLangFilterMode('all');
                    } else {
                      setLangFilterMode('selected');
                      setActiveLangId(e.target.value);
                    }
                  }}
                  className="bg-white text-slate-800 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="all">Semua Bahasa</option>
                  {LANGUAGES_DATA.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.province.split('(')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Sub-Category Pills for Tubuh & Anggota Badan */}
            {selectedCategory.id === 'Tubuh' && (
              <div className="flex flex-wrap items-center gap-1.5 bg-indigo-50/70 p-2.5 rounded-2xl border border-indigo-100">
                <span className="text-xs font-bold text-indigo-900 mr-1">Anatomi:</span>
                {[
                  { id: 'all', label: 'Semua Anggota Tubuh' },
                  { id: 'kepala', label: 'Kepala, Wajah & Indra' },
                  { id: 'badan', label: 'Leher, Badan & Organ' },
                  { id: 'ekstremitas', label: 'Tangan, Jari & Kaki' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setBodySubFilter(sub.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      bodySubFilter === sub.id
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'bg-white text-indigo-800 hover:bg-indigo-100'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-1">
              
              {categoryWords.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-slate-600 font-bold text-sm">Tidak ada kosakata yang cocok.</p>
                  <p className="text-xs text-slate-400">Coba pilih bahasa lain atau ubah filter pencarian Anda.</p>
                  <button
                    onClick={() => { setLangFilterMode('all'); setBodySubFilter('all'); setSearchQuery(''); }}
                    className="px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800"
                  >
                    Tampilkan Semua Kosakata Kategori Ini
                  </button>
                </div>
              ) : activeMode === 'flashcard' ? (
                /* ================= MODE FLASHCARD ================= */
                <div className="space-y-5 max-w-xl mx-auto py-2">
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="bg-slate-100 px-3 py-1 rounded-full">
                      Kartu {currentFlashcardIdx + 1} dari {categoryWords.length}
                    </span>
                    <span className="text-green-700">Sentuh / klik kartu untuk membalik &rarr;</span>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`min-h-[260px] p-6 sm:p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-lg relative ${
                      isFlipped
                        ? 'bg-gradient-to-br from-green-900 to-emerald-950 text-white border-green-700'
                        : 'bg-gradient-to-br from-amber-50 via-white to-green-50 text-slate-900 border-amber-300'
                    }`}
                  >
                    {!isFlipped ? (
                      /* Front Side: Regional Language */
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-xs">
                            {LANGUAGES_DATA.find(l => l.id === activeWord.targetLangId)?.name || 'Bahasa Daerah'}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 bg-white/80 border border-slate-200 rounded-full font-bold text-slate-600">
                            {activeWord.category}
                          </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black text-green-950 tracking-tight">
                          {activeWord.translation}
                        </h2>

                        <p className="text-xs sm:text-sm font-mono text-green-800 bg-white/70 px-3 py-1 rounded-full inline-block">
                          Pelafalan: "{activeWord.phonetic}"
                        </p>

                        <p className="text-[11px] text-slate-500 pt-3 italic block">
                          (Ketuk kartu untuk melihat arti dalam Bahasa Indonesia & contoh)
                        </p>
                      </div>
                    ) : (
                      /* Back Side: Indonesian Translation, Context & Audio */
                      <div className="space-y-3.5 animate-in fade-in duration-150">
                        <span className="px-3 py-1 bg-green-800 text-green-200 text-xs font-bold rounded-full">
                          Bahasa Indonesia
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-black text-amber-300">
                          {activeWord.word}
                        </h2>

                        {activeWord.exampleSentence && (
                          <div className="text-xs text-green-100 italic bg-black/25 p-3 rounded-2xl max-w-md mx-auto space-y-1">
                            <p className="font-semibold text-amber-200">"{activeWord.exampleSentence}"</p>
                            <p className="text-[11px] text-slate-200 opacity-90">({activeWord.exampleTranslation})</p>
                          </div>
                        )}

                        {activeWord.culturalContext && (
                          <p className="text-[11px] text-emerald-300 max-w-sm mx-auto line-clamp-2">
                            💡 {activeWord.culturalContext}
                          </p>
                        )}

                        <button
                          onClick={e => handlePlayAudio(e, activeWord.translation, activeWord.targetLangId)}
                          className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-md transition-transform active:scale-95"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>
                            {playingWordId === activeWord.translation ? 'Memutar Suara...' : 'Dengarkan Pelafalan'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation & Master Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handlePrevFlashcard}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center transition-colors"
                      title="Kartu Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleNextFlashcard}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Lewati</span>
                    </button>

                    <button
                      onClick={() => handleMasterWord(activeWord.id)}
                      className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>Sudah Hafal (+10 XP)</span>
                    </button>

                    <button
                      onClick={handleNextFlashcard}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center transition-colors"
                      title="Kartu Berikutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ) : activeMode === 'list' ? (
                /* ================= MODE DAFTAR KOSAKATA LENGKAP ================= */
                <div className="space-y-4">
                  
                  {/* Search Bar within Category */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Cari kosakata dalam kategori ${selectedCategory.name}...`}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Vocabulary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categoryWords.map(word => {
                      const lang = LANGUAGES_DATA.find(l => l.id === word.targetLangId);
                      const isMastered = masteredWords.includes(word.id);

                      return (
                        <div
                          key={word.id}
                          onClick={() => onSelectWordDetail(word)}
                          className="p-4 rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-sm bg-white transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold px-2 py-0.5 bg-green-50 text-green-800 border border-green-200 rounded-md">
                                {lang?.name || 'Bahasa Daerah'}
                              </span>

                              {isMastered && (
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Hafal
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div>
                                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-green-700 transition-colors">
                                  {word.translation}
                                </h4>
                                <p className="text-xs text-slate-500 font-semibold">
                                  Artinya: <span className="text-slate-800 font-bold">{word.word}</span>
                                </p>
                              </div>

                              <button
                                onClick={e => handlePlayAudio(e, word.translation, word.targetLangId)}
                                className="p-2 bg-slate-100 hover:bg-green-100 text-slate-700 hover:text-green-800 rounded-xl transition-colors"
                                title="Putar Pelafalan Audio"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-xs font-mono text-emerald-800 bg-slate-50 px-2 py-0.5 rounded-md inline-block">
                              Cara baca: {word.phonetic}
                            </p>

                            {word.exampleSentence && (
                              <p className="text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-xl italic line-clamp-2">
                                "{word.exampleSentence}"
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-green-700 group-hover:text-green-800">
                            <span>Lihat Detail Linguistik & Konteks Budaya</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ================= MODE KUIS KILAT ================= */
                <div className="max-w-xl mx-auto py-4 space-y-6">
                  {quizCompleted ? (
                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-amber-50 rounded-3xl border border-green-200 space-y-4">
                      <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-md">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Kuis Kilat Selesai!</h3>
                      <p className="text-sm text-slate-600">
                        Skor Anda: <strong className="text-green-800 text-lg">{quizScore}</strong> dari {Math.min(categoryWords.length, 10)} Soal Benar
                      </p>
                      <button
                        onClick={() => {
                          setQuizQuestionIdx(0);
                          setQuizScore(0);
                          setQuizCompleted(false);
                          setSelectedQuizOption(null);
                          setIsQuizSubmitted(false);
                        }}
                        className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all"
                      >
                        Ulangi Kuis Kilat
                      </button>
                    </div>
                  ) : quizCurrentWord ? (
                    <div className="space-y-6">
                      
                      {/* Quiz Progress */}
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>
                          Soal {quizQuestionIdx + 1} dari {Math.min(categoryWords.length, 10)}
                        </span>
                        <span className="text-green-700 font-extrabold">Skor Saat Ini: {quizScore}</span>
                      </div>

                      {/* Question Card */}
                      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl text-center space-y-3 shadow-lg">
                        <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full">
                          Apa terjemahan bahasa daerah dari:
                        </span>
                        <h3 className="text-3xl font-black text-amber-300 tracking-wide">
                          "{quizCurrentWord.word}"
                        </h3>
                        <p className="text-xs text-slate-400">
                          (Kategori: {selectedCategory.name})
                        </p>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quizOptions.map((opt, idx) => {
                          const isCorrect = opt === quizCurrentWord.translation;
                          let btnStyle = 'bg-white border-slate-200 hover:border-green-300 text-slate-800';

                          if (isQuizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-black';
                            } else if (selectedQuizOption === opt) {
                              btnStyle = 'bg-rose-600 text-white border-rose-700';
                            } else {
                              btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                            }
                          } else if (selectedQuizOption === opt) {
                            btnStyle = 'bg-green-50 border-green-600 text-green-900 font-bold ring-2 ring-green-600';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectQuizOption(opt)}
                              disabled={isQuizSubmitted}
                              className={`p-4 rounded-2xl border-2 text-left transition-all text-sm font-bold flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isQuizSubmitted && isCorrect && <Check className="w-5 h-5 text-white" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quiz Actions */}
                      <div className="pt-2">
                        {!isQuizSubmitted ? (
                          <button
                            onClick={handleSubmitQuizAnswer}
                            disabled={!selectedQuizOption}
                            className="w-full py-3.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all"
                          >
                            Periksa Jawaban
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuizQuestion}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <span>Lanjut ke Soal Berikutnya &rarr;</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ) : null}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
