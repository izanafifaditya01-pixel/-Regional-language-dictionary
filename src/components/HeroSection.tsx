import React, { useState } from 'react';
import { Volume2, ArrowRightLeft, ArrowUpRight, ChevronDown, BookOpen } from 'lucide-react';
import { WordEntry, Language } from '../types';
import { speakWord } from '../utils/audioSpeech';

import heroButonImg from '../assets/images/sultra_cultural_hero_1793148112620.jpg';
import tenunSultraImg from '../assets/images/tenun_sultra_textile_1793148113603.jpg';
import kaghatiMunaImg from '../assets/images/kaghati_muna_heritage_1793148115504.jpg';
import manuscriptWolioImg from '../assets/images/benteng_buton_manuscript_1793148116878.jpg';

interface HeroSectionProps {
  wordOfTheDay: WordEntry;
  sourceLang: Language;
  targetLang: Language;
  onSwapLanguages: () => void;
  onOpenLanguageModal: (type: 'source' | 'target') => void;
  onSelectWordDetail: (word: WordEntry) => void;
  onQuickSearchSelect: (langId: string) => void;
}

const HERITAGE_SPOTLIGHTS = [
  {
    langId: 'tk',
    figure: 'Fig. 01 · Rumpun Daratan',
    title: 'Bahasa Tolaki & Moronene',
    caption: 'Tradisi tenun geometris dan kosakata adat Konawe hingga Bombana.',
    image: tenunSultraImg,
    alt: 'Kain tenun tradisional Sulawesi Tenggara bermotif geometris hijau tua dan benang emas di atas batu kapur',
  },
  {
    langId: 'mun',
    figure: 'Fig. 02 · Tradisi Kepulauan',
    title: 'Bahasa Muna (Wuna)',
    caption: 'Warisan lisan Kaghati Kolope dan ungkapan keseharian masyarakat Pulau Muna.',
    image: kaghatiMunaImg,
    alt: 'Layang-layang tradisional Kaghati Kolope dari daun gadung kering khas Muna Sulawesi Tenggara',
  },
  {
    langId: 'btn',
    figure: 'Fig. 03 · Naskah Kesultanan',
    title: 'Bahasa Buton (Wolio)',
    caption: 'Khazanah leksikon maritim dan falsafah kesantunan kawasan Benteng Keraton.',
    image: manuscriptWolioImg,
    alt: 'Naskah kuno leksikon Nusantara terbuka di meja kayu jati bersama lampu minyak kuningan',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  wordOfTheDay,
  sourceLang,
  targetLang,
  onSwapLanguages,
  onOpenLanguageModal,
  onSelectWordDetail,
  onQuickSearchSelect,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakWord(
      wordOfTheDay.translation,
      targetLang.code,
      () => {
        setIsPlayingAudio(false);
      },
      targetLang.name
    );
  };

  const markImageFailed = (key: string) => {
    setFailedImages(prev => ({ ...prev, [key]: true }));
  };

  return (
    <section className="bg-[#F8F6F1] text-stone-900 pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main 2-Column Asymmetric Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Editorial Lead & Language Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase font-medium text-stone-500">
                <span>Arsip Leksikon Sulawesi Tenggara</span>
                <span aria-hidden="true">·</span>
                <span>Empat Rumpun Bahasa Daerah</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-stone-900 leading-[1.12] text-balance">
                Warisan Tutur &amp; Leksikon Bahasa Daerah Sulawesi Tenggara
              </h1>

              <p className="text-stone-600 text-base leading-relaxed max-w-2xl">
                Dokumentasi digital dan ruang belajar interaktif untuk <strong className="font-semibold text-stone-900">Bahasa Tolaki</strong>,{' '}
                <strong className="font-semibold text-stone-900">Bahasa Moronene</strong>,{' '}
                <strong className="font-semibold text-stone-900">Bahasa Muna</strong>, dan{' '}
                <strong className="font-semibold text-stone-900">Bahasa Buton (Wolio)</strong>—dilengkapi panduan fonetis, audio pelafalan, catatan budaya, serta kontribusi penutur lokal.
              </p>
            </div>

            {/* Interactive Language Pair Control & Regional Segmented Tabs */}
            <div className="space-y-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 max-w-xl">
                <div className="flex items-center justify-between gap-3">
                  {/* Source Language Trigger */}
                  <button
                    type="button"
                    onClick={() => onOpenLanguageModal('source')}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] hover:bg-[#EFECE4] border border-stone-200/80 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer min-w-0"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-500 font-medium block">Bahasa Asal</span>
                      <span className="text-sm font-semibold text-stone-900 truncate block mt-0.5">
                        {sourceLang.name}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  </button>

                  {/* Swap Button */}
                  <button
                    type="button"
                    onClick={onSwapLanguages}
                    className="w-10 h-10 rounded-xl bg-[#EFECE4] hover:bg-stone-300/70 text-stone-800 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    title="Tukar Pasangan Bahasa"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-[#14532D]" />
                  </button>

                  {/* Target Language Trigger */}
                  <button
                    type="button"
                    onClick={() => onOpenLanguageModal('target')}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#14532D]/6 hover:bg-[#14532D]/12 border border-[#14532D]/25 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer min-w-0"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] text-[#14532D] font-medium block">Bahasa Tujuan</span>
                      <span className="text-sm font-semibold text-[#14532D] truncate block mt-0.5">
                        {targetLang.name}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#14532D]/70 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Clean Segmented Regional Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-stone-500 mr-1 whitespace-nowrap">
                  Pilih Rumpun Cepat:
                </span>
                <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EFECE4] rounded-xl">
                  {[
                    { id: 'tk', name: 'Tolaki' },
                    { id: 'mor', name: 'Moronene' },
                    { id: 'mun', name: 'Muna' },
                    { id: 'btn', name: 'Buton (Wolio)' },
                  ].map(lang => {
                    const isActive = targetLang.id === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => onQuickSearchSelect(lang.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#14532D] text-white'
                            : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                        }`}
                      >
                        {lang.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Curatorial Word of the Day & Landscape Frame */}
          <div className="lg:col-span-5 flex flex-col">
            <article
              onClick={() => onSelectWordDetail(wordOfTheDay)}
              className="flex-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-stone-300 transition-colors"
            >
              {/* Visual Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900">
                {!failedImages['hero'] ? (
                  <img
                    src={heroButonImg}
                    alt="Benteng Keraton Buton dan pesisir kepulauan Sulawesi Tenggara saat matahari keemasan"
                    referrerPolicy="no-referrer"
                    onError={() => markImageFailed('hero')}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#14532D] to-stone-900 flex items-center justify-center p-6 text-stone-200">
                    <BookOpen className="w-10 h-10 opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-3.5 left-5 right-5 flex items-center justify-between gap-2 text-xs text-stone-200">
                  <span className="uppercase tracking-widest font-medium">Kosakata Pilihan Hari Ini</span>
                  <span className="text-stone-300">
                    Bahasa {targetLang.name.replace('Bahasa ', '')}
                  </span>
                </div>
              </div>

              {/* Lexical Accession Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight group-hover:text-[#14532D] transition-colors">
                        {wordOfTheDay.translation}
                      </h2>
                      <p className="font-mono text-xs text-stone-500 mt-1">
                        /{wordOfTheDay.phonetic || '-'}/ · {wordOfTheDay.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#F8F6F1] hover:bg-[#14532D] text-stone-800 hover:text-white border border-stone-200'
                      }`}
                      title="Dengarkan Pelafalan"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="pt-3.5 border-t border-stone-200/80 space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs text-stone-500">Padanan Indonesia</span>
                      <span className="text-base font-semibold text-stone-900">{wordOfTheDay.word}</span>
                    </div>

                    {wordOfTheDay.exampleSentence && (
                      <p className="font-serif italic text-sm text-stone-700 leading-relaxed pt-1">
                        &ldquo;{wordOfTheDay.exampleSentence}&rdquo;{' '}
                        {wordOfTheDay.exampleTranslation && (
                          <span className="not-italic font-sans text-xs text-stone-500">
                            — {wordOfTheDay.exampleTranslation}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#14532D]">
                  <span>Telusuri Catatan Budaya &amp; Etiket Lokal</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Full-Width Curatorial Cultural Strip Below Hero Split */}
        <div className="pt-6 border-t border-stone-200/90">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERITAGE_SPOTLIGHTS.map(item => {
              const isSelected = targetLang.id === item.langId;
              return (
                <button
                  key={item.langId}
                  type="button"
                  onClick={() => onQuickSearchSelect(item.langId)}
                  className={`group text-left bg-white rounded-2xl border overflow-hidden transition-colors cursor-pointer flex flex-col ${
                    isSelected
                      ? 'border-[#14532D]'
                      : 'border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-200 relative">
                    {!failedImages[item.langId] ? (
                      <img
                        src={item.image}
                        alt={item.alt}
                        referrerPolicy="no-referrer"
                        onError={() => markImageFailed(item.langId)}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-300 text-xs p-4">
                        {item.title}
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">
                        {item.figure}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#14532D] transition-colors mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed mt-1">
                        {item.caption}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#14532D] pt-1 inline-flex items-center gap-1">
                      <span>{isSelected ? 'Sedang Aktif Ditampilkan' : 'Buka Leksikon Rumpun Ini'}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
