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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-green-50 rounded-full opacity-60 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-green-700 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
            <User className="w-10 h-10" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900">{userProfile.name}</h2>
              <span className="px-3 py-0.5 bg-green-50 text-green-800 border border-green-200 text-xs font-extrabold rounded-full uppercase">
                Level {userProfile.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{userProfile.email}</p>

            {/* Level XP Progress Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                <span>Progres Level {userProfile.level}</span>
                <span>{userProfile.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-green-700 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, xpProgress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center relative z-10">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <span className="text-lg font-black block text-slate-900">{userProfile.streak} Hari</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Streak Belajar</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <Award className="w-5 h-5 text-green-700 mx-auto mb-1" />
            <span className="text-lg font-black block text-slate-900">{userProfile.badges.length} Badge</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Prestasi</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <Bookmark className="w-5 h-5 text-green-700 mx-auto mb-1" />
            <span className="text-lg font-black block text-slate-900">{userProfile.bookmarks.length} Kata</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Favorit Tersimpan</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Favorit, Badge, Riwayat */}
      <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'bookmarks'
              ? 'pill-active shadow-xs'
              : 'pill-inactive hover:bg-slate-200/60'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Kata Favorit ({bookmarkedWords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'badges'
              ? 'pill-active shadow-xs'
              : 'pill-inactive hover:bg-slate-200/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Lencana & Badge</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'history'
              ? 'pill-active shadow-xs'
              : 'pill-inactive hover:bg-slate-200/60'
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
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
              Belum ada kata favorit yang disimpan. Klik ikon penanda buku di kamus untuk menyimpan kata.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarkedWords.map(word => (
                <div
                  key={word.id}
                  onClick={() => onSelectWordDetail(word)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{word.category}</span>
                    <h4 className="font-extrabold text-slate-900 text-base">{word.translation}</h4>
                    <p className="text-xs text-slate-500">Arti: {word.word}</p>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      speakWord(word.translation, targetLang.code);
                    }}
                    className="p-2.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-xl"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGE_DATABASE.map(badge => {
            const isUnlocked = userProfile.badges.includes(badge.id) || userProfile.xp >= (badge.requiredXp || 0);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-emerald-50 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                    isUnlocked ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Award className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{badge.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>
                  <span className="text-[10px] font-bold text-emerald-800 block pt-1">
                    {isUnlocked ? '✓ Terbuka' : `Butuh ${badge.requiredXp} XP`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-800 text-sm">Riwayat Pencarian Terakhir</h4>
            {userProfile.history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Riwayat</span>
              </button>
            )}
          </div>

          {userProfile.history.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">Belum ada riwayat pencarian.</p>
          ) : (
            <div className="space-y-2">
              {userProfile.history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{h.word}</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="font-bold text-emerald-800">{h.translation}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{h.searchedAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
