import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, CheckCircle2, ArrowLeft, Copy, Check, Globe } from 'lucide-react';
import { authenticateAdmin } from '../utils/adminAuth';
import { AdminUser } from '../types';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onNavigateToUser: () => void;
  onNavigateToUserLogin: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateToUser,
  onNavigateToUserLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan masukkan username/email dan kata sandi admin.');
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
    } catch (err: any) {
      setErrorMessage('Terjadi kendala saat autentikasi. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoRole = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  const handleFillDemo = () => {
    handleFillDemoRole('admin', 'admin123');
  };

  const handleCopyLink = () => {
    const url = window.location.origin + '/admin';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar with Navigation Back to User Page */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={onNavigateToUser}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3.5 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ke Halaman Pengguna (Tanpa Login)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            title="Salin Tautan Khusus Halaman Admin"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px]">{copiedLink ? 'Tersalin!' : 'Link: /admin'}</span>
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white relative">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-200" />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-white/20 rounded-md">
                Akses Terproteksi
              </span>
              <span className="text-xs text-emerald-200">• Port 3000</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Login Administrator
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1">
              Halaman khusus pengelola kamus bahasa Sulawesi Tenggara (Tolaki, Moronene, Muna, Buton).
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Quick Demo Fill Alert with Role Options */}
            <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Pilih Role untuk Uji Coba (RBAC):
                </span>
                <span className="text-[10px] text-slate-400">1-Klik Isi</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFillDemoRole('admin', 'admin123')}
                  className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-purple-200 text-[11px] group-hover:text-purple-100 flex items-center justify-between">
                    <span>👑 Super Admin</span>
                    <span className="text-[9px] px-1 rounded bg-purple-900/80 text-purple-300">Semua Akses</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">admin / admin123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemoRole('editor', 'editor123')}
                  className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-emerald-200 text-[11px] group-hover:text-emerald-100 flex items-center justify-between">
                    <span>📖 Linguist Editor</span>
                    <span className="text-[9px] px-1 rounded bg-emerald-900/80 text-emerald-300">Kamus & Edit</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">editor / editor123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemoRole('moderator', 'moderator123')}
                  className="p-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/60 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-blue-200 text-[11px] group-hover:text-blue-100 flex items-center justify-between">
                    <span>🛡️ Moderator</span>
                    <span className="text-[9px] px-1 rounded bg-blue-900/80 text-blue-300">Verif +Kata</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">moderator / moderator123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemoRole('viewer', 'viewer123')}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-slate-300 text-[11px] group-hover:text-white flex items-center justify-between">
                    <span>👁️ Viewer</span>
                    <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">Read-Only</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">viewer / viewer123</div>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Username atau Email Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin atau admin@leksika.id"
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
                    className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                  />
                  <span>Ingat sesi masuk admin</span>
                </label>
                <span className="text-slate-500 text-[11px]">Sesi Enkripsi Lokal</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm mt-2"
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

            {/* Alternative Links */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-center text-xs">
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <span>Bukan Administrator?</span>
                <button
                  onClick={onNavigateToUser}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                >
                  Ke Halaman User (Tanpa Login)
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
                <span>Ingin login akun user?</span>
                <button
                  onClick={onNavigateToUserLogin}
                  className="text-slate-300 hover:text-white font-medium underline cursor-pointer"
                >
                  Halaman Login Pengguna
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 py-3">
        Leksika Nusantara • Sistem Pemisahan Portal Pengguna & Administrator
      </footer>
    </div>
  );
};
