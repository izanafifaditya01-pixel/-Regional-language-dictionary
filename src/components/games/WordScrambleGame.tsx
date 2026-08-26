import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shuffle, 
  RotateCcw, 
  Volume2, 
  Lightbulb, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Trophy, 
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { WordEntry, Language } from '../../types';
import { DICTIONARY_DATABASE } from '../../data/dictionaryDatabase';
import { LANGUAGES_DATA } from '../../data/languagesData';
import { 
  playSuccessSound, 
  playErrorSound, 
  playTileClickSound, 
  playVictorySound 
} from '../../utils/soundEffects';
import { speakWord } from '../../utils/audioSpeech';

interface WordScrambleGameProps {
  currentLang: Language;
  onAddXp: (amount: number) => void;
  onExit: () => void;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  currentLang,
  onAddXp,
  onExit
}) => {
  const [selectedLangId, setSelectedLangId] = useState<string>(currentLang.id);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [roundIdx, setRoundIdx] = useState<number>(0);
  const [placedLetters, setPlacedLetters] = useState<{ id: string; letter: string }[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; letter: string; isUsed: boolean }[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [solvedWordsCount, setSolvedWordsCount] = useState<number>(0);

  // Filter words suitable for scrambling (clean letters, length >= 3)
  const candidateWords = useMemo(() => {
    let pool = DICTIONARY_DATABASE;
    if (selectedLangId !== 'all') {
      pool = DICTIONARY_DATABASE.filter(w => w.targetLangId === selectedLangId);
    }
    if (pool.length < 5) pool = DICTIONARY_DATABASE;

    // Filter by difficulty length
    let filtered = pool.filter(w => {
      const cleanLen = w.translation.replace(/[^a-zA-Z]/g, '').length;
      if (difficulty === 'easy') return cleanLen >= 3 && cleanLen <= 5;
      if (difficulty === 'medium') return cleanLen >= 5 && cleanLen <= 7;
      return cleanLen >= 7;
    });

    if (filtered.length === 0) filtered = pool;
    return [...filtered].sort(() => 0.5 - Math.random());
  }, [selectedLangId, difficulty]);

  const currentWord: WordEntry | undefined = candidateWords[roundIdx % candidateWords.length];

  // Initialize letters for current word
  useEffect(() => {
    if (!currentWord) return;

    const rawWord = currentWord.translation.toUpperCase();
    const cleanLetters = rawWord.split('').filter(char => /[A-Z]/.test(char));
    
    // Shuffle tiles
    const tilesWithId = cleanLetters.map((letter, idx) => ({
      id: `tile-${idx}-${letter}`,
      letter,
      isUsed: false
    }));

    // Ensure it is scrambled (not already solved)
    let shuffled = [...tilesWithId].sort(() => 0.5 - Math.random());
    if (shuffled.map(t => t.letter).join('') === cleanLetters.join('') && cleanLetters.length > 2) {
      shuffled = [...tilesWithId].reverse();
    }

    setAvailableTiles(shuffled);
    setPlacedLetters([]);
    setShowHint(false);
    setIsCompleted(false);
    setIsError(false);
  }, [currentWord, roundIdx]);

  const handleTileClick = (tileId: string) => {
    if (isCompleted) return;
    const tile = availableTiles.find(t => t.id === tileId);
    if (!tile || tile.isUsed) return;

    playTileClickSound();

    // Mark as used
    setAvailableTiles(prev =>
      prev.map(t => (t.id === tileId ? { ...t, isUsed: true } : t))
    );
    // Add to placed
    setPlacedLetters(prev => [...prev, { id: tile.id, letter: tile.letter }]);
  };

  const handleRemovePlaced = (index: number) => {
    if (isCompleted) return;
    playTileClickSound();

    const removed = placedLetters[index];
    if (!removed) return;

    // Restore to available
    setAvailableTiles(prev =>
      prev.map(t => (t.id === removed.id ? { ...t, isUsed: false } : t))
    );
    // Remove from placed
    setPlacedLetters(prev => prev.filter((_, i) => i !== index));
    setIsError(false);
  };

  const handleResetSlots = () => {
    playTileClickSound();
    setAvailableTiles(prev => prev.map(t => ({ ...t, isUsed: false })));
    setPlacedLetters([]);
    setIsError(false);
  };

  const handleShuffleTiles = () => {
    playTileClickSound();
    setAvailableTiles(prev => [...prev].sort(() => 0.5 - Math.random()));
  };

  const handleCheckAnswer = () => {
    if (!currentWord || isCompleted) return;

    const userWord = placedLetters.map(p => p.letter).join('');
    const targetWord = currentWord.translation.toUpperCase().replace(/[^A-Z]/g, '');

    if (userWord === targetWord) {
      playSuccessSound();
      setIsCompleted(true);
      setIsError(false);
      const points = difficulty === 'hard' ? 40 : difficulty === 'medium' ? 25 : 15;
      setScore(prev => prev + points);
      setSolvedWordsCount(prev => prev + 1);
      onAddXp(points);
    } else {
      playErrorSound();
      setIsError(true);
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleNextWord = () => {
    setRoundIdx(prev => prev + 1);
  };

  const handlePlayAudio = () => {
    if (!currentWord) return;
    const targetLangObj = LANGUAGES_DATA.find(l => l.id === currentWord.targetLangId) || currentLang;
    speakWord(currentWord.translation, targetLangObj.code, undefined, targetLangObj.name);
  };

  const langObj = currentWord ? LANGUAGES_DATA.find(l => l.id === currentWord.targetLangId) : null;
  const isFullAnswerPlaced = currentWord && placedLetters.length === currentWord.translation.replace(/[^a-zA-Z]/g, '').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Arcade</span>
        </button>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-green-900 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-green-700" /> {solvedWordsCount} Kata Disusun
          </span>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {score} Poin
          </span>
        </div>
      </div>

      {/* Difficulty & Language Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Tingkat:</span>
          {(['easy', 'medium', 'hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => { setDifficulty(diff); setRoundIdx(0); }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                difficulty === diff
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {diff === 'easy' ? 'Mudah (3-5)' : diff === 'medium' ? 'Sedang (6-7)' : 'Ahli (8+)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <select
            value={selectedLangId}
            onChange={e => { setSelectedLangId(e.target.value); setRoundIdx(0); }}
            className="bg-white text-slate-800 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="all">Semua Bahasa</option>
            {LANGUAGES_DATA.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {currentWord && (
        <div className="space-y-6">
          
          {/* Question / Target Meaning Card */}
          <div className="bg-gradient-to-br from-green-900 to-emerald-950 text-white p-6 sm:p-7 rounded-3xl text-center space-y-3 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full">
                {langObj?.name || 'Bahasa Daerah'}
              </span>
              <span className="text-xs px-2.5 py-0.5 bg-white/10 rounded-full font-medium text-emerald-200">
                {currentWord.category}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Arti Bahasa Indonesia:
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                "{currentWord.word}"
              </h3>
            </div>

            {/* Hint Box (Optional) */}
            {showHint ? (
              <div className="bg-black/30 p-3 rounded-2xl max-w-md mx-auto text-xs text-emerald-200 space-y-1 animate-in fade-in">
                <p>💡 Fonetik: <strong>"{currentWord.phonetic}"</strong></p>
                {currentWord.exampleSentence && (
                  <p className="italic opacity-80">"{currentWord.exampleSentence}"</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1 text-xs text-amber-300/90 hover:text-amber-200 font-bold underline cursor-pointer pt-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Buka Petunjuk Fonetik (-0 Poin)</span>
              </button>
            )}
          </div>

          {/* Answer Placed Slots Area */}
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-slate-500">
              Susunan Huruf Anda: (Sentuh untuk membatalkan)
            </span>
            
            <div className={`min-h-[64px] p-3 bg-slate-50 border-2 rounded-2xl flex flex-wrap items-center justify-center gap-2 transition-all ${
              isCompleted
                ? 'border-emerald-500 bg-emerald-50'
                : isError
                ? 'border-rose-400 bg-rose-50 animate-shake'
                : 'border-dashed border-slate-300'
            }`}>
              {placedLetters.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium">
                  Sentuh huruf di bawah untuk menyusun kata...
                </span>
              ) : (
                placedLetters.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => handleRemovePlaced(idx)}
                    className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl font-black text-lg sm:text-xl flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                  >
                    {item.letter}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Letter Bank (Available Tiles) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Pilihan Huruf Acak:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShuffleTiles}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Acak Posisi Huruf"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Acak Ulang</span>
                </button>
                <button
                  onClick={handleResetSlots}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Semua Huruf"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200">
              {availableTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  disabled={tile.isUsed || isCompleted}
                  className={`w-12 h-13 sm:w-14 sm:h-15 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    tile.isUsed
                      ? 'bg-slate-200/60 text-slate-400 border border-slate-200 opacity-40 cursor-not-allowed'
                      : 'bg-white text-slate-900 border-2 border-slate-300 hover:border-green-600 hover:bg-green-50 shadow-xs hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {tile.letter}
                </button>
              ))}
            </div>
          </div>

          {/* Action & Check Buttons */}
          <div className="pt-2">
            {!isCompleted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!isFullAnswerPlaced}
                className="w-full py-4 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Periksa Susunan Kata</span>
              </button>
            ) : (
              <div className="space-y-3 animate-in zoom-in-95 duration-150">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-emerald-900 text-sm sm:text-base">
                        Luar Biasa! Kata Tepat: "{currentWord.translation}"
                      </h4>
                      <p className="text-xs text-emerald-700">+{difficulty === 'hard' ? 40 : difficulty === 'medium' ? 25 : 15} XP ditambahkan ke profil Anda</p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlayAudio}
                    className="p-2.5 bg-emerald-200 hover:bg-emerald-300 text-emerald-900 rounded-xl transition-colors cursor-pointer"
                    title="Dengarkan Suara"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleNextWord}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Kata Berikutnya</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
