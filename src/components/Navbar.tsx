import React from 'react';
import {
  BrainCircuit,
  User,
  Languages,
  Search,
  BookOpen,
  Gamepad2,
  PlusCircle,
  ShieldCheck,
  Lock,
  Link2,
  MessageSquareText,
} from 'lucide-react';
import { UserProfile, AppTab } from '../types';
import { shouldShowAdminInNavbar, shouldShowRoleLinksTrigger } from '../utils/portalConfig';

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

const NAV_ITEMS: { id: AppTab; label: string; mobileLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dictionary', label: 'Kamus', mobileLabel: 'Kamus', icon: Search },
  { id: 'translate', label: 'Penerjemah', mobileLabel: 'Terjemah', icon: Languages },
  { id: 'learn', label: 'Belajar', mobileLabel: 'Belajar', icon: BookOpen },
  { id: 'games', label: 'Permainan', mobileLabel: 'Main', icon: Gamepad2 },
  { id: 'quiz', label: 'Kuis', mobileLabel: 'Kuis', icon: BrainCircuit },
  { id: 'contribute', label: 'Kontribusi', mobileLabel: 'Usul', icon: PlusCircle },
  { id: 'ai', label: 'Tutor Bahasa', mobileLabel: 'Tutor', icon: MessageSquareText },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onGoToAdminDashboard,
  onOpenLinksModal,
}) => {
  const showAdminControl = shouldShowAdminInNavbar(Boolean(isAdminLoggedIn));
  const showDevLinks = Boolean(onOpenLinksModal && shouldShowRoleLinksTrigger());

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

          {/* Zone 2: Clean Typographic Navigation Links */}
          <nav
            aria-label="Navigasi Utama"
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

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {showDevLinks && (
              <button
                id="nav-btn-links"
                type="button"
                onClick={onOpenLinksModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Tautan Akses Role"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Tautan Role</span>
              </button>
            )}

            {showAdminControl ? (
              <button
                id={isAdminLoggedIn ? 'nav-btn-admin-dashboard' : 'nav-btn-admin-login'}
                type="button"
                onClick={isAdminLoggedIn ? onGoToAdminDashboard : onOpenAdminLogin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isAdminLoggedIn ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Portal Admin</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </>
                )}
              </button>
            ) : (
              <button
                id="nav-tab-profile"
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                  activeTab === 'profile'
                    ? 'bg-[#14532D] text-white'
                    : 'bg-[#14532D] hover:bg-[#166534] text-white'
                }`}
                title="Profil Pembelajar & Kosakata Tersimpan"
              >
                <User className="w-4 h-4" />
                <span>Profil · Lvl {userProfile.level}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Compact <= 56px height) */}
      <nav
        aria-label="Navigasi Seluler"
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
