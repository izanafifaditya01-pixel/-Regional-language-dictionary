import React, { useState } from 'react';
import { User, Sparkles, ArrowRight, ShieldCheck, Check, Copy, ArrowLeft, BookOpen, Heart, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface UserLoginPageProps {
  currentUserProfile: UserProfile;
  onUpdateUserProfile: (name: string, email?: string) => void;
  onContinueAsGuest: () => void;
  onNavigateToAdminLogin: () => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({
  currentUserProfile,
  onUpdateUserProfile,
  onContinueAsGuest,
  onNavigateToAdminLogin,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50 text-slate-800 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={onContinueAsGuest}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Ke Halaman Utama (Tanpa Login)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
            title="Salin Tautan Khusus Login Pengguna"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px] font-bold">{copiedLink ? 'Tersalin!' : 'Link: /user/login'}</span>
          </button>
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white relative">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-white/20 rounded-md">
                Portal Pengguna
              </span>
              <span className="text-xs text-emerald-100">• Bebas & Terbuka</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Masuk Akun Pengguna
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1">
              Simpan rekor belajar, bookmark kosakata favorit, dan peroleh lencana budaya Sultra.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Highlights */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <BookOpen className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-700">4 Bahasa</span>
                <span className="text-[9px] text-slate-400">Tolaki, Muna, dll</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <Heart className="w-4 h-4 text-rose-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-700">Favorit</span>
                <span className="text-[9px] text-slate-400">Simpan Kata</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <Award className="w-4 h-4 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-700">Game XP</span>
                <span className="text-[9px] text-slate-400">Level & Streak</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Anda / Panggilan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: La Ode, Wa Ode, Anoa Muda..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Nama ini akan digunakan untuk papan skor dan sertifikat belajar.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@anda.com (opsional)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Masuk & Simpan Profil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Guest Access Button */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-xs font-medium">atau</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Jelajahi Langsung Tanpa Perlu Login (Mode Tamu)</span>
            </button>

            {/* Link to Admin Login */}
            <div className="pt-4 border-t border-slate-100 text-center text-xs">
              <div className="flex items-center justify-center gap-1.5 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Pengelola kamus?</span>
                <button
                  onClick={onNavigateToAdminLogin}
                  className="text-emerald-700 hover:text-emerald-800 font-black underline cursor-pointer"
                >
                  Masuk ke Halaman Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 py-3">
        Leksika Nusantara • Pelestarian Bahasa Daerah Sulawesi Tenggara
      </footer>
    </div>
  );
};
