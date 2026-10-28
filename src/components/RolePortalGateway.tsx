import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Lock,
  User,
  Check,
  Languages,
  CheckSquare
} from 'lucide-react';
import { UserProfile, AdminUser, PageRoute } from '../types';

interface RolePortalGatewayProps {
  userProfile: UserProfile;
  adminUser: AdminUser | null;
  totalWordsCount: number;
  pendingModerationCount: number;
  onNavigate: (route: PageRoute) => void;
}

export const RolePortalGateway: React.FC<RolePortalGatewayProps> = ({
  userProfile,
  adminUser,
  totalWordsCount,
  pendingModerationCount,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F6F1] text-stone-900 font-sans flex flex-col justify-between antialiased selection:bg-[#14532D]/15 selection:text-[#14532D]">
      {/* Top Minimal Institutional Header */}
      <header className="border-b border-stone-200/90 bg-[#F8F6F1]/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0">
            Leksika Nusantara
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline whitespace-nowrap">
            Arsip Leksikon Bahasa Daerah Sulawesi Tenggara · Pemisahan Akses Role
          </span>
        </div>
      </header>

      {/* Main Split Portal Selector */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Editorial Intro */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest font-medium text-stone-500">
            <span>Arsitektur Dua Portal Terisolasi</span>
            <span aria-hidden="true">·</span>
            <span>Tolaki · Moronene · Muna · Buton</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-stone-900 leading-[1.15] text-balance">
            Pilih Ruang Akses Sesuai Peran Anda
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Sistem memisahkan secara penuh sesi autentikasi, navigasi antarmuka, dan wewenang pengelolaan data antara{' '}
            <strong className="font-semibold text-stone-900">Role Pengguna</strong> dan{' '}
            <strong className="font-semibold text-stone-900">Role Administrator</strong>.
          </p>
        </div>

        {/* Two Equal-Height Separated Role Portals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* PORTAL 1: ROLE PENGGUNA */}
          <section
            aria-labelledby="portal-user-heading"
            className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#14532D]/10 text-[#14532D] border border-[#14532D]/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-stone-500 tabular-nums">
                  Rute: /user
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-semibold text-[#14532D]">
                  01 · Role Pengguna &amp; Pembelajar
                </p>
                <h2
                  id="portal-user-heading"
                  className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight"
                >
                  Portal Pengguna Publik
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Ruang belajar terbuka bagi masyarakat, pelajar, dan penutur lokal untuk menelusuri kamus, menerjemahkan kalimat, berlatih kuis, serta mengajukan usulan kata baru.
                </p>
              </div>

              {/* Scoped Capabilities List */}
              <div className="pt-4 border-t border-stone-200/80 space-y-2.5 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                  <span>Pencarian {totalWordsCount} kosakata terverifikasi &amp; audio pelafalan fonetis</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                  <span>Penerjemah kalimat daerah, modul belajar, kuis, permainan, &amp; Tutor Bahasa</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                  <span>Pengajuan usulan kosakata ke antrean verifikasi kurator (tanpa akses hapus/edit kamus master)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                  <span>Akun pembelajar terpisah untuk menyimpan kata favorit, riwayat, &amp; progres XP</span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Status Sesi Pengguna</span>
                <span className="font-medium text-stone-800">
                  {userProfile.isAuthenticated
                    ? `Masuk: ${userProfile.name}`
                    : 'Mode Tamu (Bebas Akses)'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  id="gateway-btn-enter-user"
                  type="button"
                  onClick={() => onNavigate('user')}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Buka Portal Pengguna</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="gateway-btn-login-user"
                  type="button"
                  onClick={() => onNavigate('user-login')}
                  className="py-3 px-4 rounded-xl bg-[#EFECE4] hover:bg-stone-200/80 text-stone-800 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <User className="w-4 h-4 text-[#14532D]" />
                  <span>{userProfile.isAuthenticated ? 'Kelola Akun' : 'Login Pengguna'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* PORTAL 2: ROLE ADMINISTRATOR */}
          <section
            aria-labelledby="portal-admin-heading"
            className="bg-stone-950 text-stone-100 rounded-2xl border border-stone-800 p-6 sm:p-8 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-stone-400 tabular-nums">
                  Rute: /admin
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
                  02 · Role Administrator &amp; Kurator RBAC
                </p>
                <h2
                  id="portal-admin-heading"
                  className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight"
                >
                  Portal Administrator
                </h2>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Konsol pengelolaan khusus tim kurator bahasa, moderator komunitas, dan pengelola sistem dengan kontrol hak akses berbasis peran (RBAC).
                </p>
              </div>

              {/* Scoped Admin Capabilities List */}
              <div className="pt-4 border-t border-stone-800 space-y-2.5 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="tabular-nums">
                    Moderasi usulan kosakata warga ({pendingModerationCount} usulan menunggu verifikasi)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Languages className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Manajemen penuh kamus master (tambah, sunting fonetik, dan hapus entri resmi)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>4 tingkat otoritas staf: Super Admin, Linguist Editor, Moderator, &amp; Viewer</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Catatan audit sistem, cadangan JSON/CSV, &amp; sinkronisasi database Supabase</span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-stone-800/90 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Status Sesi Administrator</span>
                <span className="font-medium text-emerald-300">
                  {adminUser
                    ? `Aktif: ${adminUser.name} (${adminUser.role})`
                    : 'Wajib Autentikasi Kata Sandi'}
                </span>
              </div>

              <button
                id="gateway-btn-enter-admin"
                type="button"
                onClick={() => onNavigate(adminUser ? 'admin' : 'admin-login')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {adminUser ? 'Buka Dashboard Administrator' : 'Masuk ke Portal Administrator'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>

        {/* Deployment Isolation Note */}
        <div className="bg-[#EFECE4]/75 rounded-2xl border border-stone-200/90 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-stone-600">
          <div className="space-y-1 max-w-2xl">
            <p className="font-semibold text-stone-900">
              Siap Deploy Terpisah di Cloudflare Pages (Build Per Role)
            </p>
            <p className="leading-relaxed">
              Gunakan perintah build khusus untuk memisahkan domain produksi secara mutlak tanpa halaman pemilih ini: domain publik hanya memuat Portal Pengguna, sedangkan subdomain admin hanya memuat Portal Administrator.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-stone-800 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-stone-200/90">
              npm run build:user
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-stone-200/90">
              npm run build:admin
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/90 py-6 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Leksika Nusantara — Pelestarian Bahasa Daerah Sulawesi Tenggara</span>
          <span>Pemisahan Sesi &amp; Otorisasi Role Aktif</span>
        </div>
      </footer>
    </div>
  );
};
