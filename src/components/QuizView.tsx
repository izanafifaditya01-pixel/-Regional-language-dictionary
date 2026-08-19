import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, CheckCircle2, XCircle, RotateCcw, Trophy, Award, Zap, HelpCircle, Volume2, Shuffle, Languages } from 'lucide-react';
import { QuizQuestion, Language } from '../types';
import { generateRandomQuiz } from '../utils/quizGenerator';
import { speakWord } from '../utils/audioSpeech';
import { LANGUAGES_DATA } from '../data/languagesData';

interface QuizViewProps {
  targetLang: Language;
  onAddXp: (amount: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ targetLang, onAddXp }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedLanguageScope, setSelectedLanguageScope] = useState<string>(targetLang.id);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scrambleLettersInput, setScrambleLettersInput] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Initialize randomized questions on difficulty or language scope change
  useEffect(() => {
    loadFreshRandomQuiz(difficulty, selectedLanguageScope);
  }, [difficulty, selectedLanguageScope]);

  const loadFreshRandomQuiz = (diff: 'easy' | 'medium' | 'hard', langId: string) => {
    const randomSet = generateRandomQuiz(diff, langId, 6);
    setQuestions(randomSet);
    setCurrentQuestionIdx(0);
    setScore(0);
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setScrambleLettersInput([]);
    setQuizFinished(false);
  };

  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleScrambleLetterClick = (letter: string, index: number) => {
    if (isSubmitted) return;
    setScrambleLettersInput(prev => [...prev, letter]);
  };

  const handleScrambleRemoveLetter = (index: number) => {
    if (isSubmitted) return;
    setScrambleLettersInput(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || isSubmitted) return;

    let userAns = selectedOption || scrambleLettersInput.join('');
    let correct = false;

    if (currentQ.type === 'mcq' || currentQ.type === 'fill_blank' || currentQ.type === 'guess') {
      correct = userAns.toLowerCase().trim() === currentQ.translation.toLowerCase().trim() ||
                userAns.toLowerCase().trim() === currentQ.word.toLowerCase().trim();
    } else if (currentQ.type === 'scramble') {
      correct = userAns.replace(/\s+/g, '').toLowerCase() === currentQ.word.replace(/\s+/g, '').toLowerCase();
    }

    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setScrambleLettersInput([]);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      const earnedXp = Math.max(20, score * 25 + 20);
      onAddXp(earnedXp);
    }
  };

  const handleRestartQuiz = () => {
    loadFreshRandomQuiz(difficulty, selectedLanguageScope);
  };

  return (
    <div className="space-y-6">
      
      {/* Quiz Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-green-50 rounded-full opacity-60 pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold">
            <BrainCircuit className="w-4 h-4 text-green-700" />
            <span>Kuis Bahasa Daerah Interaktif</span>
          </div>
          <span className="text-xs text-green-800 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            Bonus XP & Lencana
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Arena Kuis Leksika Nusantara</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
          Uji pemahaman kosakata, susun huruf kata daerah, dan isi kata yang kosong untuk menaikkan level & meraih badge prestasi.
        </p>

        {/* Controls: Difficulty & Language Scope & Shuffle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">Tingkat Kesulitan:</span>
            {(['easy', 'medium', 'hard'] as const).map(level => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                }}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  difficulty === level
                    ? 'pill-active shadow-xs'
                    : 'pill-inactive border border-slate-200 hover:bg-slate-200/80'
                }`}
              >
                {level === 'easy' ? 'Mudah' : level === 'medium' ? 'Sedang' : 'Sulit'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLanguageScope}
              onChange={e => setSelectedLanguageScope(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">🌏 Semua Bahasa Nusantara</option>
              {LANGUAGES_DATA.filter(l => l.id !== 'ind').map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.flagEmoji} {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleRestartQuiz}
              className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Acak pertanyaan kuis baru"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Soal Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Card View */}
      {!quizFinished && currentQ ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          
          {/* Question Header & Progress Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pertanyaan {currentQuestionIdx + 1} dari {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                Skor: {score}
              </span>
            </div>
          </div>

          {/* Question Text & Audio Voice Button */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
              <button
                onClick={() => {
                  setIsPlayingAudio(true);
                  speakWord(currentQ.translation || currentQ.word, targetLang.code, () => {
                    setIsPlayingAudio(false);
                  }, targetLang.name);
                }}
                className={`p-2.5 rounded-2xl shrink-0 ${
                  isPlayingAudio ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-green-700 text-white hover:bg-green-800'
                } transition-all shadow-xs cursor-pointer`}
                title="Dengarkan Pelafalan Voice AI"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            {currentQ.contextSentence && (
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 italic font-medium">
                "{currentQ.contextSentence}"
              </p>
            )}
          </div>

          {/* Option Types Rendering */}
          {currentQ.type === 'mcq' || currentQ.type === 'fill_blank' || currentQ.type === 'guess' ? (
            /* MCQ / Fill Blank Options Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let optStyle = 'bg-slate-50 border-slate-200/80 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/50';

                if (isSubmitted) {
                  if (opt.toLowerCase().trim() === currentQ.translation.toLowerCase().trim() ||
                      opt.toLowerCase().trim() === currentQ.word.toLowerCase().trim()) {
                    optStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-500/30';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-emerald-700 border-emerald-800 text-white font-bold shadow-md';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isSubmitted}
                    className={`p-4 rounded-2xl border text-left text-sm transition-all font-medium flex items-center justify-between cursor-pointer ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {isSelected && !isSubmitted && <Zap className="w-4 h-4 text-amber-300" />}
                  </button>
                );
              })}
            </div>
          ) : currentQ.type === 'scramble' ? (
            /* Word Scramble Letters Arena */
            <div className="space-y-4">
              <div className="min-h-[60px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-wrap gap-2 items-center justify-center">
                {scrambleLettersInput.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium">Klik huruf di bawah ini untuk menyusun kata</span>
                ) : (
                  scrambleLettersInput.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleScrambleRemoveLetter(idx)}
                      className="px-3.5 py-2 bg-emerald-700 text-white font-black text-sm rounded-xl shadow-xs"
                    >
                      {letter}
                    </button>
                  ))
                )}
              </div>

              {/* Letters Pool */}
              <div className="flex flex-wrap gap-2 justify-center">
                {currentQ.scrambleLetters?.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleScrambleLetterClick(letter, idx)}
                    disabled={isSubmitted}
                    className="w-10 h-10 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl font-bold text-sm shadow-2xs hover:scale-105 transition-all cursor-pointer"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Explanation Alert Box after submission */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1 animate-in fade-in duration-200 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Jawaban Tepat! (+25 XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Jawaban Kurang Tepat</span>
                  </>
                )}
              </div>
              <p className="font-medium pt-1">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Submit / Next Button */}
          <div className="pt-2 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption && scrambleLettersInput.length === 0}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
              >
                Jawab Pertanyaan
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{currentQuestionIdx < questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'}</span>
              </button>
            )}
          </div>

        </div>
      ) : quizFinished ? (
        /* Quiz Finished Screen */
        <div className="bg-white p-8 sm:p-12 text-center rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Kuis Selesai!</h3>
            <p className="text-sm text-slate-600 font-medium">
              Kamu berhasil menyelesaikan kuis tingkat <span className="font-bold uppercase text-emerald-700">{difficulty}</span>
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-around text-center">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Skor Kamu</span>
              <span className="text-2xl font-black text-emerald-900">{score} / {questions.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Akurasi</span>
              <span className="text-2xl font-black text-amber-600">
                {Math.round((score / Math.max(1, questions.length)) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">XP Diperoleh</span>
              <span className="text-2xl font-black text-emerald-700">+{Math.max(20, score * 25 + 20)}</span>
            </div>
          </div>

          <button
            onClick={handleRestartQuiz}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Kuis Lagi</span>
          </button>
        </div>
      ) : null}

    </div>
  );
};
