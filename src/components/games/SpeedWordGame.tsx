import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Timer, 
  Flame, 
  Trophy, 
  RotateCcw, 
  Volume2, 
  Check, 
  X, 
  ArrowLeft, 
  Sparkles, 
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { WordEntry, Language } from '../../types';
import { DICTIONARY_DATABASE } from '../../data/dictionaryDatabase';
import { LANGUAGES_DATA } from '../../data/languagesData';
import { 
  playSuccessSound, 
  playErrorSound, 
  playComboSound, 
  playVictorySound, 
  playTickSound 
} from '../../utils/soundEffects';
import { speakWord } from '../../utils/audioSpeech';

interface SpeedWordGameProps {
  currentLang: Language;
  onAddXp: (amount: number) => void;
  onRecordHighScore: (score: number) => void;
  highScore: number;
  onExit: () => void;
}

export const SpeedWordGame: React.FC<SpeedWordGameProps> = ({
  currentLang,
  onAddXp,
  onRecordHighScore,
  highScore,
  onExit
}) => {
  const [selectedLangId, setSelectedLangId] = useState<string>(currentLang.id);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [comboAnimation, setComboAnimation] = useState<boolean>(false);

  // Pool of available words
  const wordPool = useMemo(() => {
    let pool = DICTIONARY_DATABASE;
    if (selectedLangId !== 'all') {
      pool = DICTIONARY_DATABASE.filter(w => w.targetLangId === selectedLangId);
    }
    if (pool.length < 8) {
      pool = DICTIONARY_DATABASE; // fallback to all
    }
    return [...pool].sort(() => 0.5 - Math.random());
  }, [selectedLangId]);

  const activeWord: WordEntry | undefined = wordPool[currentWordIdx % wordPool.length];

  // Options for current question
  const currentOptions = useMemo(() => {
    if (!activeWord) return [];
    const correct = activeWord.translation;
    const others = wordPool
      .filter(w => w.translation !== correct)
      .map(w => w.translation);
    const shuffledOthers = [...new Set(others)].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [activeWord, wordPool]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 5 && prev > 1) {
            playTickSound();
          }
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStartGame = () => {
    setGameState('playing');
    setTimeLeft(45);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentWordIdx(0);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleGameOver = () => {
    setGameState('gameover');
    playVictorySound();
    onRecordHighScore(score);
    // Reward XP based on score (e.g. 1 XP per 10 points + completion bonus)
    const earnedXp = Math.max(15, Math.floor(score / 8) + 20);
    onAddXp(earnedXp);
  };

  const handleSelectOption = (option: string) => {
    if (feedback !== null || gameState !== 'playing' || !activeWord) return;

    setSelectedAnswer(option);
    const isCorrect = option === activeWord.translation;

    if (isCorrect) {
      playSuccessSound();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Play combo sound if combo is high
      if (newCombo >= 3) {
        playComboSound(newCombo);
        setComboAnimation(true);
        setTimeout(() => setComboAnimation(false), 500);
      }

      // Combo multiplier: 1x, 2x (3+ combo), 3x (5+ combo), 4x (8+ combo)
      const multiplier = newCombo >= 8 ? 4 : newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1;
      const points = 50 * multiplier;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setFeedback('correct');

      // Small time bonus for rapid streaks
      if (newCombo % 5 === 0) {
        setTimeLeft(prev => Math.min(60, prev + 3));
      }
    } else {
      playErrorSound();
      setCombo(0);
      setWrongCount(prev => prev + 1);
      setFeedback('wrong');
    }

    // Move to next word after brief pause
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      setCurrentWordIdx(prev => prev + 1);
    }, 450);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeWord) return;
    const targetLangObj = LANGUAGES_DATA.find(l => l.id === activeWord.targetLangId) || currentLang;
    speakWord(activeWord.translation, targetLangObj.code, undefined, targetLangObj.name);
  };

  const langObj = activeWord ? LANGUAGES_DATA.find(l => l.id === activeWord.targetLangId) : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" /> Rekor: {highScore}
          </span>
        </div>
      </div>

      {gameState === 'ready' && (
        <div className="text-center py-8 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-orange-100 animate-bounce">
            <Zap className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Sambung Kata Kilat (Speed Match)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Jawab sebanyak mungkin kosakata daerah dalam <strong>45 detik</strong>. Pertahankan streak untuk melipatgandakan poin combo hingga <strong>4x</strong>!
            </p>
          </div>

          {/* Language Selector Filter */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500">Pilih Bahasa Sasaran:</span>
            <select
              value={selectedLangId}
              onChange={e => setSelectedLangId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="all">Semua Bahasa Nusantara (Campuran)</option>
              {LANGUAGES_DATA.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.flagEmoji})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-900 text-white font-extrabold text-base rounded-2xl shadow-md shadow-green-200 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              <span>Mulai Tantangan Kilat (45s)</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && activeWord && (
        <div className="space-y-5">
          {/* Game Stats Bar: Timer, Score, Combo */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Timer className="w-3 h-3 text-slate-400" /> Waktu
              </span>
              <span className={`text-xl font-black ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Skor
              </span>
              <span className="text-xl font-black text-green-800">
                {score}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> Combo
              </span>
              <span className={`text-xl font-black flex items-center gap-1 ${
                combo >= 5 ? 'text-orange-600 scale-110 transition-transform' : combo >= 3 ? 'text-amber-600' : 'text-slate-700'
              }`}>
                {combo}x {combo >= 3 && '🔥'}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden shadow-lg space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-xs">
                {langObj?.name || 'Bahasa Daerah'}
              </span>
              <span className="text-xs px-2.5 py-0.5 bg-white/10 rounded-full font-medium text-slate-300">
                {activeWord.category}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">
                Apa terjemahan bahasa daerah dari:
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-wide">
                "{activeWord.word}"
              </h3>
            </div>

            {activeWord.exampleSentence && (
              <p className="text-[11px] text-slate-300 italic opacity-80 max-w-md mx-auto">
                Konteks: "{activeWord.exampleTranslation || activeWord.exampleSentence}"
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentOptions.map((opt, idx) => {
              const isCorrectAnswer = opt === activeWord.translation;
              let style = 'bg-white border-slate-200 hover:border-green-300 hover:bg-green-50/50 text-slate-800';

              if (feedback !== null) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-600 text-white border-emerald-700 font-black shadow-md scale-102';
                } else if (selectedAnswer === opt) {
                  style = 'bg-rose-600 text-white border-rose-700 shadow-md';
                } else {
                  style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={feedback !== null}
                  className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {feedback !== null && isCorrectAnswer && <Check className="w-5 h-5 text-white" />}
                  {feedback !== null && selectedAnswer === opt && !isCorrectAnswer && <X className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Tantangan Selesai!
            </span>
            <h3 className="text-3xl font-black text-slate-900 pt-2">
              Skor Akhir: <span className="text-green-800">{score}</span>
            </h3>
            {score > highScore && (
              <p className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" /> REKOR BARU TERCAPAI!
              </p>
            )}
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Benar</span>
              <p className="text-lg font-black text-emerald-700">{correctCount}</p>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Salah</span>
              <p className="text-lg font-black text-rose-600">{wrongCount}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Max Combo</span>
              <p className="text-lg font-black text-orange-600">{maxCombo}x</p>
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-xs font-bold text-green-900 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-green-700" />
            <span>Bonus Diperoleh: +{Math.max(15, Math.floor(score / 8) + 20)} XP</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              Kembali ke Menu Game
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
