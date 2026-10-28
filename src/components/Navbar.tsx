import React from 'react';
import {
  BrainCircuit,
  User,
  Languages,
  Search,
  BookOpen,
  Gamepad2,
  PlusCircle,
  MessageSquareText,
} from 'lucide-react';
import { UserProfile, AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userProfile: UserProfile;
}

const NAV_ITEMS: {
  id: AppTab;
  label: string;
  mobileLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dictionary', label: 'Kamus', mobileLabel: 'Kamus', icon: Search },
  { id: 'translate', label: 'Penerjemah', mobileLabel: 'Terjemah', icon: Languages },
  { id: 'learn', label: 'Belajar', mobileLabel: 'Belajar', icon: BookOpen },
  { id: 'games', label: 'Permainan', mobileLabel: 'Main', icon: Gamepad2 },
  { id: 'quiz', label: 'Kuis', mobileLabel: 'Kuis', icon: BrainCircuit },
  { id: 'contribute', label: 'Usul Kata', mobileLabel: 'Usul', icon: PlusCircle },
  { id: 'ai', label: 'Tutor Bahasa', mobileLabel: 'Tutor', icon: MessageSquareText },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('dictionary')}
            id="brand-logo"
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Leksika Nusantara
          </button>

          {/* Zone 2: Clean Typographic Navigation Links (User Role Only) */}
          <nav
            aria-label="Navigasi Pengguna"
            className="hidden md:flex items-center gap-5 lg:gap-7 h-full overflow-x-auto no-scrollbar"
          >
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative h-full inline-flex items-center text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'font-semibold text-[#14532D]'
                      : 'font-medium text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#14532D] transition-opacity duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action (User Profile & Account Only — Never Admin) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="nav-tab-profile"
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                activeTab === 'profile'
                  ? 'bg-stone-900 text-white'
                  : 'bg-[#14532D] hover:bg-[#166534] text-white'
              }`}
              title="Profil Pembelajar & Akun Pengguna"
            >
              <User className="w-4 h-4" />
              <span>
                {userProfile.isAuthenticated
                  ? `Profil · Lvl ${userProfile.level}`
                  : `Akun · Lvl ${userProfile.level}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Compact <= 56px height) */}
      <nav
        aria-label="Navigasi Seluler Pengguna"
        className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#F8F6F1]/95 backdrop-blur-md border-t border-stone-200 z-50 px-1 flex items-center"
      >
        <div className="grid grid-cols-8 w-full text-center">
          {NAV_ITEMS.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 text-[10px] transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-[#14532D] font-semibold' : 'text-stone-500 font-medium'
                }`}
              >
                <IconComp className="w-4 h-4 mb-0.5" />
                <span className="truncate max-w-full px-0.5">{item.mobileLabel}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'profile' ? 'text-[#14532D] font-semibold' : 'text-stone-500 font-medium'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>Profil</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
