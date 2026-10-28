import React, { useState } from 'react';
import { User, Sparkles, ArrowRight, ShieldCheck, Check, Copy, ArrowLeft, BookOpen, Heart, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface UserLoginPageProps {
  currentUserProfile: UserProfile;
  onUpdateUserProfile: (name: string, email?: string) => void;
  onContinueAsGuest: () => void;
  onNavigateToAdminLogin?: () => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({
  currentUserProfile,
  onUpdateUserProfile,
  onContinueAsGuest,
}) => {
  const [name, setName] = useState(currentUserProfile.name === 'Penjelajah Bahasa' ? '' : currentUserProfile.name);
  const [email, setEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Penjelajah Bahasa';
    onUpdateUserProfile(finalName, email.trim() || undefined);
    onContinueAsGuest();
  };

  const handleCopyLink = () => {
    const url = window.location.origin + '/user/login';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-stone-900 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={onContinueAsGuest}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-[#EFECE4] px-3.5 py-2 rounded-xl border border-stone-200/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-[#14532D] bg-white hover:bg-[#EFECE4] border border-stone-200/90 px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            title="Salin Tautan Khusus Login Pengguna"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#14532D]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px] font-semibold">{copiedLink ? 'Tersalin' : '/user/login'}</span>
          </button>
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#EFECE4]/70 border-b border-stone-200/90 p-6 sm:p-8 text-stone-900">
            <div className="w-11 h-11 rounded-xl bg-[#14532D] text-white flex items-center justify-center mb-3.5">
              <User className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#14532D]">
              Portal Pembelajar · Bebas & Terbuka
            </p>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 mt-1">
              Profil Pembelajar Bahasa
            </h1>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Simpan progres belajar, koleksi kosakata favorit, dan lencana penguasaan bahasa daerah Sulawesi Tenggara.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Highlights */}
            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="p-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/80 flex flex-col items-center">
                <BookOpen className="w-4 h-4 text-[#14532D] mb-1" />
                <span className="text-[11px] font-bold text-stone-800">4 Rumpun</span>
                <span className="text-[10px] text-stone-500">Sultra</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/80 flex flex-col items-center">
                <Heart className="w-4 h-4 text-rose-600 mb-1" />
                <span className="text-[11px] font-bold text-stone-800">Koleksi</span>
                <span className="text-[10px] text-stone-500">Simpan Kata</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/80 flex flex-col items-center">
                <Award className="w-4 h-4 text-amber-600 mb-1" />
                <span className="text-[11px] font-bold text-stone-800">Capaian</span>
                <span className="text-[10px] text-stone-500">Level & XP</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama Lengkap / Panggilan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: La Ode, Wa Ode..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#14532D] focus:bg-white transition-colors"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Ditampilkan pada profil pembelajar dan kontribusi komunitas.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#14532D] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#14532D] hover:bg-[#166534] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
              >
                <span>Simpan Profil & Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Guest Access Button */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-stone-400 text-xs font-medium">atau</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2.5 px-4 bg-[#EFECE4] hover:bg-stone-200 text-stone-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs whitespace-nowrap"
            >
              <span>Jelajahi Langsung sebagai Tamu</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-stone-500 py-3">
        Leksika Nusantara · Arsip Bahasa Daerah Sulawesi Tenggara
      </footer>
    </div>
  );
};
