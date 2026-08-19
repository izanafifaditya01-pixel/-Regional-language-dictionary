import React from 'react';
import { BookMarked, BrainCircuit, Sparkles, User, Award, Flame, Languages, Search, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'dictionary' | 'translate' | 'learn' | 'quiz' | 'ai' | 'profile';
  setActiveTab: (tab: 'dictionary' | 'translate' | 'learn' | 'quiz' | 'ai' | 'profile') => void;
  userProfile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userProfile }) => {
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
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              id="nav-tab-dictionary"
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Belajar</span>
            </button>

            <button
              id="nav-tab-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Kuis</span>
            </button>

            <button
              id="nav-tab-ai"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tutor AI</span>
            </button>
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
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-6 gap-1">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium ${
              activeTab === 'dictionary' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span>Kamus</span>
          </button>

          <button
            onClick={() => setActiveTab('translate')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium ${
              activeTab === 'translate' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Languages className="w-4 h-4 mb-0.5" />
            <span>Terjemah</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium ${
              activeTab === 'learn' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Belajar</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium ${
              activeTab === 'quiz' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BrainCircuit className="w-4 h-4 mb-0.5" />
            <span>Kuis</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium ${
              activeTab === 'ai' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-amber-500" />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium ${
              activeTab === 'profile' ? 'text-green-700 font-bold' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>Profil</span>
          </button>
        </div>
      </div>
    </header>
  );
};
