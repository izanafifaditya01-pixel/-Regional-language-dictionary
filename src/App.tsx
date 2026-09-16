import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DictionaryView } from './components/DictionaryView';
import { TranslatorView } from './components/TranslatorView';
import { LearnHub } from './components/LearnHub';
import { GamesHub } from './components/GamesHub';
import { QuizView } from './components/QuizView';
import { AITutorChat } from './components/AITutorChat';
import { UserProfileView } from './components/UserProfileView';
import { WordContributionView } from './components/WordContributionView';
import { WordDetailModal } from './components/WordDetailModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminLoginModal } from './components/AdminLoginModal';

import { WordEntry, Language, UserProfile, AppTab, AdminUser, AppViewMode } from './types';
import { LANGUAGES_DATA } from './data/languagesData';
import {
  loadUserProfile,
  saveUserProfile,
  addXpToProfile,
  toggleBookmarkInProfile,
  addHistoryToProfile,
  recordGameScoreInProfile,
  recordWheelSpinInProfile,
  claimDailyQuestInProfile
} from './utils/userStorage';
import {
  loadContributedWords,
  addContributedWord,
  updateContributedWord,
  deleteContributedWord,
  getMergedDictionary
} from './utils/userContributedWords';
import { getAdminSession, logoutAdmin } from './utils/adminAuth';

export default function App() {
  // App View Mode: 'user' (Public User Mode - No login required) or 'admin' (Admin Dashboard - Login required)
  const [viewMode, setViewMode] = useState<AppViewMode>('user');

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getAdminSession());
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>('dictionary');

  // Languages State (Default: Indonesia -> Tolaki)
  const [sourceLang, setSourceLang] = useState<Language>(
    LANGUAGES_DATA.find(l => l.id === 'ind') || LANGUAGES_DATA[0]
  );
  const [targetLang, setTargetLang] = useState<Language>(
    LANGUAGES_DATA.find(l => l.id === 'tk') || LANGUAGES_DATA[1]
  );

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());

  // User Contributed Words State
  const [contributedWords, setContributedWords] = useState<WordEntry[]>(loadContributedWords());

  // Merged Dictionary Database (Base Sultra words + Community contributed words)
  const mergedDictionary = useMemo(() => {
    return getMergedDictionary(contributedWords);
  }, [contributedWords]);

  // Modals & Selections
  const [selectedWordForDetail, setSelectedWordForDetail] = useState<WordEntry | null>(null);
  const [languageModalType, setLanguageModalType] = useState<'source' | 'target' | null>(null);
  const [aiPromptWord, setAiPromptWord] = useState<WordEntry | null>(null);

  // Word of the Day (Spotlight for current target language)
  const wordOfTheDay = useMemo(() => {
    const langWords = mergedDictionary.filter(w => w.targetLangId === targetLang.id);
    return langWords.find(w => w.isWordOfTheDay) || langWords[0] || mergedDictionary[0];
  }, [mergedDictionary, targetLang]);

  // Save profile changes to localStorage
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Handle swapping languages
  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  // Handle language selection from modal
  const handleSelectLanguage = (lang: Language) => {
    if (languageModalType === 'source') {
      setSourceLang(lang);
    } else if (languageModalType === 'target') {
      setTargetLang(lang);
    }
  };

  // Handle adding XP and level-ups
  const handleAddXp = (amount: number) => {
    const { updatedProfile } = addXpToProfile(userProfile, amount);
    setUserProfile(updatedProfile);
  };

  // Handle toggling bookmark
  const handleToggleBookmark = (wordId: string) => {
    const updated = toggleBookmarkInProfile(userProfile, wordId);
    setUserProfile(updated);
  };

  // Handle selecting word detail & recording search history
  const handleSelectWordDetail = (word: WordEntry) => {
    setSelectedWordForDetail(word);
    const updated = addHistoryToProfile(userProfile, {
      wordId: word.id,
      word: word.word,
      translation: word.translation,
      sourceLangId: sourceLang.id,
      targetLangId: targetLang.id
    });
    setUserProfile(updated);
  };

  // Quick selection from hero popular pills
  const handleQuickSearchSelect = (langId: string) => {
    const found = LANGUAGES_DATA.find(l => l.id === langId);
    if (found) {
      setTargetLang(found);
      setActiveTab('dictionary');
    }
  };

  // Ask AI Tutor about a specific word
  const handleAskAiAboutWord = (word: WordEntry) => {
    setAiPromptWord(word);
    setActiveTab('ai');
  };

  // Clear user search history
  const handleClearHistory = () => {
    const updated: UserProfile = {
      ...userProfile,
      history: []
    };
    setUserProfile(updated);
  };

  // Game High Score Handler
  const handleRecordGameScore = (gameId: string, score: number) => {
    const { updatedProfile } = recordGameScoreInProfile(userProfile, gameId, score);
    setUserProfile(updatedProfile);
  };

  // Daily Wheel Spin Handler
  const handleRecordWheelSpin = () => {
    const updated = recordWheelSpinInProfile(userProfile);
    setUserProfile(updated);
  };

  // Claim Daily Quest Handler
  const handleClaimQuest = (questId: string, xpReward: number) => {
    const updated = claimDailyQuestInProfile(userProfile, questId);
    setUserProfile(updated);
  };

  // ==========================================
  // WORD CONTRIBUTION HANDLERS
  // ==========================================
  const handleAddContributedWord = (
    wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>,
    contributorName: string
  ) => {
    const { word, updatedList } = addContributedWord(wordData, contributorName);
    setContributedWords(updatedList);
    // Award +30 XP for contributing a word
    handleAddXp(30);
  };

  const handleUpdateContributedWord = (wordId: string, updatedFields: Partial<WordEntry>) => {
    const updatedList = updateContributedWord(wordId, updatedFields);
    setContributedWords(updatedList);
  };

  const handleDeleteContributedWord = (wordId: string) => {
    const updatedList = deleteContributedWord(wordId);
    setContributedWords(updatedList);
  };

  // ==========================================
  // ADMIN AUTHENTICATION HANDLERS
  // ==========================================
  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setAdminUser(admin);
    setViewMode('admin');
    setIsAdminLoginModalOpen(false);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    setViewMode('user');
  };

  // -------------------------------------------------------------
  // RENDER 1: HALAMAN ADMIN (Memerlukan Login Administrator)
  // -------------------------------------------------------------
  if (viewMode === 'admin' && adminUser) {
    return (
      <AdminDashboardView
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        onSwitchToUserView={() => setViewMode('user')}
        allWords={mergedDictionary}
        contributedWords={contributedWords}
        onAddWord={handleAddContributedWord}
        onUpdateWord={handleUpdateContributedWord}
        onDeleteWord={handleDeleteContributedWord}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: HALAMAN USER / PENGGUNA (Bebas Akses Tanpa Login)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Admin Session Indicator when Admin previews User Mode */}
      {adminUser && (
        <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-inner sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Anda sedang melihat <strong>Mode Tampilan Pengguna</strong> sebagai <strong>{adminUser.name}</strong> ({adminUser.role})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('admin')}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
            >
              Kembali ke Dashboard Admin →
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer transition-colors"
            >
              Logout Admin
            </button>
          </div>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        isAdminLoggedIn={!!adminUser}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onGoToAdminDashboard={() => setViewMode('admin')}
      />

      {/* Hero Spotlight Section (Only on Dictionary & Learn Tabs) */}
      {(activeTab === 'dictionary' || activeTab === 'learn') && (
        <HeroSection
          wordOfTheDay={wordOfTheDay}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSwapLanguages={handleSwapLanguages}
          onOpenLanguageModal={type => setLanguageModalType(type)}
          onSelectWordDetail={handleSelectWordDetail}
          onQuickSearchSelect={handleQuickSearchSelect}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'dictionary' && (
          <DictionaryView
            sourceLang={sourceLang}
            targetLang={targetLang}
            bookmarks={userProfile.bookmarks}
            allWords={mergedDictionary}
            onToggleBookmark={handleToggleBookmark}
            onSelectWordDetail={handleSelectWordDetail}
            onOpenLanguageModal={type => setLanguageModalType(type)}
            onNavigateToContribute={() => setActiveTab('contribute')}
          />
        )}

        {activeTab === 'translate' && (
          <TranslatorView
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSelectLanguage={(type, lang) => {
              if (type === 'source') setSourceLang(lang);
              else setTargetLang(lang);
            }}
            onSwapLanguages={handleSwapLanguages}
            bookmarks={userProfile.bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSelectWordDetail={handleSelectWordDetail}
            allWords={mergedDictionary}
          />
        )}

        {activeTab === 'learn' && (
          <LearnHub
            targetLang={targetLang}
            onAddXp={handleAddXp}
            onSelectWordDetail={handleSelectWordDetail}
          />
        )}

        {activeTab === 'games' && (
          <GamesHub
            targetLang={targetLang}
            userProfile={userProfile}
            onAddXp={handleAddXp}
            onRecordGameScore={handleRecordGameScore}
            onClaimQuest={handleClaimQuest}
            onRecordWheelSpin={handleRecordWheelSpin}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            targetLang={targetLang}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'contribute' && (
          <WordContributionView
            contributedWords={contributedWords}
            onAddWord={handleAddContributedWord}
            onUpdateWord={handleUpdateContributedWord}
            onDeleteWord={handleDeleteContributedWord}
            onSelectWordDetail={handleSelectWordDetail}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'ai' && (
          <AITutorChat
            selectedLanguage={targetLang}
            initialPromptWord={aiPromptWord}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            userProfile={userProfile}
            targetLang={targetLang}
            onSelectWordDetail={handleSelectWordDetail}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Word Detail Modal */}
      {selectedWordForDetail && (
        <WordDetailModal
          word={selectedWordForDetail}
          targetLang={targetLang}
          isBookmarked={userProfile.bookmarks.includes(selectedWordForDetail.id)}
          onClose={() => setSelectedWordForDetail(null)}
          onToggleBookmark={handleToggleBookmark}
          onAskAiAboutWord={handleAskAiAboutWord}
        />
      )}

      {/* Language Selector Modal */}
      {languageModalType && (
        <LanguageSelectorModal
          type={languageModalType}
          selectedLangId={languageModalType === 'source' ? sourceLang.id : targetLang.id}
          onSelectLanguage={handleSelectLanguage}
          onClose={() => setLanguageModalType(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-semibold text-slate-300">
            Kamus & Pelestarian Bahasa Daerah Sulawesi Tenggara (Tolaki • Moronene • Muna • Buton)
          </p>
          <p>
            Platform Edukasi Digital, Kosakata Komunitas & Game Pembelajaran Bahasa Sultra 🌾🌿🪁🏰
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/80">
            <span className="text-slate-400">Mode Akses: Pengguna Umum Bebas Tanpa Login</span>
            <span className="hidden sm:inline">•</span>
            <button
              id="footer-admin-btn"
              onClick={() => {
                if (adminUser) setViewMode('admin');
                else setIsAdminLoginModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminUser ? 'Buka Dashboard Admin' : 'Portal Administrator (Login)'}</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
