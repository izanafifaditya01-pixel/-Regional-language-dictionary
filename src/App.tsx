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
  isSecretAdminPath,
  isSecretAdminLoginPath,
  getSecretAdminSlug,
} from './utils/portalConfig';

/**
 * Menentukan rute awal dengan proteksi Link Rahasia Admin:
 * - Rute publik (`/`, `/user`) langsung merender Kamus User tanpa menu/gerbang Admin.
 * - Rute tebakan umum (`/admin`, `/admin/login`, `/portal`, `?role=admin`) diblokir & disamarkan menjadi Kamus User (`/`).
 * - Konsol Admin HANYA dapat dibuka melalui path rahasia (`/kunci-admin-9x7k4m2p`).
 */
function resolveInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'user';

  const pathname = window.location.pathname;
  const lowerPath = pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);

  // 1. Jika build dikunci khusus User (`VITE_PORTAL_MODE=user`) -> blokir semua akses Admin termasuk link rahasia
  if (isStrictUserPortal()) {
    if (lowerPath.includes('/user/login') || lowerPath === '/login' || search.get('page') === 'user-login') {
      return 'user-login';
    }
    return 'user';
  }

  // 2. Jika build khusus Admin (`VITE_PORTAL_MODE=admin` atau subdomain admin khusus)
  if (isStrictAdminPortal()) {
    return getAdminSession() ? 'admin' : 'admin-login';
  }

  // 3. Cek apakah diakses menggunakan Link Rahasia Admin yang presisi
  if (isSecretAdminPath(pathname)) {
    if (isSecretAdminLoginPath(pathname)) {
      return 'admin-login';
    }
    return getAdminSession() ? 'admin' : 'admin-login';
  }

  // 4. Halaman Login User
  if (lowerPath === '/user/login' || lowerPath === '/login' || search.get('page') === 'user-login') {
    return 'user-login';
  }

  // 5. Semua path lain (termasuk `/`, `/user`, maupun tebakan seperti `/admin`, `/portal`, `/dashboard`)
  // otomatis disamarkan ke beranda Kamus User agar User tidak mengetahui keberadaan rute Admin.
  if (lowerPath !== '/' && lowerPath !== '/user') {
    try {
      window.history.replaceState({ route: 'user' }, '', '/');
    } catch {
      // Ignore history restriction in sandboxed iframe
    }
  }

  return 'user';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(resolveInitialRoute);

  // Sesi Role Admin (Terpisah penuh dari Sesi Role User)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getAdminSession());

  // Sesi & Profil Role User (Terpisah penuh dari Sesi Role Admin)
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());

  // Notifikasi singkat
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Tab aktif di dalam Kamus User
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

  // Kamus Publik Terverifikasi (Hanya memuat entri berstatus 'approved')
  const mergedDictionary = useMemo(() => {
    return getMergedDictionary(contributedWords);
  }, [contributedWords]);

  // Modals di Kamus User
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

  // Simpan perubahan profil user ke localStorage
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // ==========================================
  // HANDLER KHUSUS USER
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
    showToast(`Selamat datang, ${authenticatedProfile.name}`);
  };

  const handleLearnerLogout = () => {
    const resetGuest = logoutLearner();
    setUserProfile(resetGuest);
    showToast('Anda telah keluar dari akun pembelajar.');
  };

  // ==========================================
  // HANDLER KHUSUS ADMIN (HANYA VIA LINK RAHASIA)
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
    showToast(`Otorisasi Admin aktif: ${admin.name}`);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    navigateTo('admin-login');
    showToast('Sesi Admin telah diakhiri.');
  };

  // ==========================================
  // PENJAGA RUTE & ISOLASI LINK RAHASIA
  // ==========================================
  const navigateTo = (requestedRoute: PageRoute) => {
    let targetRoute: PageRoute = requestedRoute;

    if (isStrictUserPortal()) {
      if (targetRoute !== 'user' && targetRoute !== 'user-login') {
        targetRoute = 'user';
      }
    }

    if (isStrictAdminPortal()) {
      if (targetRoute !== 'admin' && targetRoute !== 'admin-login') {
        targetRoute = adminUser ? 'admin' : 'admin-login';
      }
    }

    if (targetRoute === 'portal') {
      targetRoute = 'user';
    }

    if (targetRoute === 'admin' && !getAdminSession() && !adminUser) {
      targetRoute = 'admin-login';
    }

    setCurrentRoute(targetRoute);

    if (typeof window !== 'undefined') {
      const secretSlug = getSecretAdminSlug();
      let newPath = '/';
      if (targetRoute === 'admin') {
        newPath = isStrictAdminPortal() ? '/' : `/${secretSlug}`;
      } else if (targetRoute === 'admin-login') {
        newPath = isStrictAdminPortal() ? '/login' : `/${secretSlug}/login`;
      } else if (targetRoute === 'user-login') {
        newPath = '/user/login';
      } else {
        newPath = '/';
      }

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
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
  // ROLE ADMIN — LOGIN RAHASIA (Hanya tampil pada Link Rahasia Admin)
  // -------------------------------------------------------------
  if (
    !isStrictUserPortal() &&
    (currentRoute === 'admin-login' || (currentRoute === 'admin' && !adminUser))
  ) {
    return (
      <>
        <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
        {renderToast()}
      </>
    );
  }

  // -------------------------------------------------------------
  // ROLE ADMIN — DASHBOARD PENGELOLAAN (Hanya setelah Login di Link Rahasia)
  // -------------------------------------------------------------
  if (!isStrictUserPortal() && currentRoute === 'admin' && adminUser) {
    return (
      <>
        <AdminDashboardView
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          allWords={mergedDictionary}
          contributedWords={contributedWords}
          onAddWord={handleAdminAddOfficialWord}
          onUpdateWord={handleAdminUpdateWord}
          onDeleteWord={handleAdminDeleteWord}
          onWordsUpdated={setContributedWords}
        />
        {renderToast()}
      </>
    );
  }

  // -------------------------------------------------------------
  // ROLE USER — HALAMAN LOGIN / DAFTAR PEMBELAJAR (/user/login)
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
  // ROLE USER — BERANDA KAMUS PUBLIK (`/` & `/user`)
  // (100% Murni Tanpa Menu Admin, Tanpa Link Admin, Tanpa Pemilih Role)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F6F1] text-stone-900 font-sans flex flex-col antialiased selection:bg-[#14532D]/15 selection:text-[#14532D]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
      />

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

      {languageModalType && (
        <LanguageSelectorModal
          type={languageModalType}
          selectedLangId={languageModalType === 'source' ? sourceLang.id : targetLang.id}
          onSelectLanguage={handleSelectLanguage}
          onClose={() => setLanguageModalType(null)}
        />
      )}

      {renderToast()}

      {/* Pure Public Dictionary Footer — Zero Mention of Admin or Roles */}
      <footer className="bg-[#EFECE4]/75 text-stone-600 py-10 border-t border-stone-200/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <p className="font-serif text-base font-bold text-stone-900 tracking-tight">
              Leksika Nusantara — Kamus Bahasa Daerah Sulawesi Tenggara
            </p>
            <p className="text-stone-600 leading-relaxed">
              Dokumentasi leksikon, pelafalan fonetis, dan ruang belajar interaktif rumpun bahasa Tolaki · Moronene · Muna · Buton.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
            <span>Arsip Leksikon Publik</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateTo('user-login')}
              className="text-[#14532D] hover:text-[#166534] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {userProfile.isAuthenticated ? 'Akun Pembelajar Saya' : 'Masuk / Daftar Pembelajar'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
