import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Link2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { authenticateAdmin } from '../utils/adminAuth';
import { AdminUser } from '../types';
import {
  shouldShowRoleLinksTrigger,
  isStrictAdminPortal,
  isDemoCredentialsEnabled,
} from '../utils/portalConfig';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onNavigateToPortalGateway?: () => void;
  onOpenLinksModal?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateToPortalGateway,
  onOpenLinksModal,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDemoBox, setShowDemoBox] = useState(false);

  const strictAdminOnly = isStrictAdminPortal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan masukkan username/email dan kata sandi administrator.');
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

  const handleCopyLink = () => {
    const url = window.location.origin + '/admin';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 font-sans antialiased">
      {/* Top Bar (Pure Admin Context — Zero User Login Prompts) */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        {!strictAdminOnly && onNavigateToPortalGateway ? (
          <button
            type="button"
            onClick={onNavigateToPortalGateway}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 px-3.5 py-2 rounded-xl border border-stone-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Gerbang Pemilih Portal</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            <span>Konsol Kurator &amp; Administrator</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {onOpenLinksModal && shouldShowRoleLinksTrigger() && (
            <button
              type="button"
              onClick={onOpenLinksModal}
              className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-stone-900 hover:bg-stone-800 border border-stone-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-semibold whitespace-nowrap"
              title="Lihat Tautan Role"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Tautan Role</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-stone-900 hover:bg-stone-800 border border-stone-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            title="Salin Tautan Khusus Halaman Admin"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px]">{copiedLink ? 'Tersalin' : '/admin'}</span>
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#14532D] p-6 sm:p-8 text-white border-b border-white/10">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-3.5">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
              Role Administrator · Otorisasi RBAC
            </p>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white mt-1">
              Portal Administrator
            </h1>
            <p className="text-xs text-emerald-100/85 mt-1.5 leading-relaxed">
              Khusus kurator bahasa, moderator usulan kosakata, dan pengelola basis data Leksika Nusantara.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Collapsible RBAC Demo Accounts (Hidden in strict production admin build) */}
            {isDemoCredentialsEnabled() && (
              <div className="border border-stone-800 rounded-xl bg-stone-950/60 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setShowDemoBox(!showDemoBox)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[11px] text-amber-300/90">
                    Akun Pengujian RBAC Staf (4 Role)
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <span>{showDemoBox ? 'Tutup' : 'Lihat'}</span>
                    {showDemoBox ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                </button>

                {showDemoBox && (
                  <div className="p-3 border-t border-stone-800 bg-stone-900/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Super Admin', scope: 'Akses Penuh', u: 'admin', p: 'admin123' },
                        { label: 'Linguist Editor', scope: 'Kurasi Kamus', u: 'editor', p: 'editor123' },
                        { label: 'Moderator', scope: 'Verifikasi Usul', u: 'moderator', p: 'moderator123' },
                        { label: 'Viewer', scope: 'Baca Saja', u: 'viewer', p: 'viewer123' },
                      ].map(acc => (
                        <button
                          key={acc.u}
                          type="button"
                          onClick={() => handleFillDemoRole(acc.u, acc.p)}
                          className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-left transition-colors cursor-pointer"
                        >
                          <div className="font-semibold text-stone-100 text-[11px] flex items-center justify-between gap-1">
                            <span className="truncate">{acc.label}</span>
                            <span className="text-[10px] text-emerald-400 shrink-0">{acc.scope}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            {acc.u} / {acc.p}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Username atau Email Staf Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin atau admin@leksika.id"
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Kata Sandi Administrator
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi staf..."
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-stone-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 bg-stone-800 border-stone-700"
                  />
                  <span>Simpan sesi staf di perangkat ini</span>
                </label>
                <span className="text-stone-500 text-[11px]">Sesi Terisolasi</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Otorisasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Konsol Administrator</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-stone-500 py-3">
        Konsol Administrator Leksika Nusantara · Akses Khusus Tim Kurator &amp; Staf
      </footer>
    </div>
  );
};
