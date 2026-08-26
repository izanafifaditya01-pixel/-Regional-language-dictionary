import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Check, 
  Delete, 
  Volume2, 
  HelpCircle,
  BookOpen
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

interface WordleNusantaraGameProps {
  currentLang: Language;
  onAddXp: (amount: number) => void;
  onExit: () => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
];

export const WordleNusantaraGame: React.FC<WordleNusantaraGameProps> = ({
  currentLang,
  onAddXp,
  onExit
}) => {
  const [selectedLangId, setSelectedLangId] = useState<string>(currentLang.id);
  const [targetWordEntry, setTargetWordEntry] = useState<WordEntry | null>(null);
  const [targetWord, setTargetWord] = useState<string>('MANRE');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gamesWonCount, setGamesWonCount] = useState<number>(0);

  // Pool of 5-letter regional words
  const fiveLetterWords = useMemo(() => {
    let pool = DICTIONARY_DATABASE.filter(w => {
      const clean = w.translation.toUpperCase().replace(/[^A-Z]/g, '');
      return clean.length === 5;
    });

    if (selectedLangId !== 'all') {
      const langFiltered = pool.filter(w => w.targetLangId === selectedLangId);
      if (langFiltered.length >= 3) pool = langFiltered;
    }

    if (pool.length === 0) {
      // Fallback
      pool = DICTIONARY_DATABASE.filter(w => w.translation.length >= 4 && w.translation.length <= 6);
    }
    return pool;
  }, [selectedLangId]);

  const startNewGame = useCallback(() => {
    if (fiveLetterWords.length === 0) return;
    const randomPick = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    const cleanWord = randomPick.translation.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);

    setTargetWordEntry(randomPick);
    setTargetWord(cleanWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setErrorMessage(null);
  }, [fiveLetterWords]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length < 5) {
        playErrorSound();
        setErrorMessage('Masukkan 5 huruf!');
        setTimeout(() => setErrorMessage(null), 1200);
        return;
      }

      playTileClickSound();
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      if (currentGuess === targetWord) {
        // WIN!
        playVictorySound();
        setGameStatus('won');
        setGamesWonCount(prev => prev + 1);
        const xp = 60 - newGuesses.length * 5; // 35 to 55 XP
        onAddXp(xp);
      } else if (newGuesses.length >= 6) {
        // LOSS
        playErrorSound();
        setGameStatus('lost');
      }

      setCurrentGuess('');
    } else if (key === 'DEL' || key === 'BACKSPACE') {
      playTileClickSound();
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      playTileClickSound();
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameStatus, guesses, targetWord, onAddXp]);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER') handleKeyPress('ENTER');
      else if (key === 'BACKSPACE') handleKeyPress('DEL');
      else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Letter status for keyboard colors
  const keyStatuses = useMemo(() => {
    const statuses: Record<string, 'correct' | 'present' | 'absent'> = {};

    guesses.forEach(guess => {
      guess.split('').forEach((letter, i) => {
        if (targetWord[i] === letter) {
          statuses[letter] = 'correct';
        } else if (targetWord.includes(letter) && statuses[letter] !== 'correct') {
          statuses[letter] = 'present';
        } else if (!targetWord.includes(letter) && !statuses[letter]) {
          statuses[letter] = 'absent';
        }
      });
    });

    return statuses;
  }, [guesses, targetWord]);

  const handlePlayAudio = () => {
    if (!targetWordEntry) return;
    const targetLangObj = LANGUAGES_DATA.find(l => l.id === targetWordEntry.targetLangId) || currentLang;
    speakWord(targetWordEntry.translation, targetLangObj.code, undefined, targetLangObj.name);
  };

  const langObj = targetWordEntry ? LANGUAGES_DATA.find(l => l.id === targetWordEntry.targetLangId) : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6 max-w-xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-green-900 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-green-700" /> Menang: {gamesWonCount}
          </span>
          <button
            onClick={startNewGame}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
            title="Mulai Game Baru"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Language & Clue Banner */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Bahasa Misteri:</span>
          <span className="px-2.5 py-0.5 bg-green-700 text-white rounded-full text-xs font-bold">
            {langObj?.name || 'Nusantara'}
          </span>
        </div>

        <span className="text-xs font-medium text-slate-500">
          Tebak kata 5 huruf (6 kesempatan)
        </span>
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="p-2 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-center text-xs font-bold animate-shake">
          {errorMessage}
        </div>
      )}

      {/* Wordle 6-Row Grid */}
      <div className="grid grid-rows-6 gap-2 max-w-[280px] sm:max-w-[320px] mx-auto py-2">
        {Array.from({ length: 6 }).map((_, rowIdx) => {
          const guess = guesses[rowIdx];
          const isCurrentRow = rowIdx === guesses.length;

          return (
            <div key={rowIdx} className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, colIdx) => {
                let letter = '';
                let tileStyle = 'border-2 border-slate-200 bg-white text-slate-800';

                if (guess) {
                  letter = guess[colIdx] || '';
                  if (targetWord[colIdx] === letter) {
                    tileStyle = 'bg-emerald-600 border-emerald-700 text-white font-black';
                  } else if (targetWord.includes(letter)) {
                    tileStyle = 'bg-amber-500 border-amber-600 text-white font-black';
                  } else {
                    tileStyle = 'bg-slate-400 border-slate-500 text-white font-bold';
                  }
                } else if (isCurrentRow) {
                  letter = currentGuess[colIdx] || '';
                  if (letter) {
                    tileStyle = 'border-2 border-slate-700 bg-white text-slate-900 font-black scale-105 transition-transform';
                  }
                }

                return (
                  <div
                    key={colIdx}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold uppercase transition-all select-none ${tileStyle}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Result Card (Win / Loss) */}
      {gameStatus !== 'playing' && targetWordEntry && (
        <div className={`p-5 rounded-3xl border text-center space-y-3 animate-in zoom-in-95 duration-200 ${
          gameStatus === 'won'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          <h4 className="text-xl font-black">
            {gameStatus === 'won' ? '🎉 SELAMAT, JAWABAN BENAR!' : '😔 BELUM BERHASIL'}
          </h4>
          <div className="space-y-1">
            <p className="text-xs text-slate-600">Kata misteri adalah:</p>
            <h3 className="text-2xl font-black tracking-wider text-green-800">
              "{targetWordEntry.translation}"
            </h3>
            <p className="text-xs font-bold text-slate-700">
              Artinya: <span className="text-slate-900 font-extrabold">{targetWordEntry.word}</span>
            </p>
            {targetWordEntry.phonetic && (
              <p className="text-[11px] font-mono text-slate-500">
                Cara baca: "{targetWordEntry.phonetic}"
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={handlePlayAudio}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-green-700" />
              <span>Dengarkan Pelafalan</span>
            </button>
            <button
              onClick={startNewGame}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Kata Lain</span>
            </button>
          </div>
        </div>
      )}

      {/* On-Screen Virtual Keyboard */}
      <div className="space-y-1.5 pt-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map(key => {
              const status = keyStatuses[key];
              let keyStyle = 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200';

              if (status === 'correct') {
                keyStyle = 'bg-emerald-600 text-white font-black border-emerald-700';
              } else if (status === 'present') {
                keyStyle = 'bg-amber-500 text-white font-black border-amber-600';
              } else if (status === 'absent') {
                keyStyle = 'bg-slate-300 text-slate-500 opacity-60 border-slate-300';
              }

              const isSpecial = key === 'ENTER' || key === 'DEL';

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`h-11 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 select-none ${
                    isSpecial ? 'px-2.5 sm:px-3 text-[11px] bg-slate-200 text-slate-800 font-extrabold' : 'w-8 sm:w-10'
                  } ${keyStyle}`}
                >
                  {key === 'DEL' ? <Delete className="w-4 h-4" /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
};
