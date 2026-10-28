/**
 * Konfigurasi Pemisahan Peran & Portal (Role & Portal Isolation)
 * Memisahkan secara tegas:
 * 1. Portal Pengguna (Role: Pengguna / Pembelajar)
 * 2. Portal Administrator (Role: Super Admin, Linguist Editor, Moderator, Viewer)
 *
 * Mendukung 3 skenario operasi:
 * - Build Khusus Pengguna (`npm run build:user` / `VITE_PORTAL_MODE=user`) -> 100% Terkunci di Portal Pengguna
 * - Build Khusus Admin (`npm run build:admin` / `VITE_PORTAL_MODE=admin` / subdomain `admin.*`) -> 100% Terkunci di Portal Admin
 * - Mode Pratinjau Terpadu (`unified`) -> Gerbang Pemilih Portal (`/portal`) memisahkan sesi, tampilan, dan izin kedua role.
 */

export type PortalMode = 'user' | 'admin' | 'unified';

/**
 * Mengecek apakah build saat ini adalah build khusus Pengguna murni (`VITE_PORTAL_MODE=user` atau `--mode user`)
 */
export function isUserBuild(): boolean {
  const envMode = (import.meta as any).env?.VITE_PORTAL_MODE || (import.meta as any).env?.MODE;
  return envMode === 'user';
}

/**
 * Mengecek apakah build saat ini adalah build khusus Admin murni (`VITE_PORTAL_MODE=admin` atau `--mode admin`)
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
 * Mengecek apakah aplikasi dikunci sepenuhnya pada Portal Pengguna saja (tidak boleh mengakses /admin atau /portal)
 */
export function isStrictUserPortal(): boolean {
  if (isUserBuild()) return true;
  if (typeof window !== 'undefined') {
    const search = new URLSearchParams(window.location.search);
    if (search.get('portal') === 'user-only') return true;
  }
  return false;
}

/**
 * Mengecek apakah aplikasi dikunci sepenuhnya pada Portal Admin saja (tidak boleh mengakses /user atau /portal)
 */
export function isStrictAdminPortal(): boolean {
  if (isUserBuild()) return false;
  if (isAdminBuild() || isAdminSubdomain()) return true;
  if (typeof window !== 'undefined') {
    const search = new URLSearchParams(window.location.search);
    if (search.get('portal') === 'admin-only') return true;
  }
  return false;
}

/**
 * Mengecek apakah aplikasi berjalan dalam mode Unified (misalnya lingkungan pratinjau AI Studio / single domain)
 * di mana pengguna dapat memilih masuk sebagai Role Pengguna atau Role Admin melalui Gerbang Portal,
 * namun saat berada di dalam masing-masing portal, UI dan hak aksesnya tetap terpisah 100%.
 */
export function isUnifiedPortalMode(): boolean {
  return !isStrictUserPortal() && !isStrictAdminPortal();
}

/**
 * Backward-compatible helper: true jika dikunci ke portal admin (build admin / subdomain admin).
 */
export function isCurrentAdminPortal(): boolean {
  return isStrictAdminPortal();
}

/**
 * Tombol Admin TIDAK PERNAH ditampilkan di dalam Navbar Pengguna agar Role Pengguna tetap murni.
 */
export function shouldShowAdminInNavbar(_isAdminLoggedIn?: boolean): boolean {
  return false;
}

/**
 * Memeriksa apakah modal utilitas Tautan Role (dev/debug) diaktifkan via query ?show_links=1 atau ?dev=1.
 */
export function shouldShowRoleLinksTrigger(): boolean {
  if (typeof window === 'undefined') return false;
  if (isStrictUserPortal() || isStrictAdminPortal()) return false;

  const search = new URLSearchParams(window.location.search);
  return search.get('show_links') === '1' || search.get('dev') === '1';
}

/**
 * Memeriksa apakah akordeon kredensial uji coba RBAC di halaman Login Admin ditampilkan.
 * Otomatis mati pada build produksi khusus Admin (`VITE_SHOW_DEMO_CREDENTIALS=false`),
 * dan aktif pada mode pratinjau/pengujian kecuali dimatikan eksplisit.
 */
export function isDemoCredentialsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  const search = new URLSearchParams(window.location.search);
  if (search.get('demo') === '1' || search.get('test') === '1') {
    return true;
  }

  const envShowDemo = (import.meta as any).env?.VITE_SHOW_DEMO_CREDENTIALS;
  if (envShowDemo === 'false' || isAdminBuild()) {
    return false;
  }

  return true;
}
