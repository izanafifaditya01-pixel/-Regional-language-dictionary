import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
  Database,
  Globe2,
  Download,
  KeyRound,
} from 'lucide-react';
import { authenticateAdmin } from '../utils/adminAuth';
import { AdminUser } from '../types';
import { getSecretAdminUrl, getSecretAdminSlug } from '../utils/portalConfig';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Prevent search engines from indexing the secret Admin login route
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const prevContent = meta?.getAttribute('content') || null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (meta) {
        if (prevContent) meta.setAttribute('content', prevContent);
        else meta.remove();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Masukkan username/email dan kata sandi Admin.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await authenticateAdmin(username, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Terjadi kendala saat autentikasi Admin. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecretLink = () => {
    navigator.clipboard.writeText(getSecretAdminUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-sky-500/25 selection:text-sky-200">
      {/* Top Private Admin Utility Bar */}
      <header className="w-full border-b border-slate-800/90 bg-slate-950/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap shrink-0">
              Leksika Console
            </span>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">/</span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline truncate">
              Jalur Akses Rahasia Admin
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopySecretLink}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Salin Link Rahasia Admin untuk disimpan secara pribadi"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px]">{copiedLink ? 'Tersalin' : 'Simpan Link Rahasia'}</span>
          </button>
        </div>
      </header>

      {/* Split 2-Column Private Admin Console Login */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Private Endpoint Overview */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/50 border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-wide">
                <KeyRound className="w-3.5 h-3.5" />
                <span>ENDPOINT TERKUNCI · TIDAK TERINDEKS PUBLIK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight text-balance">
                Konsol Pengelolaan Database Kamus Bahasa Daerah
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Halaman ini dilindungi oleh URL rahasia dan tidak terhubung pada menu publik mana pun. Pengunjung yang membuka rute umum seperti <code className="text-slate-300 font-mono">/admin</code> akan otomatis dialihkan ke beranda kamus biasa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  <div className="text-xs font-semibold text-white">Kelola Kosakata</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tambah, sunting fonetik, dan hapus entri kamus master secara penuh.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  <div className="text-xs font-semibold text-white">4 Bahasa Sultra</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pemetaan kosakata Tolaki, Moronene, Muna, &amp; Buton (Wolio).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5">
                  <Download className="w-4 h-4 text-amber-400" />
                  <div className="text-xs font-semibold text-white">Backup &amp; Supabase</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ekspor cadangan JSON/CSV dan sinkronisasi database cloud.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span>Status Proteksi: <strong className="text-emerald-400">Rute /admin Publik Diblokir</strong></span>
              <span className="font-mono text-[11px] text-slate-500">/{getSecretAdminSlug()}</span>
            </div>
          </div>

          {/* Right Column: Clean Credential Form (Zero Credential Hints) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-800">
                <div className="text-[11px] font-mono text-sky-400 tracking-wider uppercase">
                  OTORISASI ADMINISTRATOR
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Masuk ke Konsol Admin
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan kredensial resmi Admin Anda untuk melanjutkan.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username atau Email Admin
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Masukkan username atau email"
                      autoFocus
                      autoComplete="username"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kata Sandi Admin
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500 bg-slate-800 border-slate-700"
                    />
                    <span>Simpan sesi di perangkat ini</span>
                  </label>
                  <span className="font-mono text-[11px] text-slate-500">Akses Terbatas</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memverifikasi Kredensial...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Simpan URL halaman ini di Bookmark pribadi Anda</span>
              <span className="font-mono text-emerald-400">Private URL</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        Leksika Console · Sistem Internal Pengelolaan Kamus Bahasa Daerah
      </footer>
    </div>
  );
};
