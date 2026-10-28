import React, { useState } from 'react';
import {
  X,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  MessageSquareText,
} from 'lucide-react';
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
  onAskAiAboutWord,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!word) return null;

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speakWord(
      word.translation,
      targetLang.code,
      () => {
        setIsPlayingAudio(false);
      },
      targetLang.name
    );
  };

  const handleShare = () => {
    const text = `${word.translation} (/${word.phonetic || '-'}/) = ${word.word} [${targetLang.name}] — Leksika Nusantara`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-950/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-2xl border border-stone-200 shadow-xl overflow-hidden relative"
        id="word-detail-modal"
      >
        {/* Curatorial Header */}
        <div className="bg-[#F8F6F1] p-6 sm:p-8 border-b border-stone-200/90 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium pr-10">
            <span>{word.category}</span>
            <span aria-hidden="true">·</span>
            <span>{targetLang.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-3">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                {word.translation}
              </h2>
              <p className="font-mono text-sm text-stone-600 mt-1">
                /{word.phonetic || '-'}/
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlayAudio}
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#14532D] hover:bg-[#166534] text-white'
              }`}
              title="Dengarkan Pelafalan"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Accession Metadata & Lexical Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          <dl className="divide-y divide-stone-200/80">
            {/* Indonesian Definition */}
            <div className="pb-5">
              <dt className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                Padanan Bahasa Indonesia
              </dt>
              <dd className="font-serif text-2xl font-semibold text-stone-900 mt-1">
                {word.word}
              </dd>
            </div>

            {/* Example Sentence */}
            {word.exampleSentence && (
              <div className="py-5 space-y-1.5">
                <dt className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                  Contoh Kalimat Tutur
                </dt>
                <dd className="space-y-1 pt-1">
                  <p className="font-serif italic text-base text-stone-900 leading-relaxed">
                    &ldquo;{word.exampleSentence}&rdquo;
                  </p>
                  {word.exampleTranslation && (
                    <p className="text-sm text-stone-600">
                      {word.exampleTranslation}
                    </p>
                  )}
                </dd>
              </div>
            )}

            {/* Cultural Context */}
            {word.culturalContext && (
              <div className="py-5 space-y-1.5">
                <dt className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                  Catatan Budaya &amp; Etiket Lokal
                </dt>
                <dd className="text-sm text-stone-700 leading-relaxed pt-1">
                  {word.culturalContext}
                </dd>
              </div>
            )}

            {/* Synonyms & Antonyms */}
            {Boolean(word.synonyms?.length || word.antonyms?.length) && (
              <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {word.synonyms && word.synonyms.length > 0 && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                      Sinonim
                    </dt>
                    <dd className="text-sm text-stone-800 mt-1">
                      {word.synonyms.join(' · ')}
                    </dd>
                  </div>
                )}

                {word.antonyms && word.antonyms.length > 0 && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                      Antonim
                    </dt>
                    <dd className="text-sm text-stone-800 mt-1">
                      {word.antonyms.join(' · ')}
                    </dd>
                  </div>
                )}
              </div>
            )}
          </dl>

          {/* Tutor Discussion Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskAiAboutWord(word);
              }}
              className="w-full py-3 px-4 bg-[#14532D] hover:bg-[#166534] text-white font-medium text-sm rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Diskusikan Kata &ldquo;{word.translation}&rdquo; dengan Tutor Bahasa</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-[#F8F6F1] border-t border-stone-200/90 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleBookmark(word.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              isBookmarked
                ? 'bg-amber-100/80 text-amber-950 border border-amber-300'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-[#EFECE4]'
            }`}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-700" />
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Simpan Kosakata</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-4 bg-white border border-stone-200 hover:bg-[#EFECE4] text-stone-700 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-[#14532D]" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin Kutipan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
