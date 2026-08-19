import React, { useState } from 'react';
import { X, Volume2, Bookmark, BookmarkCheck, Sparkles, BookOpen, Share2, Check, ArrowRight, Lightbulb } from 'lucide-react';
import { WordEntry, Language } from '../types';
import { speakWord } from '../utils/audioSpeech';

interface WordDetailModalProps {
  word: WordEntry | null;
  targetLang: Language;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (wordId: string) => void;
  onAskAiAboutWord: (word: WordEntry) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  targetLang,
  isBookmarked,
  onClose,
  onToggleBookmark,
  onAskAiAboutWord
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!word) return null;

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speakWord(word.translation, targetLang.code, () => {
      setIsPlayingAudio(false);
    }, targetLang.name);
  };

  const handleShare = () => {
    const text = `${word.translation} (${word.phonetic}) = ${word.word} [Bahasa ${targetLang.name}] - Leksika Nusantara`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        id="word-detail-modal"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              {word.category}
            </span>
            <span className="text-xs text-emerald-200 font-semibold">
              {targetLang.flagEmoji} {targetLang.name}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">{word.translation}</h2>
              <p className="text-sm text-emerald-200 font-mono mt-0.5">
                Cara Membaca: <span className="text-amber-300 font-bold">"{word.phonetic}"</span>
              </p>
            </div>

            {/* Main Audio Pronunciation Button */}
            <button
              onClick={handlePlayAudio}
              className={`p-3.5 rounded-2xl ${
                isPlayingAudio ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-white/15 hover:bg-white/25 text-white'
              } shadow-lg transition-all cursor-pointer`}
              title="Dengarkan Pelafalan"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Indonesian Translation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arti Bahasa Indonesia</span>
            <p className="text-xl font-black text-emerald-900">{word.word}</p>
          </div>

          {/* Example Sentence */}
          {word.exampleSentence && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Contoh Kalimat Penggunaan
              </h4>
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1.5">
                <p className="text-sm font-bold text-emerald-950 italic">"{word.exampleSentence}"</p>
                <p className="text-xs text-slate-600 font-medium">&rarr; {word.exampleTranslation}</p>
              </div>
            </div>
          )}

          {/* Cultural Context Note */}
          {word.culturalContext && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Informasi Budaya & Etiket Lokal
              </h4>
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
                {word.culturalContext}
              </div>
            </div>
          )}

          {/* Synonyms & Antonyms */}
          {(word.synonyms?.length || word.antonyms?.length) ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Sinonim:</span>
                  <div className="flex flex-wrap gap-1">
                    {word.synonyms.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {word.antonyms && word.antonyms.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Antonim:</span>
                  <div className="flex flex-wrap gap-1">
                    {word.antonyms.map((a, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* AI Tutor Ask Trigger */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onAskAiAboutWord(word);
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-800 to-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tanya AI Tutor tentang kata "{word.translation}"</span>
            </button>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleBookmark(word.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span>Tersimpan di Favorit</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Simpan ke Favorit</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
