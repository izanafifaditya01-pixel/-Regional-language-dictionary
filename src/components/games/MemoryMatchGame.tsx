import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Timer, 
  Award, 
  Star, 
  Check, 
  Volume2,
  Layers
} from 'lucide-react';
import { WordEntry, Language } from '../../types';
import { DICTIONARY_DATABASE } from '../../data/dictionaryDatabase';
import { LANGUAGES_DATA } from '../../data/languagesData';
import { 
  playCardFlipSound, 
  playSuccessSound, 
  playVictorySound 
} from '../../utils/soundEffects';
import { speakWord } from '../../utils/audioSpeech';

interface MemoryCard {
  id: string;
  pairId: string;
  type: 'word' | 'translation';
  text: string;
  phonetic?: string;
  langId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  currentLang: Language;
  onAddXp: (amount: number) => void;
  onExit: () => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  currentLang,
  onAddXp,
  onExit
}) => {
  const [selectedLangId, setSelectedLangId] = useState<string>(currentLang.id);
  const [gridSize, setGridSize] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const numPairs = gridSize === 'easy' ? 3 : gridSize === 'medium' ? 6 : 8;

  // Initialize Cards
  const startNewGame = () => {
    let pool = DICTIONARY_DATABASE;
    if (selectedLangId !== 'all') {
      pool = DICTIONARY_DATABASE.filter(w => w.targetLangId === selectedLangId);
    }
    if (pool.length < numPairs) pool = DICTIONARY_DATABASE;

    // Pick distinct words
    const selectedWords = [...pool]
      .sort(() => 0.5 - Math.random())
      .slice(0, numPairs);

    const generatedCards: MemoryCard[] = [];

    selectedWords.forEach((word, idx) => {
      // Regional Dialect Card
      generatedCards.push({
        id: `card-${idx}-reg`,
        pairId: word.id,
        type: 'translation',
        text: word.translation,
        phonetic: word.phonetic,
        langId: word.targetLangId,
        isFlipped: false,
        isMatched: false
      });

      // Indonesian Meaning Card
      generatedCards.push({
        id: `card-${idx}-ind`,
        pairId: word.id,
        type: 'word',
        text: word.word,
        langId: 'ind',
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle all cards
    setCards(generatedCards.sort(() => 0.5 - Math.random()));
    setFlippedCardIds([]);
    setMatchedPairsCount(0);
    setMovesCount(0);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setIsGameOver(false);
  };

  useEffect(() => {
    startNewGame();
  }, [selectedLangId, gridSize]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !isGameOver) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver]);

  const handleCardClick = (cardId: string) => {
    if (isGameOver || flippedCardIds.length >= 2) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    playCardFlipSound();

    // Flip card
    const updatedCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);

    if (newFlipped.length === 2) {
      setMovesCount(prev => prev + 1);
      const card1 = updatedCards.find(c => c.id === newFlipped[0])!;
      const card2 = updatedCards.find(c => c.id === newFlipped[1])!;

      if (card1.pairId === card2.pairId) {
        // MATCH!
        playSuccessSound();
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === card1.id || c.id === card2.id
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedCardIds([]);
          setMatchedPairsCount(prev => {
            const nextCount = prev + 1;
            if (nextCount === numPairs) {
              handleGameWin();
            }
            return nextCount;
          });
        }, 350);
      } else {
        // NO MATCH -> Flip back after delay
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === card1.id || c.id === card2.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCardIds([]);
        }, 900);
      }
    }
  };

  const handleGameWin = () => {
    setIsGameOver(true);
    setIsTimerRunning(false);
    playVictorySound();
    const xp = gridSize === 'hard' ? 50 : gridSize === 'medium' ? 30 : 15;
    onAddXp(xp);
  };

  // Calculate stars
  const stars = useMemo(() => {
    const minMoves = numPairs;
    if (movesCount <= minMoves + 2) return 3;
    if (movesCount <= minMoves + 6) return 2;
    return 1;
  }, [movesCount, numPairs]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Arcade</span>
        </button>

        {/* Stats Row */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-slate-500" />
            {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-xs font-bold text-green-800 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            Langkah: {movesCount}
          </span>
        </div>
      </div>

      {/* Grid Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Ukuran:</span>
          {[
            { id: 'easy', label: 'Santai (6 Kartu)' },
            { id: 'medium', label: 'Standar (12 Kartu)' },
            { id: 'hard', label: 'Master (16 Kartu)' }
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setGridSize(g.id as any)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                gridSize === g.id
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <button
          onClick={startNewGame}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kocok Ulang</span>
        </button>
      </div>

      {/* Card Grid */}
      <div className={`grid gap-3 sm:gap-4 ${
        gridSize === 'easy'
          ? 'grid-cols-2 sm:grid-cols-3'
          : gridSize === 'medium'
          ? 'grid-cols-3 sm:grid-cols-4'
          : 'grid-cols-4'
      }`}>
        {cards.map(card => {
          const isFlippedOrMatched = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`min-h-[105px] sm:min-h-[120px] rounded-2xl p-3 sm:p-4 text-center flex flex-col items-center justify-center transition-all duration-300 transform select-none cursor-pointer ${
                card.isMatched
                  ? 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-md scale-98 opacity-90'
                  : isFlippedOrMatched
                  ? card.type === 'translation'
                    ? 'bg-gradient-to-br from-amber-50 to-green-50 border-2 border-amber-400 text-slate-900 shadow-md'
                    : 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200/80 border-2 border-slate-300 hover:border-green-400 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              {!isFlippedOrMatched ? (
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center mx-auto text-green-700 font-black text-xs shadow-2xs">
                    LN
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Buka
                  </span>
                </div>
              ) : (
                <div className="space-y-1 animate-in zoom-in-95 duration-150">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    card.isMatched
                      ? 'bg-white/20 text-white'
                      : card.type === 'translation'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {card.type === 'translation' ? 'Bahasa Daerah' : 'Bahasa Indonesia'}
                  </span>

                  <h4 className="font-black text-sm sm:text-base leading-tight">
                    {card.text}
                  </h4>

                  {card.phonetic && (
                    <p className="text-[10px] font-mono opacity-80 line-clamp-1">
                      "{card.phonetic}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Win Celebration Modal */}
      {isGameOver && (
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl border border-green-300 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3].map(i => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i <= stars ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Hebat! Semua Pasangan Cocok!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Selesai dalam <strong>{movesCount} langkah</strong> ({secondsElapsed} detik).
            </p>
          </div>

          <div className="p-3 bg-white/80 border border-green-200 rounded-2xl text-xs font-bold text-green-900 max-w-xs mx-auto flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-green-700" />
            <span>Bonus Didapatkan: +{gridSize === 'hard' ? 50 : gridSize === 'medium' ? 30 : 15} XP</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
