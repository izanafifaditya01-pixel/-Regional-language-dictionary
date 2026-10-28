import React, { useState } from 'react';
import {
  User,
  ArrowRight,
  Check,
  Copy,
  ArrowLeft,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';
import { authenticateLearner, registerLearner } from '../utils/userStorage';

interface UserLoginPageProps {
  currentUserProfile: UserProfile;
  onAuthSuccess: (profile: UserProfile) => void;
  onContinueAsGuest: () => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({
  currentUserProfile,
  onAuthSuccess,
  onContinueAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (authMode === 'login') {
      const res = authenticateLearner(email, password);
      if (!res.success || !res.profile) {
        setErrorMsg(res.message);
        return;
      }
      onAuthSuccess(res.profile);
    } else {
      const res = registerLearner(name, email, password, currentUserProfile);
      if (!res.success || !res.profile) {
        setErrorMsg(res.message);
        return;
      }
      onAuthSuccess(res.profile);
    }
  };

  const handleFillDemoLearner = () => {
    setAuthMode('login');
    setEmail('pengguna@leksika.id');
    setPassword('pengguna123');
    setErrorMsg(null);
  };

  const handleCopyLink = () => {
    const url = window.location.origin + '/user/login';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-stone-900 flex flex-col justify-between p-4 sm:p-6 font-sans antialiased">
      {/* Top Header (Pure User Portal — No Admin Links) */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-[#EFECE4] px-3.5 py-2 rounded-xl border border-stone-200/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke Portal Pengguna</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-xs text-[#14532D] bg-white hover:bg-[#EFECE4] border border-stone-200/90 px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          title="Salin Tautan Khusus Login Pengguna"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-[#14532D]" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="font-mono text-[11px] font-semibold">{copiedLink ? 'Tersalin' : '/user/login'}</span>
        </button>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#EFECE4]/70 border-b border-stone-200/90 p-6 sm:p-8 text-stone-900">
            <div className="w-11 h-11 rounded-xl bg-[#14532D] text-white flex items-center justify-center mb-3.5">
              <User className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#14532D]">
              Role Pengguna · Akun Pembelajar Bahasa
            </p>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 mt-1">
              {authMode === 'login' ? 'Masuk Akun Pengguna' : 'Daftar Akun Pembelajar'}
            </h1>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Simpan kosakata favorit, riwayat pencarian, lencana belajar, serta pantau status usulan kata daerah Anda.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Segmented Mode Switch: Masuk / Daftar */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFECE4] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  authMode === 'login'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  authMode === 'register'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {authMode === 'login' && (
              <div className="p-3 rounded-xl bg-[#F8F6F1] border border-stone-200/80 flex items-center justify-between gap-2 text-xs">
                <div className="text-stone-600">
                  <span className="font-semibold text-stone-800 block">Akun Contoh Pembelajar</span>
                  <span className="font-mono text-[11px] text-stone-500">pengguna@leksika.id / pengguna123</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoLearner}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#EFECE4] border border-stone-200 text-[#14532D] font-semibold cursor-pointer whitespace-nowrap"
                >
                  Isi Cepat
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Contoh: Wa Ode Siti Rahmawati"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#14532D] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Alamat Email Pengguna
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#14532D] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F8F6F1] border border-stone-200/90 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#14532D] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#14532D] hover:bg-[#166534] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
              >
                <span>{authMode === 'login' ? 'Masuk ke Portal Pengguna' : 'Buat Akun & Masuk'}</span>
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
              <span>Jelajahi Kamus Tanpa Akun (Mode Tamu)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-stone-500 py-3">
        Portal Pengguna Leksika Nusantara · Arsip Bahasa Daerah Sulawesi Tenggara
      </footer>
    </div>
  );
};
