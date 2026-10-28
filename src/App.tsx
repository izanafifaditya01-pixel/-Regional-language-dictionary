import React, { useState, useEffect, useMemo } from 'react';
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
import { RolePortalGateway } from './components/RolePortalGateway';

import { WordEntry, Language, UserProfile, AppTab, AdminUser, PageRoute } from './types';
import { LANGUAGES_DATA } from './data/languagesData';
import {
  loadUserProfile,
  saveUserProfile,
  logoutLearner,
  addXpToProfile,
  toggleBookmarkInProfile,
  addHistoryToProfile,
  recordGameScoreInProfile,
  recordWheelSpinInProfile,
  claimDailyQuestInProfile,
} from './utils/userStorage';
import {
  loadContributedWords,
  addContributedWord,
  updateContributedWord,
  deleteContributedWord,
  getMergedDictionary,
} from './utils/userContributedWords';
import { getAdminSession, logoutAdmin } from './utils/adminAuth';
import {
  upsertWordToSupabase,
  deleteWordFromSupabase,
  fetchWordsFromSupabase,
} from './utils/supabaseService';
import {
  isStrictUserPortal,
  isStrictAdminPortal,
  isUnifiedPortalMode,
  shouldShowRoleLinksTrigger,
} from './utils/portalConfig';

/**
 * Menentukan rute awal berdasarkan mode isolasi portal (Build User, Build Admin, atau Unified)
 */
function resolveInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'user';

  // 1. Jika build khusus Role Pengguna (`npm run build:user` / `VITE_PORTAL_MODE=user`)
  // Kunci mutlak ke Portal Pengguna, blokir semua akses ke /admin atau /portal
  if (isStrictUserPortal()) {
    const path = window.location.pathname.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    if (path.includes('/user/login') || search.get('page') === 'user-login') {
      return 'user-login';
    }
    return 'user';
  }

  // 2. Jika build khusus Role Admin (`npm run build:admin` / `VITE_PORTAL_MODE=admin` / `admin.*`)
  // Kunci mutlak ke Portal Administrator, blokir semua akses ke /user atau /portal
  if (isStrictAdminPortal()) {
    return getAdminSession() ? 'admin' : 'admin-login';
  }

  // 3. Mode Pratinjau Terpadu (`unified` — lingkungan preview / single domain)
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const pageParam = search.get('page') || search.get('view') || search.get('route');
  const roleParam = search.get('role');

  if (
    roleParam === 'user-login' ||
    path.includes('/user/login') ||
    hash.includes('user/login') ||
    pageParam === 'user-login'
  ) {
    return 'user-login';
  }

  if (
    roleParam === 'user' ||
    path.startsWith('/user') ||
    hash.includes('#/user') ||
    pageParam === 'user'
  ) {
    return 'user';
  }

  if (
    path.includes('/admin/login') ||
    hash.includes('admin/login') ||
    pageParam === 'admin-login'
  ) {
    return 'admin-login';
  }

  if (
    roleParam === 'admin' ||
    roleParam === 'superadmin' ||
    roleParam === 'editor' ||
    roleParam === 'moderator' ||
    roleParam === 'viewer' ||
    path.startsWith('/admin') ||
    hash.includes('admin') ||
    pageParam === 'admin'
  ) {
    // Wajib autentikasi sesi admin: tidak pernah auto-login tanpa kredensial
    return getAdminSession() ? 'admin' : 'admin-login';
  }

  if (path.startsWith('/portal') || pageParam === 'portal') {
    return 'portal';
  }

  // Pada mode unified di root `/`, tampilkan Gerbang Pemilih Portal (Role Pengguna vs Role Admin)
  return 'portal';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(resolveInitialRoute);

  // Sesi Role Admin (Terpisah penuh dari Sesi Role Pengguna)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getAdminSession());

  // Sesi & Profil Role Pengguna (Terpisah penuh dari Sesi Role Admin)
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());

  // Utilitas Tautan Dev (hanya aktif dengan ?show_links=1)
  const [isRouteLinksModalOpen, setIsRouteLinksModalOpen] = useState(false);

  // Notifikasi singkat perpindahan sesi
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Tab aktif di dalam Portal Pengguna
  const [activeTab, setActiveTab] = useState<AppTab>('dictionary');

  // Pasangan Bahasa (Default: Indonesia -> Tolaki)
  const [sourceLang, setSourceLang] = useState<Language>(
    LANGUAGES_DATA.find(l => l.id === 'ind') || LANGUAGES_DATA[0]
  );
  const [targetLang, setTargetLang] = useState<Language>(
    LANGUAGES_DATA.find(l => l.id === 'tk') || LANGUAGES_DATA[1]
  );

  // Daftar kata usulan komunitas & penambahan admin
  const [contributedWords, setContributedWords] = useState<WordEntry[]>(loadContributedWords());

  // Kamus Publik Terverifikasi (Hanya memuat entri yang sudah berstatus 'approved')
  const mergedDictionary = useMemo(() => {
    return getMergedDictionary(contributedWords);
  }, [contributedWords]);

  const pendingModerationCount = useMemo(
    () => contributedWords.filter(w => w.moderationStatus === 'pending').length,
    [contributedWords]
  );

  // Modals di Portal Pengguna
  const [selectedWordForDetail, setSelectedWordForDetail] = useState<WordEntry | null>(null);
  const [languageModalType, setLanguageModalType] = useState<'source' | 'target' | null>(null);
  const [aiPromptWord, setAiPromptWord] = useState<WordEntry | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 4000);
  };

  // Sinkronisasi awal kata dari Supabase jika terkonfigurasi
  useEffect(() => {
    fetchWordsFromSupabase()
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setContributedWords(prev => {
            const prevMap = new Map(prev.map(w => [w.id, w]));
            res.data!.forEach(w => prevMap.set(w.id, { ...w, moderationStatus: w.moderationStatus || 'approved' }));
            return Array.from(prevMap.values());
          });
        }
      })
      .catch(() => {
        // Fallback ke kamus lokal
      });
  }, []);

  // Kosakata Pilihan Hari Ini
  const wordOfTheDay = useMemo(() => {
    const langWords = mergedDictionary.filter(w => w.targetLangId === targetLang.id);
    return langWords.find(w => w.isWordOfTheDay) || langWords[0] || mergedDictionary[0];
  }, [mergedDictionary, targetLang]);

  // Simpan perubahan profil pengguna ke localStorage khusus pengguna
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // ==========================================
  // HANDLER KHUSUS PORTAL PENGGUNA (ROLE PENGGUNA)
  // ==========================================
  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleSelectLanguage = (lang: Language) => {
    if (languageModalType === 'source') {
      setSourceLang(lang);
    } else if (languageModalType === 'target') {
      setTargetLang(lang);
    }
  };

  const handleAddXp = (amount: number) => {
    const { updatedProfile } = addXpToProfile(userProfile, amount);
    setUserProfile(updatedProfile);
  };

  const handleToggleBookmark = (wordId: string) => {
    const updated = toggleBookmarkInProfile(userProfile, wordId);
    setUserProfile(updated);
  };

  const handleSelectWordDetail = (word: WordEntry) => {
    setSelectedWordForDetail(word);
    const updated = addHistoryToProfile(userProfile, {
      wordId: word.id,
      word: word.word,
      translation: word.translation,
      sourceLangId: sourceLang.id,
      targetLangId: targetLang.id,
    });
    setUserProfile(updated);
  };

  const handleQuickSearchSelect = (langId: string) => {
    const found = LANGUAGES_DATA.find(l => l.id === langId);
    if (found) {
      setTargetLang(found);
      setActiveTab('dictionary');
    }
  };

  const handleAskAiAboutWord = (word: WordEntry) => {
    setAiPromptWord(word);
    setActiveTab('ai');
  };

  const handleClearHistory = () => {
    setUserProfile(prev => ({ ...prev, history: [] }));
  };

  const handleRecordGameScore = (gameId: string, score: number) => {
    const { updatedProfile } = recordGameScoreInProfile(userProfile, gameId, score);
    setUserProfile(updatedProfile);
  };

  const handleRecordWheelSpin = () => {
    const updated = recordWheelSpinInProfile(userProfile);
    setUserProfile(updated);
  };

  const handleClaimQuest = (questId: string) => {
    const updated = claimDailyQuestInProfile(userProfile, questId);
    setUserProfile(updated);
  };

  // Pengguna mengajukan usulan kata -> Masuk antrean 'pending' (tidak langsung ke kamus utama)
  const handleSubmitUserProposal = (
    wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>,
    contributorName: string
  ) => {
    const { updatedList } = addContributedWord(wordData, contributorName, {
      autoApprove: false,
      isOfficialAdmin: false,
    });
    setContributedWords(updatedList);
    handleAddXp(30);
  };

  const handleLearnerAuthSuccess = (authenticatedProfile: UserProfile) => {
    setUserProfile(authenticatedProfile);
    navigateTo('user');
    showToast(`Masuk sebagai Pengguna: ${authenticatedProfile.name}`);
  };

  const handleLearnerLogout = () => {
    const resetGuest = logoutLearner();
    setUserProfile(resetGuest);
    showToast('Anda telah keluar dari akun pembelajar.');
  };

  // ==========================================
  // HANDLER KHUSUS PORTAL ADMIN (ROLE ADMIN)
  // ==========================================
  const handleAdminAddOfficialWord = (
    wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>,
    adminName: string
  ) => {
    const { word, updatedList } = addContributedWord(wordData, adminName, {
      autoApprove: true,
      isOfficialAdmin: true,
    });
    setContributedWords(updatedList);
    upsertWordToSupabase(word).catch(err => {
      console.warn('Supabase async upsert notice:', err);
    });
  };

  const handleAdminUpdateWord = (wordId: string, updatedFields: Partial<WordEntry>) => {
    const updatedList = updateContributedWord(wordId, updatedFields);
    setContributedWords(updatedList);
    const updatedWord = updatedList.find(w => w.id === wordId);
    if (updatedWord && updatedWord.moderationStatus !== 'pending') {
      upsertWordToSupabase(updatedWord).catch(err => {
        console.warn('Supabase async update notice:', err);
      });
    }
  };

  const handleAdminDeleteWord = (wordId: string) => {
    const updatedList = deleteContributedWord(wordId);
    setContributedWords(updatedList);
    deleteWordFromSupabase(wordId).catch(err => {
      console.warn('Supabase async delete notice:', err);
    });
  };

  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setAdminUser(admin);
    navigateTo('admin');
    showToast(`Otorisasi Admin aktif: ${admin.name} (${admin.role})`);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    navigateTo('admin-login');
    showToast('Sesi Administrator telah diakhiri.');
  };

  // ==========================================
  // PENJAGA RUTE & NAVIGASI TERISOLASI
  // ==========================================
  const navigateTo = (requestedRoute: PageRoute) => {
    let targetRoute: PageRoute = requestedRoute;

    // Penjaga ketat untuk Build Khusus Pengguna
    if (isStrictUserPortal()) {
      if (targetRoute !== 'user' && targetRoute !== 'user-login') {
        targetRoute = 'user';
      }
    }

    // Penjaga ketat untuk Build Khusus Admin
    if (isStrictAdminPortal()) {
      if (targetRoute !== 'admin' && targetRoute !== 'admin-login') {
        targetRoute = adminUser ? 'admin' : 'admin-login';
      }
    }

    // Proteksi rute dashboard admin: wajib punya sesi admin
    if (targetRoute === 'admin' && !getAdminSession() && !adminUser) {
      targetRoute = 'admin-login';
    }

    setCurrentRoute(targetRoute);

    if (typeof window !== 'undefined') {
      let newPath = '/';
      if (targetRoute === 'portal') newPath = '/portal';
      else if (targetRoute === 'admin') newPath = '/admin';
      else if (targetRoute === 'admin-login') newPath = '/admin/login';
      else if (targetRoute === 'user-login') newPath = '/user/login';
      else if (targetRoute === 'user') newPath = isStrictUserPortal() ? '/' : '/user';

      try {
        window.history.pushState({ route: targetRoute }, '', newPath);
      } catch {
        // Ignore history pushState restriction in sandboxed iframe
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(resolveInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleSelectRoleFromModal = (roleTarget: string) => {
    if (roleTarget === 'user') {
      navigateTo('user');
    } else if (roleTarget === 'user-login') {
      navigateTo('user-login');
    } else {
      navigateTo(adminUser ? 'admin' : 'admin-login');
    }
  };

  const renderToast = () =>
    statusToast ? (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-stone-900 text-stone-100 px-4 py-3 rounded-xl shadow-lg border border-stone-700 flex items-center gap-3 text-xs font-medium">
          <span>{statusToast}</span>
          <button
            type="button"
            onClick={() => setStatusToast(null)}
            className="text-stone-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    ) : null;

  // -------------------------------------------------------------
  // GERBANG PEMILIH PORTAL (Hanya tampil di Mode Unified / Pratinjau)
  // -------------------------------------------------------------
  if (currentRoute === 'portal' && isUnifiedPortalMode()) {
    return (
      <>
        <RolePortalGateway
          userProfile={userProfile}
          adminUser={adminUser}
          totalWordsCount={mergedDictionary.length}
          pendingModerationCount={pendingModerationCount}
          onNavigate={navigateTo}
        />
        {renderToast()}
      </>
    );
  }

  // -------------------------------------------------------------
  // PORTAL ROLE ADMIN — HALAMAN LOGIN ADMIN (/admin/login)
  // -------------------------------------------------------------
  if (
    !isStrictUserPortal() &&
    (currentRoute === 'admin-login' || (currentRoute === 'admin' && !adminUser))
  ) {
    return (
      <>
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onNavigateToPortalGateway={
            isUnifiedPortalMode() ? () => navigateTo('portal') : undefined
          }
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
        {renderToast()}
      </>
    );
  }

  // -------------------------------------------------------------
  // PORTAL ROLE ADMIN — DASHBOARD KURATOR & ADMIN (/admin)
  // -------------------------------------------------------------
  if (!isStrictUserPortal() && currentRoute === 'admin' && adminUser) {
    return (
      <>
        <AdminDashboardView
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onNavigateToPortalGateway={
            isUnifiedPortalMode() ? () => navigateTo('portal') : undefined
          }
          onOpenLinksModal={() => setIsRouteLinksModalOpen(true)}
          onSwitchAdminUser={setAdminUser}
          allWords={mergedDictionary}
          contributedWords={contributedWords}
          onAddWord={handleAdminAddOfficialWord}
          onUpdateWord={handleAdminUpdateWord}
          onDeleteWord={handleAdminDeleteWord}
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
        {renderToast()}
      </>
    );
  }

  // -------------------------------------------------------------
  // PORTAL ROLE PENGGUNA — HALAMAN LOGIN / DAFTAR AKUN PENGGUNA (/user/login)
  // -------------------------------------------------------------
  if (!isStrictAdminPortal() && currentRoute === 'user-login') {
    return (
      <>
        <UserLoginPage
          currentUserProfile={userProfile}
          onAuthSuccess={handleLearnerAuthSuccess}
          onContinueAsGuest={() => navigateTo('user')}
        />
        {renderToast()}
      </>
    );
  }

  // -------------------------------------------------------------
  // PORTAL ROLE PENGGUNA — RUANG BELAJAR & KAMUS PUBLIK (/user)
  // (100% Bebas dari Banner Admin, Tombol Admin, & Hak Akses Admin)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F6F1] text-stone-900 font-sans flex flex-col antialiased selection:bg-[#14532D]/15 selection:text-[#14532D]">
      {/* Pure User Role Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
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

      {/* Main User Workspace Container */}
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
            onSubmitProposal={handleSubmitUserProposal}
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
            allWords={mergedDictionary}
            onSelectWordDetail={handleSelectWordDetail}
            onClearHistory={handleClearHistory}
            onNavigateToLogin={() => navigateTo('user-login')}
            onLogoutLearner={handleLearnerLogout}
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

      {/* Dev Route Links Modal (Only with ?show_links=1) */}
      {shouldShowRoleLinksTrigger() && (
        <RouteLinksModal
          isOpen={isRouteLinksModalOpen}
          onClose={() => setIsRouteLinksModalOpen(false)}
          onNavigate={navigateTo}
          onSelectRole={handleSelectRoleFromModal}
        />
      )}

      {renderToast()}

      {/* Editorial Institutional Footer (Pure User Context; Quiet Portal Switcher Only in Unified Preview) */}
      <footer className="bg-[#EFECE4]/75 text-stone-600 py-10 border-t border-stone-200/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <p className="font-serif text-base font-bold text-stone-900 tracking-tight">
              Leksika Nusantara — Portal Pengguna &amp; Pembelajar
            </p>
            <p className="text-stone-600 leading-relaxed">
              Dokumentasi leksikon, pelafalan fonetis, dan pembelajaran interaktif rumpun bahasa Tolaki · Moronene · Muna · Buton.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
            <span>Role: Pengguna Publik</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('user-login')}
              className="text-[#14532D] hover:text-[#166534] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {userProfile.isAuthenticated ? 'Akun Pembelajar' : 'Masuk / Daftar Pengguna'}
            </button>
            {isUnifiedPortalMode() && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => navigateTo('portal')}
                  className="text-stone-700 hover:text-stone-950 font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ganti Portal Role
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
