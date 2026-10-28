import React, { useState } from 'react';
import { User, Award, Flame, Bookmark, History, Trophy, Trash2, Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile, WordEntry, Language } from '../types';
import { BADGE_DATABASE } from '../data/badgeDatabase';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';
import { speakWord } from '../utils/audioSpeech';

interface UserProfileViewProps {
  userProfile: UserProfile;
  targetLang: Language;
  onSelectWordDetail: (word: WordEntry) => void;
  onClearHistory: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userProfile,
  targetLang,
  onSelectWordDetail,
  onClearHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'badges' | 'history'>('bookmarks');

  // Find bookmarked words
  const bookmarkedWords = DICTIONARY_DATABASE.filter(w => userProfile.bookmarks.includes(w.id));

  // XP Progress calculation
  const nextLevelXp = userProfile.level === 1 ? 250 : userProfile.level === 2 ? 600 : 1000;
  const currentLevelMinXp = userProfile.level === 1 ? 0 : userProfile.level === 2 ? 250 : 600;
  const xpProgress = Math.min(
    100,
    Math.round(((userProfile.xp - currentLevelMinXp) / (nextLevelXp - currentLevelMinXp)) * 100)
  );

  return (
    <div className="space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-18 h-18 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-serif font-bold text-2xl shrink-0">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 flex-1 w-full">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#14532D] tabular-nums">
              Pembelajar Bahasa · Level {userProfile.level}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {userProfile.name}
            </h2>
            <p className="text-xs text-stone-500">{userProfile.email}</p>

            {/* Level XP Progress Bar */}
            <div className="pt-2 max-w-md mx-auto sm:mx-0">
              <div className="flex justify-between text-xs text-stone-600 font-semibold mb-1.5 tabular-nums">
                <span>Progres Level {userProfile.level}</span>
                <span className="font-mono">{userProfile.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2.5 bg-[#EFECE4] rounded-full overflow-hidden border border-stone-200/80">
                <div
                  className="h-full bg-[#14532D] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, xpProgress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-stone-100 text-center">
          <div className="p-3.5 bg-[#F8F6F1] rounded-xl border border-stone-200/80">
            <Flame className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <span className="font-serif text-lg font-bold block text-stone-900 tabular-nums">{userProfile.streak} Hari</span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Rentetan Belajar</span>
          </div>

          <div className="p-3.5 bg-[#F8F6F1] rounded-xl border border-stone-200/80">
            <Award className="w-4 h-4 text-[#14532D] mx-auto mb-1" />
            <span className="font-serif text-lg font-bold block text-stone-900 tabular-nums">{userProfile.badges.length} Lencana</span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Capaian</span>
          </div>

          <div className="p-3.5 bg-[#F8F6F1] rounded-xl border border-stone-200/80">
            <Bookmark className="w-4 h-4 text-[#14532D] mx-auto mb-1" />
            <span className="font-serif text-lg font-bold block text-stone-900 tabular-nums">{userProfile.bookmarks.length} Kata</span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Koleksi Tersimpan</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Favorit, Badge, Riwayat */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap tabular-nums ${
            activeSubTab === 'bookmarks'
              ? 'pill-active'
              : 'pill-inactive hover:bg-stone-200/70'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Kata Favorit ({bookmarkedWords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'badges'
              ? 'pill-active'
              : 'pill-inactive hover:bg-stone-200/70'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Lencana Capaian</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'pill-active'
              : 'pill-inactive hover:bg-stone-200/70'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Pencarian</span>
        </button>
      </div>

      {/* Sub Tab Content */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarkedWords.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-stone-200/90 text-stone-500 text-xs sm:text-sm">
              Belum ada kata favorit yang disimpan. Tandai kosakata di kamus untuk menyimpannya di koleksi pribadi Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarkedWords.map(word => (
                <div
                  key={word.id}
                  onClick={() => onSelectWordDetail(word)}
                  className="bg-white p-4 rounded-xl border border-stone-200/90 hover:border-[#14532D]/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-[#14532D] uppercase tracking-wider">{word.category}</span>
                    <h4 className="font-serif font-bold text-stone-900 text-lg">{word.translation}</h4>
                    <p className="text-xs text-stone-600">Arti: {word.word}</p>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      speakWord(word.translation, targetLang.code);
                    }}
                    className="p-2.5 bg-[#EFECE4] hover:bg-[#14532D] text-stone-700 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
          {BADGE_DATABASE.map(badge => {
            const isUnlocked = userProfile.badges.includes(badge.id) || userProfile.xp >= (badge.requiredXp || 0);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-stone-200/90'
                    : 'bg-[#F8F6F1] border-stone-200/60 opacity-65'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-[#14532D] text-amber-300' : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif font-bold text-stone-900 text-sm">{badge.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-[#14532D]" />}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{badge.description}</p>
                  <span className="text-[11px] font-mono font-semibold text-[#14532D] block pt-1 tabular-nums">
                    {isUnlocked ? 'Terbuka' : `Target ${badge.requiredXp} XP`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-serif font-bold text-stone-900 text-base">Riwayat Pencarian Terakhir</h4>
            {userProfile.history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Riwayat</span>
              </button>
            )}
          </div>

          {userProfile.history.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-4">Belum ada riwayat pencarian.</p>
          ) : (
            <div className="space-y-2">
              {userProfile.history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#F8F6F1] rounded-xl border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-800">{h.word}</span>
                    <span className="text-stone-400">&rarr;</span>
                    <span className="font-serif font-bold text-[#14532D] text-sm">{h.translation}</span>
                  </div>
                  <span className="text-stone-400 font-mono text-[10px] tabular-nums">{h.searchedAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
