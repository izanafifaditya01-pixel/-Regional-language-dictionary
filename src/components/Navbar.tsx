import React from 'react';
import { BookMarked, BrainCircuit, Sparkles, User, Award, Flame, Languages, Search, BookOpen, Gamepad2, PlusCircle, ShieldCheck, Lock, Link2, LogIn } from 'lucide-react';
import { UserProfile, AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userProfile: UserProfile;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin: () => void;
  onGoToAdminDashboard: () => void;
  onNavigateToUserLogin?: () => void;
  onOpenLinksModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onGoToAdminDashboard,
  onNavigateToUserLogin,
  onOpenLinksModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('dictionary')} 
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:bg-green-800 transition-colors shrink-0">
              LN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800">
                  Leksika Nusantara
                </span>
                <span className="hidden md:inline-block px-2.5 py-0.5 text-[10px] font-bold bg-green-50 text-green-800 border border-green-200 rounded-full">
                  Leksika AI
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Kamus & Edukasi Bahasa Daerah Indonesia</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              id="nav-tab-dictionary"
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'dictionary'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Kamus</span>
            </button>

            <button
              id="nav-tab-translate"
              onClick={() => setActiveTab('translate')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'translate'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Languages className="w-4 h-4 text-amber-300" />
              <span>Penerjemah</span>
            </button>

            <button
              id="nav-tab-learn"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Belajar</span>
            </button>

            <button
              id="nav-tab-games"
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-600" />
              <span className="flex items-center gap-1">
                <span>Games</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              </span>
            </button>

            <button
              id="nav-tab-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Kuis</span>
            </button>

            <button
              id="nav-tab-contribute"
              onClick={() => setActiveTab('contribute')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'contribute'
                  ? 'bg-emerald-700 text-white shadow-xs font-black'
                  : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/70'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span className="flex items-center gap-1">
                <span>Pengembangan</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded-sm font-bold">+Kata</span>
              </span>
            </button>

            <button
              id="nav-tab-ai"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tutor AI</span>
            </button>
          </nav>

          {/* Medium Screen (md to lg) Navigation */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['dictionary', 'translate', 'learn', 'games', 'quiz', 'contribute', 'ai'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? tab === 'games' ? 'bg-amber-400 text-slate-950' : 'bg-green-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={tab.toUpperCase()}
              >
                {tab === 'dictionary' && <Search className="w-4 h-4" />}
                {tab === 'translate' && <Languages className="w-4 h-4" />}
                {tab === 'learn' && <BookOpen className="w-4 h-4" />}
                {tab === 'games' && <Gamepad2 className="w-4 h-4 text-amber-600" />}
                {tab === 'quiz' && <BrainCircuit className="w-4 h-4" />}
                {tab === 'contribute' && <PlusCircle className="w-4 h-4 text-emerald-600" />}
                {tab === 'ai' && <Sparkles className="w-4 h-4" />}
              </button>
            ))}
          </nav>

          {/* User Gamification Stats & Profile Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{userProfile.streak} Hari</span>
            </div>

            {/* Level & XP Badge */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full text-green-800 text-xs font-bold cursor-pointer transition-colors"
              id="user-xp-badge"
            >
              <Award className="w-4 h-4 text-green-700" />
              <span className="hidden sm:inline">Lvl {userProfile.level}</span>
              <span className="bg-green-700 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {userProfile.xp} XP
              </span>
            </div>

            {/* User Profile Tab Trigger */}
            <button
              id="nav-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Profil & Favorit"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Direct Links Modal Trigger */}
            {onOpenLinksModal && (
              <button
                id="nav-btn-links"
                onClick={onOpenLinksModal}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer hidden sm:flex items-center justify-center"
                title="Lihat & Salin Tautan Halaman (Admin / User)"
              >
                <Link2 className="w-4 h-4 text-slate-600" />
              </button>
            )}

            {/* Login Pengguna (Dedicated Link) */}
            {onNavigateToUserLogin && (
              <button
                id="nav-btn-user-login"
                onClick={onNavigateToUserLogin}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all cursor-pointer"
                title="Halaman Login Akun Pengguna (/user/login)"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login User</span>
              </button>
            )}

            {/* Portal Admin Entry Point */}
            {isAdminLoggedIn ? (
              <button
                id="nav-btn-admin-dashboard"
                onClick={onGoToAdminDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-black shadow-xs border border-slate-700 transition-all cursor-pointer"
                title="Buka Halaman Dashboard Administrator (/admin)"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Portal Admin</span>
              </button>
            ) : (
              <button
                id="nav-btn-admin-login"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-xs"
                title="Masuk ke Halaman Login Admin (/admin)"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-1 py-1.5 shadow-lg">
        <div className="grid grid-cols-8 gap-0.5 text-center">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'dictionary' ? 'text-green-700 font-black' : 'text-slate-500'
            }`}
          >
            <Search className="w-3.5 h-3.5 mb-0.5" />
            <span>Kamus</span>
          </button>

          <button
            onClick={() => setActiveTab('translate')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'translate' ? 'text-green-700 font-black' : 'text-slate-500'
            }`}
          >
            <Languages className="w-3.5 h-3.5 mb-0.5" />
            <span>Terjemah</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'learn' ? 'text-green-700 font-black' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mb-0.5" />
            <span>Belajar</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium relative ${
              activeTab === 'games' ? 'text-amber-600 font-black' : 'text-slate-700 font-bold'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 mb-0.5 text-amber-500" />
            <span>Games</span>
            <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'quiz' ? 'text-green-700 font-black' : 'text-slate-500'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 mb-0.5" />
            <span>Kuis</span>
          </button>

          <button
            onClick={() => setActiveTab('contribute')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'contribute' ? 'text-emerald-700 font-black bg-emerald-50 rounded-lg' : 'text-emerald-700 font-bold'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 mb-0.5 text-emerald-600" />
            <span>+Kata</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'ai' ? 'text-green-700 font-black' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mb-0.5 text-amber-500" />
            <span>AI</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[8.5px] font-medium ${
              activeTab === 'profile' ? 'text-green-700 font-black' : 'text-slate-500'
            }`}
          >
            <User className="w-3.5 h-3.5 mb-0.5" />
            <span>Profil</span>
          </button>
        </div>
      </div>
    </header>
  );
};

