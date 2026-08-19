import React from 'react';
import { Sparkles, Volume2, ArrowRightLeft, Search, Compass, BookOpenCheck } from 'lucide-react';
import { WordEntry, Language } from '../types';
import { speakWord } from '../utils/audioSpeech';

interface HeroSectionProps {
  wordOfTheDay: WordEntry;
  sourceLang: Language;
  targetLang: Language;
  onSwapLanguages: () => void;
  onOpenLanguageModal: (type: 'source' | 'target') => void;
  onSelectWordDetail: (word: WordEntry) => void;
  onQuickSearchSelect: (langId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  wordOfTheDay,
  sourceLang,
  targetLang,
  onSwapLanguages,
  onOpenLanguageModal,
  onSelectWordDetail,
  onQuickSearchSelect
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakWord(wordOfTheDay.translation, targetLang.code, () => {
      setIsPlayingAudio(false);
    }, targetLang.name);
  };

  return (
    <section className="bg-slate-50 text-slate-800 pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Title & Mission */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-green-700" />
              <span>Kamus & Edukasi Bahasa Daerah Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Lestarikan & Pelajari <br className="hidden sm:inline" />
              <span className="text-green-700">
                Bahasa Nusantara
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
              Kamus digital terjemahan Bahasa Indonesia ke Bugis, Jawa, Sunda, Bali, Makassar, Minang, Aceh, Batak, Banjar, dan puluhan bahasa daerah lainnya disertai audio pelafalan & tutor AI.
            </p>

            {/* Language Selector Bar Component */}
            <div className="pt-1">
              <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-sm max-w-xl">
                <div className="flex items-center justify-between gap-2">
                  
                  {/* Source Language Button */}
                  <button
                    onClick={() => onOpenLanguageModal('source')}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 p-2.5 sm:p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-left transition-all cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bahasa Asal</span>
                      <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <span>{sourceLang.flagEmoji}</span>
                        <span className="truncate">{sourceLang.name}</span>
                      </span>
                    </div>
                  </button>

                  {/* Swap Button */}
                  <button
                    onClick={onSwapLanguages}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold border border-slate-200 hover:scale-105 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Tukar Bahasa"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-green-700" />
                  </button>

                  {/* Target Language Button */}
                  <button
                    onClick={() => onOpenLanguageModal('target')}
                    className="flex-1 bg-green-50 hover:bg-green-100 p-2.5 sm:p-3 rounded-2xl border border-green-200 flex items-center justify-between text-left transition-all cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] text-green-800 font-bold uppercase tracking-wider block">Bahasa Tujuan</span>
                      <span className="text-sm font-extrabold text-green-900 flex items-center gap-1.5 mt-0.5">
                        <span>{targetLang.flagEmoji}</span>
                        <span className="truncate">{targetLang.name}</span>
                      </span>
                    </div>
                  </button>

                </div>
              </div>
            </div>

            {/* Quick Language Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="font-bold text-slate-700">Pilih Bahasa Populer:</span>
              {[
                { id: 'bug', name: 'Bugis' },
                { id: 'jav', name: 'Jawa' },
                { id: 'sun', name: 'Sunda' },
                { id: 'ban', name: 'Bali' },
                { id: 'mak', name: 'Makassar' },
                { id: 'min', name: 'Minang' },
                { id: 'ace', name: 'Aceh' }
              ].map(lang => {
                const isActive = targetLang.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => onQuickSearchSelect(lang.id)}
                    className={`px-3.5 py-1.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                      isActive ? 'pill-active shadow-xs' : 'pill-inactive border border-slate-200 hover:bg-slate-200/80'
                    }`}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Spotlight Card: "Kosakata Hari Ini" */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => onSelectWordDetail(wordOfTheDay)}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-green-50 rounded-full opacity-60 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                    <BookOpenCheck className="w-4 h-4" />
                    Kosakata Hari Ini
                  </span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    Bahasa {targetLang.name.replace('Bahasa ', '')}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-green-700 transition-colors">
                      {wordOfTheDay.translation}
                    </h2>

                    {/* Speaker Pronunciation Button */}
                    <button
                      onClick={handlePlayAudio}
                      className={`p-3 rounded-2xl ${
                        isPlayingAudio ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-green-700 text-white hover:bg-green-800'
                      } transition-all shadow-sm`}
                      title="Dengarkan Pelafalan"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-mono pt-1">
                    Pelafalan: <span className="text-slate-800 font-bold">"{wordOfTheDay.phonetic}"</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Arti Bahasa Indonesia</span>
                  <p className="text-base font-bold text-green-900">{wordOfTheDay.word}</p>

                  {wordOfTheDay.exampleSentence && (
                    <div className="mt-2 pt-2 border-t border-slate-200/80 text-xs space-y-0.5">
                      <p className="text-slate-700 italic font-medium">"{wordOfTheDay.exampleSentence}"</p>
                      <p className="text-slate-500">({wordOfTheDay.exampleTranslation})</p>
                    </div>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs font-bold text-green-700 group-hover:text-green-800">
                  <span>Lihat Detail & Etiket Lokal &rarr;</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
