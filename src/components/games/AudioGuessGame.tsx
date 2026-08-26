import React, { useState, useEffect, useMemo } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Check, 
  X, 
  Play, 
  Headphones,
  ChevronRight
} from 'lucide-react';
import { WordEntry, Language } from '../../types';
import { DICTIONARY_DATABASE } from '../../data/dictionaryDatabase';
import { LANGUAGES_DATA } from '../../data/languagesData';
import { 
  playSuccessSound, 
  playErrorSound, 
  playVictorySound 
} from '../../utils/soundEffects';
import { speakWord } from '../../utils/audioSpeech';

interface AudioGuessGameProps {
  currentLang: Language;
  onAddXp: (amount: number) => void;
  onExit: () => void;
}

export const AudioGuessGame: React.FC<AudioGuessGameProps> = ({
  currentLang,
  onAddXp,
  onExit
}) => {
  const [selectedLangId, setSelectedLangId] = useState<string>(currentLang.id);
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Pool of words
  const questionPool = useMemo(() => {
    let pool = DICTIONARY_DATABASE;
    if (selectedLangId !== 'all') {
      pool = DICTIONARY_DATABASE.filter(w => w.targetLangId === selectedLangId);
    }
    if (pool.length < 6) pool = DICTIONARY_DATABASE;
    return [...pool].sort(() => 0.5 - Math.random());
  }, [selectedLangId]);

  const currentWord: WordEntry | undefined = questionPool[questionIdx % questionPool.length];

  // Options: 1 correct + 3 wrong options
  const options = useMemo(() => {
    if (!currentWord) return [];
    const correct = currentWord.word; // Guess Indonesian meaning
    const others = questionPool
      .filter(w => w.word !== correct)
      .map(w => w.word);
    const shuffledOthers = [...new Set(others)].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [currentWord, questionPool]);

  const handlePlayVoice = (text?: string, langId?: string) => {
    const wordText = text || currentWord?.translation;
    if (!wordText || !currentWord) return;

    const targetLangObj = LANGUAGES_DATA.find(l => l.id === (langId || currentWord.targetLangId)) || currentLang;
    setIsPlayingAudio(true);
    speakWord(wordText, targetLangObj.code, () => {
      setIsPlayingAudio(false);
    }, targetLangObj.name);
  };

  // Auto play on new question
  useEffect(() => {
    if (currentWord) {
      setIsAnswered(false);
      setSelectedAnswer(null);
      const timer = setTimeout(() => {
        handlePlayVoice();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [questionIdx, selectedLangId]);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentWord) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentWord.word;

    if (isCorrect) {
      playSuccessSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const pts = 20 + newStreak * 5;
      setScore(prev => prev + pts);
      onAddXp(20);
    } else {
      playErrorSound();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setQuestionIdx(prev => prev + 1);
  };

  const langObj = currentWord ? LANGUAGES_DATA.find(l => l.id === currentWord.targetLangId) : null;

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

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-green-900 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-green-700" /> Skor: {score}
          </span>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            🔥 Streak: {streak}
          </span>
        </div>
      </div>

      {/* Language Filter */}
      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Headphones className="w-4 h-4 text-green-700" />
          <span>Uji Pendengaran Dialek:</span>
        </span>

        <select
          value={selectedLangId}
          onChange={e => { setSelectedLangId(e.target.value); setQuestionIdx(0); }}
          className="bg-white text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="all">Semua Bahasa Daerah</option>
          {LANGUAGES_DATA.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {currentWord && (
        <div className="space-y-6">
          
          {/* Big Interactive Audio Speaker Box */}
          <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white p-6 sm:p-8 rounded-3xl text-center space-y-4 relative overflow-hidden shadow-lg">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full">
              Bahasa: {langObj?.name || 'Nusantara'}
            </span>

            <div className="py-2">
              <button
                onClick={() => handlePlayVoice()}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-950 scale-110 ring-8 ring-amber-400/30'
                    : 'bg-green-700 hover:bg-green-600 text-white hover:scale-105'
                }`}
                title="Klik untuk Mendengarkan Ulang"
              >
                <Volume2 className={`w-10 h-10 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-amber-300">
                "{currentWord.translation}"
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                Pelafalan fonetik: "{currentWord.phonetic}"
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Sentuh ikon speaker di atas untuk memutar suara kembali
              </p>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="text-center space-y-1">
            <h4 className="text-base font-extrabold text-slate-900">
              Apa arti kata yang Anda dengar dalam Bahasa Indonesia?
            </h4>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isCorrectAnswer = opt === currentWord.word;
              let style = 'bg-white border-slate-200 hover:border-green-400 text-slate-800';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-600 text-white border-emerald-700 font-black shadow-md';
                } else if (selectedAnswer === opt) {
                  style = 'bg-rose-600 text-white border-rose-700 shadow-md';
                } else {
                  style = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectAnswer && <Check className="w-5 h-5 text-white" />}
                  {isAnswered && selectedAnswer === opt && !isCorrectAnswer && <X className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Info & Next Button */}
          {isAnswered && (
            <div className="space-y-3 animate-in zoom-in-95 duration-150">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-slate-800">
                  💡 Contoh Penggunaan dalam {langObj?.name}:
                </p>
                <p className="italic text-slate-600">
                  "{currentWord.exampleSentence}" ({currentWord.exampleTranslation})
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
