import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Globe,
  ShieldCheck,
  User,
  Sparkles,
  BookOpen,
  ShieldAlert,
  Eye,
  Key,
  CheckCircle2,
  Lock,
  ArrowRight,
  Share2
} from 'lucide-react';
import { PageRoute } from '../types';

interface RouteLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
  onSelectRole?: (roleId: string) => void;
}

export const DEPLOYED_BASE_URL = 'https://ais-pre-yrs2prwtidjguyjuozixql-383910279934.asia-southeast1.run.app';

export const RouteLinksModal: React.FC<RouteLinksModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectRole,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState<'deployed' | 'current'>('deployed');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'user' | 'admin'>('all');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : DEPLOYED_BASE_URL;
  const baseUrl = urlMode === 'deployed' ? DEPLOYED_BASE_URL : currentOrigin;

  const roleLinks = [
    // -------------------------------------------------------------
    // ROLE 1: PENGGUNA PUBLIK (USER)
    // -------------------------------------------------------------
    {
      id: 'role-user',
      roleType: 'user',
      title: 'Peran: Pengguna Publik (Public User)',
      targetRole: 'user',
      badge: 'Bebas Akses Tanpa Login',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: Globe,
      iconBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      path: '/?role=user',
      cleanPath: '/user',
      description: 'Akses penuh seluruh pengguna umum ke kamus 4 bahasa Sultra (Tolaki, Moronene, Muna, Buton/Wolio), audio pelafalan fonetik, modul pembelajaran, AI penerjemah kalimat, game budaya, dan formulir pengajuan kosakata (+Kata).',
      accessLevel: 'Bebas / Tanpa Kata Sandi',
      route: 'user' as PageRoute,
      credentials: null,
      features: ['Kamus 4 Bahasa Sultra', 'Penerjemah AI', 'Game Edukasi Budaya', 'AI Tutor Sultra', 'Kirim Usulan Kata (+Kata)'],
    },
    // -------------------------------------------------------------
    // ROLE 2: LOGIN AKUN PENGGUNA TERDAFTAR
    // -------------------------------------------------------------
    {
      id: 'role-user-login',
      roleType: 'user',
      title: 'Peran: Akun Pengguna Terdaftar (User Login)',
      targetRole: 'user-login',
      badge: 'Login / Profil Akun',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: User,
      iconBg: 'bg-blue-500/10 text-blue-700 border-blue-200',
      path: '/?role=user-login',
      cleanPath: '/user/login',
      description: 'Halaman login/masuk untuk personalisasi nama profil, email, sinkronisasi perolehan XP gamifikasi harian, penyimpanan bookmark kosakata favorit, dan koleksi lencana pembelajar.',
      accessLevel: 'Login Personalisasi Pengguna',
      route: 'user-login' as PageRoute,
      credentials: null,
      features: ['Personalisasi Profil', 'Simpan Kosakata Favorit', 'Sinkronisasi XP & Level', 'Koleksi Lencana'],
    },
    // -------------------------------------------------------------
    // ROLE 3: SUPER ADMINISTRATOR
    // -------------------------------------------------------------
    {
      id: 'role-superadmin',
      roleType: 'admin',
      title: 'Peran: Super Administrator (Admin Utama)',
      targetRole: 'superadmin',
      badge: 'Otoritas Tertinggi (Full Access)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: ShieldCheck,
      iconBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
      path: '/?role=superadmin',
      cleanPath: '/admin?role=superadmin',
      description: 'Otoritas tertinggi pengelolaan sistem. Memiliki 11 hak akses menyeluruh: kelola kosakata master, hapus data permanen, moderasi kata komunitas, konfigurasi matriks RBAC, manajemen staf akun admin, ekspor/impor cadangan database JSON/CSV, serta peninjauan catatan audit.',
      accessLevel: 'Full System Control (11 Izin RBAC)',
      route: 'admin' as PageRoute,
      accountName: 'Dr. Muh. Arifin, M.Hum',
      credentials: { username: 'admin', password: 'admin123' },
      features: ['Kelola Kosakata & Hapus Master', 'Konfigurasi Matriks RBAC', 'Kelola Akun Admin & Staf', 'Ekspor/Impor Cadangan Data', 'Catatan Audit Lengkap'],
    },
    // -------------------------------------------------------------
    // ROLE 4: LINGUIST EDITOR
    // -------------------------------------------------------------
    {
      id: 'role-editor',
      roleType: 'admin',
      title: 'Peran: Linguist Editor (Editor Linguistik Sultra)',
      targetRole: 'editor',
      badge: 'Kurator & Peneliti Bahasa',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: BookOpen,
      iconBg: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
      path: '/?role=editor',
      cleanPath: '/admin?role=editor',
      description: 'Dikhususkan bagi kurator bahasa dan peneliti dialek daerah. Memiliki hak menambah dan menyunting kosakata, dialek lokal, konteks budaya, dan contoh kalimat. Terproteksi dari hak menghapus data permanen atau mengelola akun pengguna.',
      accessLevel: 'Kurasi & Manajemen Kosakata',
      route: 'admin' as PageRoute,
      accountName: 'La Ode Suriadin, S.Pd (Linguis)',
      credentials: { username: 'editor', password: 'editor123' },
      features: ['Tambah Kosakata Baru', 'Sunting Fonetik & Dialek', 'Analisis Konteks Budaya', 'Hapus Data Master Dibatasi', 'Akses RBAC Terproteksi'],
    },
    // -------------------------------------------------------------
    // ROLE 5: MODERATOR KOMUNITAS
    // -------------------------------------------------------------
    {
      id: 'role-moderator',
      roleType: 'admin',
      title: 'Peran: Moderator Komunitas (Verifikator Usulan Warga)',
      targetRole: 'moderator',
      badge: 'Moderasi Usulan Kata (+Kata)',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: ShieldAlert,
      iconBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      path: '/?role=moderator',
      cleanPath: '/admin?role=moderator',
      description: 'Berfokus pada kurasi dan moderasi usulan kata baru yang diajukan oleh masyarakat umum melalui formulir +Kata. Memiliki wewenang menyetujui kata untuk dipublikasikan ke kamus resmi, memperbaiki tata bahasa, atau menolak usulan yang tidak layak.',
      accessLevel: 'Moderasi Usulan & Publikasi Kata',
      route: 'admin' as PageRoute,
      accountName: 'Wa Ode Nurul Fadhilah',
      credentials: { username: 'moderator', password: 'moderator123' },
      features: ['Verifikasi Antrean Usulan (+Kata)', 'Setujui Publikasi Kamus', 'Sunting Tata Bahasa Usulan', 'Tolak Konten Spam', 'Log Audit Moderasi'],
    },
    // -------------------------------------------------------------
    // ROLE 6: VIEWER (READ-ONLY)
    // -------------------------------------------------------------
    {
      id: 'role-viewer',
      roleType: 'admin',
      title: 'Peran: Viewer (Peneliti Tamu / Observer Read-Only)',
      targetRole: 'viewer',
      badge: 'Peneliti & Analis (Hanya Baca)',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      icon: Eye,
      iconBg: 'bg-slate-500/10 text-slate-700 border-slate-300',
      path: '/?role=viewer',
      cleanPath: '/admin?role=viewer',
      description: 'Akses peninjauan (read-only) untuk peneliti tamu, akademisi, atau evaluator. Dapat melihat data statistik sebaran bahasa daerah Tolaki, Moronene, Muna, Buton/Wolio, dan memeriksa riwayat audit sistem tanpa hak mengubah data.',
      accessLevel: 'Read-Only (Tanpa Izin Modifikasi)',
      route: 'admin' as PageRoute,
      accountName: 'Tim Peneliti Balai Bahasa',
      credentials: { username: 'viewer', password: 'viewer123' },
      features: ['Monitoring Statistik Data', 'Lihat Sebaran Bahasa Daerah', 'Akses Log Audit Transparan', 'Aksi Edit & Hapus Terkunci', 'Proteksi Sistem Penuh'],
    },
  ];

  const filteredLinks = roleLinks.filter(item => {
    if (categoryFilter === 'user') return item.roleType === 'user';
    if (categoryFilter === 'admin') return item.roleType === 'admin';
    return true;
  });

  const handleCopy = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenRole = (item: typeof roleLinks[0]) => {
    if (onSelectRole) {
      onSelectRole(item.targetRole);
    } else {
      onNavigate(item.route);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Portal Link Akses Per Role (Deployed & Lokal)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Multi-Role
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tautan akses langsung untuk masing-masing peran (Pengguna Umum & Administrator)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Environment Selector & Category Filter */}
        <div className="p-4 bg-slate-100/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Environment Domain Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600 shrink-0">Target Domain:</span>
            <div className="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300">
              <button
                onClick={() => setUrlMode('deployed')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  urlMode === 'deployed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Gunakan URL Deployment Cloud Run Resmi"
              >
                🌐 Link Deployed (Cloud Run)
              </button>
              <button
                onClick={() => setUrlMode('current')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  urlMode === 'current'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Gunakan Domain Host Browser Saat Ini"
              >
                💻 Domain Aktif Saat Ini
              </button>
            </div>
          </div>

          {/* Role Category Tabs */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300 text-xs font-semibold">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Role ({roleLinks.length})
            </button>
            <button
              onClick={() => setCategoryFilter('user')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'user'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengguna (2)
            </button>
            <button
              onClick={() => setCategoryFilter('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'admin'
                  ? 'bg-white text-purple-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin & Staf (4)
            </button>
          </div>
        </div>

        {/* List of Role Access Links */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
          {filteredLinks.map(item => {
            const Icon = item.icon;
            const fullUrl = `${baseUrl}${item.path}`;
            const isCopied = copiedKey === item.id;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-xs group"
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h4>
                      {item.accountName && (
                        <p className="text-[11px] text-slate-500 font-medium">
                          Akun: <strong className="text-slate-700">{item.accountName}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Features Pill */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  {item.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/80"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Credentials Preview (if any) */}
                {item.credentials && (
                  <div className="mb-3.5 p-2 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-amber-500" /> Kredensial Demo:
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-bold text-[11px]">
                      User: {item.credentials.username}
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-bold text-[11px]">
                      Pass: {item.credentials.password}
                    </span>
                  </div>
                )}

                {/* URL Container & Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <code className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 truncate select-all max-w-full">
                      {fullUrl}
                    </code>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopy(item.id, fullUrl)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                      title="Salin URL lengkap ke clipboard"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{isCopied ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>

                    {/* Direct Role Switch / Open Button */}
                    <button
                      onClick={() => handleOpenRole(item)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      title="Buka dan aktifkan role ini langsung"
                    >
                      <span>Buka Langsung</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* External Link Button */}
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Buka tautan ini di tab baru browser"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tautan dapat dibagikan kepada pengguna, evaluator, maupun staf administrator.</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
              ⚡ Database: Supabase Cloud
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors shadow-2xs self-end sm:self-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
