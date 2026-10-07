/**
 * Konfigurasi Pemisahan Portal (Portal Isolation)
 * Memisahkan Portal Pengguna (Public/User) dan Portal Administrator (Admin)
 * baik saat dideploy dengan Subdomain Cloudflare (admin.domain.com vs domain.com)
 * maupun melalui Environment Variable dan URL Routing.
 */

export type PortalMode = 'user' | 'admin' | 'unified';

/**
 * Mendeteksi apakah aplikasi saat ini berjalan dalam konteks Portal Admin.
 * Aktif jika:
 * 1. Subdomain berawalan 'admin.' (contoh: admin.leksika.id atau admin.domain.com di Cloudflare)
 * 2. Environment variable VITE_PORTAL_MODE === 'admin'
 * 3. URL Query parameter ?portal=admin atau ?role=admin/superadmin/editor/moderator
 * 4. URL path diawali /admin
 */
export function isCurrentAdminPortal(): boolean {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // 1. Deteksi Subdomain Cloudflare (misal: admin.namadomain.com)
  if (hostname.startsWith('admin.') || hostname.includes('-admin.') || hostname.includes('.admin.')) {
    return true;
  }

  // 2. Deteksi Environment Variable Build Vite
  const envMode = (import.meta as any).env?.VITE_PORTAL_MODE;
  if (envMode === 'admin') {
    return true;
  }

  // 3. Deteksi URL parameter khusus admin
  const portalParam = search.get('portal') || search.get('mode');
  if (portalParam === 'admin') return true;

  const roleParam = search.get('role');
  if (roleParam && ['admin', 'superadmin', 'editor', 'moderator', 'linguis', 'viewer'].includes(roleParam.toLowerCase())) {
    return true;
  }

  // 4. Deteksi URL Path / Hash
  if (path.startsWith('/admin') || hash.includes('/admin')) {
    return true;
  }

  return false;
}

/**
 * Mendeteksi apakah sedang berada di Portal Pengguna Murni (Strict User Portal).
 * Jika true, semua tombol Admin, Tautan Role, dan petunjuk login admin disembunyikan total.
 */
export function isStrictUserPortal(): boolean {
  if (typeof window === 'undefined') return true;

  // Jika env eksplisit menentukan mode user
  const envMode = (import.meta as any).env?.VITE_PORTAL_MODE;
  if (envMode === 'user') return true;

  // Jika bukan portal admin, secara default adalah portal user
  return !isCurrentAdminPortal();
}

/**
 * Memeriksa apakah tombol Admin di Navbar harus disembunyikan.
 * Secara default pada portal publik, tombol Admin disembunyikan
 * kecuali pengguna sedang login sebagai admin atau parameter eksplisit ?show_admin=1 ada.
 */
export function shouldShowAdminInNavbar(isAdminLoggedIn: boolean): boolean {
  if (typeof window === 'undefined') return false;

  // Jika admin sudah login di browser ini, tampilkan tombol kembali ke Dashboard Admin
  if (isAdminLoggedIn) return true;

  const search = new URLSearchParams(window.location.search);
  if (search.get('show_admin') === '1' || search.get('dev') === '1') {
    return true;
  }

  // Jika di subdomain admin, tampilkan
  if (isCurrentAdminPortal()) {
    return true;
  }

  // Di portal publik umum, SEMBUNYIKAN tombol admin agar pengunjung tidak melihatnya
  return false;
}

/**
 * Memeriksa apakah modal "Tautan Role" (yang berisi bocoran role & kredensial) boleh ditampilkan.
 * Hanya boleh tampil jika parameter dev/debug aktif atau di localhost development.
 */
export function shouldShowRoleLinksTrigger(): boolean {
  if (typeof window === 'undefined') return false;

  const search = new URLSearchParams(window.location.search);
  // Hanya tampil jika ada query ?show_links=1 atau ?dev=1
  if (search.get('show_links') === '1' || search.get('dev') === '1') {
    return true;
  }

  // Default: Sembunyikan demi keamanan produksi
  return false;
}

/**
 * Memeriksa apakah kredensial demo (1-klik isi) boleh ditampilkan di halaman login Admin.
 * Secara default di halaman admin produksi, ini disembunyikan atau di-collapse agar tidak membocorkan sandi.
 */
export function isDemoCredentialsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  const search = new URLSearchParams(window.location.search);
  if (search.get('demo') === '1' || search.get('test') === '1') {
    return true;
  }

  const envShowDemo = (import.meta as any).env?.VITE_SHOW_DEMO_CREDENTIALS;
  if (envShowDemo === 'false') return false;

  // Izinkan jika dipanggil di sandbox preview
  return true;
}
