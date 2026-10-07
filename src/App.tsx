import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Link2, LogIn, ExternalLink, Globe } from 'lucide-react';
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
import { AdminLoginPage } from './components/AdminLoginPage';
import { UserLoginPage } from './components/UserLoginPage';
import { RouteLinksModal } from './components/RouteLinksModal';

import { WordEntry, Language, UserProfile, AppTab, AdminUser, PageRoute } from './types';
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
import { getAdminSession, logoutAdmin, loginAsRoleQuick } from './utils/adminAuth';
import {
  upsertWordToSupabase,
  deleteWordFromSupabase,
  fetchWordsFromSupabase
} from './utils/supabaseService';
import { isCurrentAdminPortal, shouldShowRoleLinksTrigger, shouldShowAdminInNavbar } from './utils/portalConfig';

// Helper to determine initial route from URL path, hash, or query parameter
function getInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'user';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const pageParam = search.get('page') || search.get('view') || search.get('route');
  const roleParam = search.get('role');

  if (
    roleParam === 'user-login' ||
    path.includes('/user/login') ||
    hash.includes('user/login') ||
    pageParam === 'user-login' ||
    pageParam === 'login'
  ) {
    return 'user-login';
  }

  if (
    roleParam === 'user' ||
    path === '/user' ||
    hash.includes('#/user') ||
    pageParam === 'user'
  ) {
    return 'user';
  }

  // Jika diakses melalui Subdomain Admin (misal: admin.domain.com di Cloudflare)
  if (isCurrentAdminPortal()) {
    const adminSession = getAdminSession();
    return adminSession ? 'admin' : 'admin-login';
  }

  if (
    roleParam === 'admin' ||
    roleParam === 'superadmin' ||
    roleParam === 'editor' ||
    roleParam === 'linguis' ||
    roleParam === 'moderator' ||
    roleParam === 'viewer' ||
    path.includes('/admin') ||
    path.includes('/editor') ||
    path.includes('/moderator') ||
    path.includes('/viewer') ||
    hash.includes('admin') ||
    hash.includes('editor') ||
    hash.includes('moderator') ||
    hash.includes('viewer') ||
    pageParam === 'admin'
  ) {
    return 'admin';
  }

  if (path.includes('/admin/login') || hash.includes('admin/login') || pageParam === 'admin-login') {
    return 'admin-login';
  }

  return 'user';
}

export default function App() {
  // Dedicated Page Routing: 'user' | 'user-login' | 'admin' | 'admin-login'
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getAdminSession());

  // Direct Links Modal State
  const [isRouteLinksModalOpen, setIsRouteLinksModalOpen] = useState(false);

  // Active Role Toast Notification
  const [roleWelcomeToast, setRoleWelcomeToast] = useState<string | null>(null);

  // Navigation State inside User view
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

  // Auto-detect role URL parameters and deep-linking on mount & URL changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAndApplyRoleUrl = () => {
      const search = new URLSearchParams(window.location.search);
      const roleParam = search.get('role');
      const path = window.location.pathname.toLowerCase();

      if (roleParam) {
        if (roleParam === 'user') {
          setCurrentRoute('user');
        } else if (roleParam === 'user-login') {
          setCurrentRoute('user-login');
        } else if (['admin', 'superadmin', 'editor', 'linguis', 'moderator', 'viewer'].includes(roleParam.toLowerCase())) {
          const user = loginAsRoleQuick(roleParam);
          if (user) {
            setAdminUser(user);
            setCurrentRoute('admin');
            setRoleWelcomeToast(`Terhubung via Tautan Akses Role: ${user.name} (${user.role})`);
            setTimeout(() => setRoleWelcomeToast(null), 5000);
          }
        }
      } else if (path.includes('/editor')) {
        const user = loginAsRoleQuick('editor');
        if (user) {
          setAdminUser(user);
          setCurrentRoute('admin');
          setRoleWelcomeToast(`Terhubung via Tautan Akses Role: ${user.name} (${user.role})`);
          setTimeout(() => setRoleWelcomeToast(null), 5000);
        }
      } else if (path.includes('/moderator')) {
        const user = loginAsRoleQuick('moderator');
        if (user) {
          setAdminUser(user);
          setCurrentRoute('admin');
          setRoleWelcomeToast(`Terhubung via Tautan Akses Role: ${user.name} (${user.role})`);
          setTimeout(() => setRoleWelcomeToast(null), 5000);
        }
      } else if (path.includes('/viewer')) {
        const user = loginAsRoleQuick('viewer');
        if (user) {
          setAdminUser(user);
          setCurrentRoute('admin');
          setRoleWelcomeToast(`Terhubung via Tautan Akses Role: ${user.name} (${user.role})`);
          setTimeout(() => setRoleWelcomeToast(null), 5000);
        }
      }
    };

    checkAndApplyRoleUrl();
  }, []);

  const handleSelectRoleFromModal = (roleTarget: string) => {
    if (roleTarget === 'user') {
      navigateTo('user');
      setRoleWelcomeToast('Beralih ke Portal Pengguna Publik (Bebas Akses Tanpa Sandi)');
      setTimeout(() => setRoleWelcomeToast(null), 4000);
    } else if (roleTarget === 'user-login') {
      navigateTo('user-login');
      setRoleWelcomeToast('Beralih ke Halaman Login Akun Pengguna Terdaftar');
      setTimeout(() => setRoleWelcomeToast(null), 4000);
    } else {
      const user = loginAsRoleQuick(roleTarget);
      if (user) {
        setAdminUser(user);
        navigateTo('admin');
        setRoleWelcomeToast(`Aktif sebagai ${user.name} (${user.role})`);
        setTimeout(() => setRoleWelcomeToast(null), 4500);
      }
    }
  };

  // Fetch live words from Supabase on mount if configured
  useEffect(() => {
    fetchWordsFromSupabase().then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setContributedWords(prev => {
          const prevMap = new Map(prev.map(w => [w.id, w]));
          res.data!.forEach(w => prevMap.set(w.id, w));
          return Array.from(prevMap.values());
        });
      }
    }).catch(() => {
      // Graceful fallback to offline local dictionary
    });
  }, []);

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
    // Asynchronously upsert to Supabase if configured
    upsertWordToSupabase(word).catch(err => {
      console.warn('Supabase async upsert notice:', err);
    });
  };

  const handleUpdateContributedWord = (wordId: string, updatedFields: Partial<WordEntry>) => {
    const updatedList = updateContributedWord(wordId, updatedFields);
    setContributedWords(updatedList);
    const updatedWord = updatedList.find(w => w.id === wordId);
    if (updatedWord) {
      upsertWordToSupabase(updatedWord).catch(err => {
        console.warn('Supabase async update notice:', err);
      });
    }
  };

  const handleDeleteContributedWord = (wordId: string) => {
    const updatedList = deleteContributedWord(wordId);
    setContributedWords(updatedList);
    deleteWordFromSupabase(wordId).catch(err => {
      console.warn('Supabase async delete notice:', err);
    });
  };

  // ==========================================
  // ROUTING & NAVIGATION HANDLERS
  // ==========================================
  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      let newPath = '/';
      if (route === 'admin') newPath = '/admin';
      else if (route === 'admin-login') newPath = '/admin/login';
      else if (route === 'user-login') newPath = '/user/login';
      else if (route === 'user') newPath = '/user';

      try {
        window.history.pushState({ route }, '', newPath);
      } catch {
        // Fallback for constrained iframe environments
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleUpdateUserNameAndEmail = (name: string, email?: string) => {
    setUserProfile(prev => {
      const updated = { ...prev, name, email };
      saveUserProfile(updated);
      return updated;
    });
  };

  // ==========================================
  // ADMIN AUTHENTICATION HANDLERS
  // ==========================================
  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setAdminUser(admin);
    navigateTo('admin');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    navigateTo('user');
  };

  // -------------------------------------------------------------
  // HALAMAN 1: HALAMAN LOGIN ADMIN (Dedicated Link: /admin atau /admin/login)
  // -------------------------------------------------------------
  if (currentRoute === 'admin-login' || (currentRoute === 'admin' && !adminUser)) {
    return (
      <>
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onNavigateToUser={() => navigateTo('user')}
          onOpenLinksModal={() => setIsRouteLinksModalOpen(true)}
        />
        {shouldShowRoleLinksTrigger() && (
          <RouteLinksModal
            isOpen={isRouteLinksModalOpen}
            onClose={() => setIsRouteLinksModalOpen(false)}
            onNavigate={navigateTo}
            onSelectRole={handleSelectRoleFromModal}
          />
        )}
        {roleWelcomeToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-100">{roleWelcomeToast}</span>
              <button
                onClick={() => setRoleWelcomeToast(null)}
                className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // -------------------------------------------------------------
  // HALAMAN 2: HALAMAN DASHBOARD ADMIN (Dedicated Link: /admin terautentikasi)
  // -------------------------------------------------------------
  if (currentRoute === 'admin' && adminUser) {
    return (
      <>
        <AdminDashboardView
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onSwitchToUserView={() => navigateTo('user')}
          onOpenLinksModal={() => setIsRouteLinksModalOpen(true)}
          onSwitchAdminUser={setAdminUser}
          allWords={mergedDictionary}
          contributedWords={contributedWords}
          onAddWord={handleAddContributedWord}
          onUpdateWord={handleUpdateContributedWord}
          onDeleteWord={handleDeleteContributedWord}
          onWordsUpdated={setContributedWords}
        />
        {shouldShowRoleLinksTrigger() && (
          <RouteLinksModal
            isOpen={isRouteLinksModalOpen}
            onClose={() => setIsRouteLinksModalOpen(false)}
            onNavigate={navigateTo}
            onSelectRole={handleSelectRoleFromModal}
          />
        )}
        {roleWelcomeToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-100">{roleWelcomeToast}</span>
              <button
                onClick={() => setRoleWelcomeToast(null)}
                className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // -------------------------------------------------------------
  // HALAMAN 3: HALAMAN LOGIN PENGGUNA (Dedicated Link: /user/login)
  // -------------------------------------------------------------
  if (currentRoute === 'user-login') {
    return (
      <>
        <UserLoginPage
          currentUserProfile={userProfile}
          onUpdateUserProfile={handleUpdateUserNameAndEmail}
          onContinueAsGuest={() => navigateTo('user')}
        />
        {shouldShowRoleLinksTrigger() && (
          <RouteLinksModal
            isOpen={isRouteLinksModalOpen}
            onClose={() => setIsRouteLinksModalOpen(false)}
            onNavigate={navigateTo}
            onSelectRole={handleSelectRoleFromModal}
          />
        )}
        {roleWelcomeToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-100">{roleWelcomeToast}</span>
              <button
                onClick={() => setRoleWelcomeToast(null)}
                className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // -------------------------------------------------------------
  // HALAMAN 4: HALAMAN USER / PENGGUNA (Dedicated Link: / atau /user - Bebas Akses Tanpa Login)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Admin Session Indicator when Admin previews User Mode */}
      {adminUser && (
        <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-inner sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Anda sedang melihat <strong>Halaman Pengguna (User Mode)</strong> sebagai <strong>{adminUser.name}</strong> ({adminUser.role})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('admin')}
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
        onOpenAdminLogin={() => navigateTo(adminUser ? 'admin' : 'admin-login')}
        onGoToAdminDashboard={() => navigateTo('admin')}
        onNavigateToUserLogin={() => navigateTo('user-login')}
        onOpenLinksModal={() => setIsRouteLinksModalOpen(true)}
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

      {/* Route Links Selector Modal */}
      <RouteLinksModal
        isOpen={isRouteLinksModalOpen}
        onClose={() => setIsRouteLinksModalOpen(false)}
        onNavigate={navigateTo}
        onSelectRole={handleSelectRoleFromModal}
      />

      {/* Role Switch / URL Welcome Toast */}
      {roleWelcomeToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-slate-100">{roleWelcomeToast}</span>
            <button
              onClick={() => setRoleWelcomeToast(null)}
              className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Direct Page Navigation Bar (Hanya tampil di mode dev/testing) */}
      {shouldShowRoleLinksTrigger() && (
        <aside className="bg-slate-900 border-t border-slate-800 text-slate-300 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-slate-200">Tautan Langsung Halaman:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigateTo('user')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer border border-slate-700 transition-colors"
                title="Akses Langsung Halaman Pengguna"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Halaman Pengguna (/user)</span>
              </button>

              <button
                onClick={() => navigateTo('user-login')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-200 font-semibold cursor-pointer border border-blue-800 transition-colors"
                title="Akses Langsung Halaman Login Pengguna"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Login Pengguna (/user/login)</span>
              </button>

              <button
                onClick={() => navigateTo('admin')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-200 font-semibold cursor-pointer border border-amber-800 transition-colors"
                title="Akses Langsung Halaman Login/Dashboard Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Halaman Admin (/admin)</span>
              </button>

              <button
                onClick={() => setIsRouteLinksModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors shadow-2xs"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Daftar & Salin Link</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-semibold text-slate-300">
            Kamus & Pelestarian Bahasa Daerah Sulawesi Tenggara (Tolaki • Moronene • Muna • Buton)
          </p>
          <p>
            Platform Edukasi Digital, Kosakata Komunitas & Game Pembelajaran Bahasa Sultra 🌾🌿🪁🏰
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 border-t border-slate-900">
            <span className="text-slate-400">Mode Akses: Pengguna Umum Bebas Tanpa Login</span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => navigateTo('user-login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              Login Pengguna (/user/login)
            </button>
            {shouldShowAdminInNavbar(Boolean(adminUser)) && (
              <>
                <span className="hidden sm:inline">•</span>
                <button
                  id="footer-admin-btn"
                  onClick={() => navigateTo('admin')}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{adminUser ? 'Buka Dashboard Admin (/admin)' : 'Portal Administrator Login (/admin)'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}
