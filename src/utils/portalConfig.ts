/**
 * Konfigurasi Isolasi Role & Proteksi Link Rahasia Admin
 *
 * Sistem hanya memiliki 2 Role:
 * 1. User (Publik) -> Diakses melalui `/` (beranda utama), `/user`, dan `/user/login`.
 *    Seluruh rute tebakan seperti `/admin`, `/admin/login`, `/dashboard`, `/portal` diblokir
 *    dan otomatis dialihkan ke beranda Kamus User sehingga keberadaan menu Admin 100% tersembunyi.
 * 2. Admin (Rahasia) -> HANYA dapat diakses melalui path rahasia kriptografis (`/kunci-admin-9x7k4m2p`)
 *    atau nilai kustom pada variabel environment `VITE_ADMIN_SECRET_PATH`.
 */

export type PortalMode = 'user' | 'admin' | 'unified';

export const PUBLIC_SHARED_BASE_URL =
  'https://ais-pre-yrs2prwtidjguyjuozixql-383910279934.asia-southeast1.run.app';

export const DEFAULT_SECRET_ADMIN_SLUG = 'kunci-admin-9x7k4m2p';

const SESSION_PORTAL_LOCK_KEY = 'leksika_portal_lock_v2';

/**
 * Mengambil slug path rahasia Admin (dari VITE_ADMIN_SECRET_PATH atau default acak)
 */
export function getSecretAdminSlug(): string {
  const rawEnv = (import.meta as any).env?.VITE_ADMIN_SECRET_PATH;
  if (typeof rawEnv === 'string' && rawEnv.trim().length >= 6) {
    const cleaned = rawEnv.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
    // Cegah penggunaan kata 'admin' biasa agar tetap rahasia
    if (cleaned && cleaned !== 'admin' && cleaned !== 'login') {
      return cleaned;
    }
  }
  return DEFAULT_SECRET_ADMIN_SLUG;
}

/**
 * Mengecek apakah pathname URL saat ini cocok secara presisi dengan path rahasia Admin
 */
export function isSecretAdminPath(pathname: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '').toLowerCase();
  const secretBase = `/${getSecretAdminSlug()}`;
  return cleanPath === secretBase || cleanPath === `${secretBase}/login`;
}

/**
 * Mengecek apakah pathname adalah halaman login dari path rahasia Admin
 */
export function isSecretAdminLoginPath(pathname: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '').toLowerCase();
  const secretBase = `/${getSecretAdminSlug()}`;
  return cleanPath === `${secretBase}/login`;
}

function syncPortalLockFromQuery(): 'user-only' | 'admin-only' | null {
  if (typeof window === 'undefined') return null;
  try {
    const search = new URLSearchParams(window.location.search);
    const portalParam = search.get('portal');
    if (portalParam === 'user-only') {
      window.sessionStorage.setItem(SESSION_PORTAL_LOCK_KEY, 'user-only');
      return 'user-only';
    }
    if (portalParam === 'admin-only' && isSecretAdminPath(window.location.pathname)) {
      window.sessionStorage.setItem(SESSION_PORTAL_LOCK_KEY, 'admin-only');
      return 'admin-only';
    }
    const existing = window.sessionStorage.getItem(SESSION_PORTAL_LOCK_KEY);
    if (existing === 'user-only' || existing === 'admin-only') {
      return existing;
    }
  } catch {
    // Ignore storage access errors in restricted frames
  }
  return null;
}

/**
 * Mengecek apakah build saat ini adalah build khusus Pengguna murni (`VITE_PORTAL_MODE=user`)
 */
export function isUserBuild(): boolean {
  const envMode = (import.meta as any).env?.VITE_PORTAL_MODE || (import.meta as any).env?.MODE;
  return envMode === 'user';
}

/**
 * Mengecek apakah build saat ini adalah build khusus Admin murni (`VITE_PORTAL_MODE=admin`)
 */
export function isAdminBuild(): boolean {
  const envMode = (import.meta as any).env?.VITE_PORTAL_MODE || (import.meta as any).env?.MODE;
  return envMode === 'admin';
}

/**
 * Mengecek apakah diakses dari subdomain khusus admin (misal: admin.leksika.id di Cloudflare)
 */
export function isAdminSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname.startsWith('admin.') ||
    hostname.includes('-admin.') ||
    hostname.includes('.admin.')
  );
}

/**
 * Mengecek apakah aplikasi dikunci sepenuhnya pada Portal Pengguna saja
 */
export function isStrictUserPortal(): boolean {
  if (isUserBuild()) return true;
  return syncPortalLockFromQuery() === 'user-only';
}

/**
 * Mengecek apakah aplikasi dikunci sepenuhnya pada Portal Admin saja
 */
export function isStrictAdminPortal(): boolean {
  if (isUserBuild()) return false;
  if (isAdminBuild() || isAdminSubdomain()) return true;
  return syncPortalLockFromQuery() === 'admin-only';
}

export function isUnifiedPortalMode(): boolean {
  return !isStrictUserPortal() && !isStrictAdminPortal();
}

export function isCurrentAdminPortal(): boolean {
  return isStrictAdminPortal();
}

/**
 * Tombol Admin TIDAK PERNAH ditampilkan di dalam Navbar Pengguna.
 */
export function shouldShowAdminInNavbar(_isAdminLoggedIn?: boolean): boolean {
  return false;
}

/**
 * Dinonaktifkan sepenuhnya agar daftar tautan Admin tidak pernah bisa dibuka oleh User.
 */
export function shouldShowRoleLinksTrigger(): boolean {
  return false;
}

/**
 * Dinonaktifkan agar kredensial Admin tidak pernah ditampilkan di layar login.
 */
export function isDemoCredentialsEnabled(): boolean {
  return false;
}

/**
 * Menghasilkan base URL aktif
 */
export function getActiveBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin;
    }
  }
  return PUBLIC_SHARED_BASE_URL;
}

/**
 * Menghasilkan URL lengkap Link Rahasia Admin
 */
export function getSecretAdminUrl(): string {
  return `${getActiveBaseUrl()}/${getSecretAdminSlug()}`;
}
