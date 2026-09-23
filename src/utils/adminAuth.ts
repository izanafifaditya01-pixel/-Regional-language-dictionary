import { AdminUser, AdminRole, PermissionKey, RolePermissionDefinition, AuditLogEntry } from '../types';

const ADMIN_SESSION_KEY = 'leksika_admin_session_v2';
const ADMIN_USERS_STORE_KEY = 'leksika_admin_users_v2';
const ROLE_PERMISSIONS_KEY = 'leksika_role_permissions_v2';
const AUDIT_LOGS_KEY = 'leksika_admin_audit_logs_v2';

export interface StoredAdminAccount extends AdminUser {
  passwordHash: string; // plain text for demo/local storage
}

// -------------------------------------------------------------
// DEFAULT ROLES & PERMISSIONS DEFINITIONS
// -------------------------------------------------------------
export const ROLE_DEFINITIONS: Record<AdminRole, RolePermissionDefinition> = {
  'Super Administrator': {
    name: 'Super Administrator',
    description: 'Akses penuh ke seluruh sistem: manajemen akun, penugasan role, penghapusan data master, konfigurasi izin, dan log audit.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    defaultPermissions: [
      'can_view_analytics',
      'can_manage_words',
      'can_delete_words',
      'can_moderate_contributions',
      'can_manage_languages',
      'can_export_backup',
      'can_import_restore',
      'can_manage_users',
      'can_edit_permissions',
      'can_view_audit_logs',
      'can_system_settings',
    ],
  },
  'Linguist Editor': {
    name: 'Editor Bahasa (Linguis)',
    description: 'Dapat mengelola kamus master, menambah & menyunting kosakata resmi, memvalidasi dialek, dan menyetujui kata komunitas.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    defaultPermissions: [
      'can_view_analytics',
      'can_manage_words',
      'can_moderate_contributions',
      'can_manage_languages',
      'can_export_backup',
      'can_view_audit_logs',
    ],
  },
  'Moderator': {
    name: 'Moderator Komunitas',
    description: 'Fokus meninjau usulan kosakata masyarakat (+Kata), menyetujui atau menolak entri sesuai pedoman bahasa.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    defaultPermissions: [
      'can_view_analytics',
      'can_moderate_contributions',
      'can_view_audit_logs',
    ],
  },
  'Viewer': {
    name: 'Peneliti / Pengamat (Viewer)',
    description: 'Akses lihat saja (read-only) untuk riset linguistik, melihat statistik dan audit tanpa izin mengubah data.',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    defaultPermissions: [
      'can_view_analytics',
      'can_view_audit_logs',
    ],
  },
};

export const PERMISSION_ITEMS: { key: PermissionKey; label: string; description: string; group: 'Kamus' | 'Komunitas' | 'Sistem' | 'Keamanan' }[] = [
  { key: 'can_view_analytics', label: 'Lihat Analitik & Statistik', description: 'Melihat ringkasan metrik, distribusi bahasa, dan grafik pertumbuhan data.', group: 'Sistem' },
  { key: 'can_manage_words', label: 'Tambah & Edit Kosakata', description: 'Membuat entri resmi baru dan menyunting kata yang sudah terdaftar.', group: 'Kamus' },
  { key: 'can_delete_words', label: 'Hapus Kosakata Master', description: 'Menghapus permanen kata dari basis data kamus master.', group: 'Kamus' },
  { key: 'can_moderate_contributions', label: 'Moderasi Usulan Komunitas', description: 'Menyetujui, mengedit, atau menolak kiriman kata dari publik.', group: 'Komunitas' },
  { key: 'can_manage_languages', label: 'Kelola Dialek & Bahasa Sultra', description: 'Menyunting metadata informasi wilayah penutur dan karakteristik bahasa.', group: 'Kamus' },
  { key: 'can_export_backup', label: 'Unduh Cadangan (Backup)', description: 'Mengekspor seluruh basis data ke format JSON atau CSV/Excel.', group: 'Sistem' },
  { key: 'can_import_restore', label: 'Impor & Pulihkan Database', description: 'Mengunggah dan mengembalikan data dari file cadangan.', group: 'Sistem' },
  { key: 'can_manage_users', label: 'Kelola Akun Pengguna Admin', description: 'Membuat akun staff, menyunting role, dan menonaktifkan pengguna.', group: 'Keamanan' },
  { key: 'can_edit_permissions', label: 'Konfigurasi Hak Akses (RBAC)', description: 'Mengubah matriks izin per role dan hak akses khusus akun.', group: 'Keamanan' },
  { key: 'can_view_audit_logs', label: 'Lihat Catatan Audit (Audit Log)', description: 'Memeriksa riwayat aksi siapa melakukan apa dan kapan.', group: 'Keamanan' },
  { key: 'can_system_settings', label: 'Pengaturan Sistem & Profil', description: 'Mengubah konfigurasi keamanan sistem dan profil aplikasi.', group: 'Keamanan' },
];

// -------------------------------------------------------------
// DEFAULT INITIAL ADMIN USERS
// -------------------------------------------------------------
const INITIAL_ADMIN_USERS: StoredAdminAccount[] = [
  {
    id: 'adm-001',
    username: 'admin',
    email: 'admin@leksika.id',
    name: 'Dr. Muh. Arifin, M.Hum',
    role: 'Super Administrator',
    status: 'active',
    passwordHash: 'admin123',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLogin: '2026-09-15T10:30:00.000Z',
  },
  {
    id: 'adm-002',
    username: 'editor',
    email: 'editor.sultra@leksika.id',
    name: 'La Ode Suriadin, S.Pd (Linguis)',
    role: 'Linguist Editor',
    status: 'active',
    passwordHash: 'editor123',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-14T09:15:00.000Z',
    lastLogin: '2026-09-14T14:20:00.000Z',
  },
  {
    id: 'adm-003',
    username: 'moderator',
    email: 'waode.moderator@leksika.id',
    name: 'Wa Ode Nurul Fadhilah',
    role: 'Moderator',
    status: 'active',
    passwordHash: 'moderator123',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T11:00:00.000Z',
    lastLogin: '2026-09-15T08:45:00.000Z',
  },
  {
    id: 'adm-004',
    username: 'viewer',
    email: 'peneliti@balaibahasasultra.kemdikbud.go.id',
    name: 'Tim Peneliti Balai Bahasa',
    role: 'Viewer',
    status: 'active',
    passwordHash: 'viewer123',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-04-18T13:40:00.000Z',
    lastLogin: '2026-09-12T16:10:00.000Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-15T10:30:15.000Z',
    userId: 'adm-001',
    userName: 'Dr. Muh. Arifin, M.Hum',
    userRole: 'Super Administrator',
    action: 'Otentikasi Masuk',
    target: 'Sistem Portal Admin',
    category: 'system',
    ipAddress: '180.252.164.22',
  },
  {
    id: 'log-002',
    timestamp: '2026-09-15T09:12:00.000Z',
    userId: 'adm-002',
    userName: 'La Ode Suriadin, S.Pd',
    userRole: 'Linguist Editor',
    action: 'Tambah Kosakata Resmi',
    target: 'Tolaki: "Metambo" (Makan bersama)',
    category: 'words',
  },
  {
    id: 'log-003',
    timestamp: '2026-09-15T08:45:22.000Z',
    userId: 'adm-003',
    userName: 'Wa Ode Nurul Fadhilah',
    userRole: 'Moderator',
    action: 'Setujui Usulan Komunitas',
    target: 'Muna: "Katumbu" (Nasi ketupat khas Muna)',
    category: 'moderation',
  },
  {
    id: 'log-004',
    timestamp: '2026-09-14T15:20:00.000Z',
    userId: 'adm-001',
    userName: 'Dr. Muh. Arifin, M.Hum',
    userRole: 'Super Administrator',
    action: 'Pembaruan Hak Akses Role',
    target: 'Role Moderator diizinkan melihat Audit Log',
    category: 'roles',
  },
  {
    id: 'log-005',
    timestamp: '2026-09-14T11:05:00.000Z',
    userId: 'adm-001',
    userName: 'Dr. Muh. Arifin, M.Hum',
    userRole: 'Super Administrator',
    action: 'Ekspor Cadangan Database',
    target: 'Unduh leksika_kamus_sultra.json',
    category: 'backup',
  },
];

// -------------------------------------------------------------
// USER STORE HELPER FUNCTIONS
// -------------------------------------------------------------
export function getAdminUsers(): StoredAdminAccount[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_STORE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read admin users:', e);
  }
  return INITIAL_ADMIN_USERS;
}

export function saveAdminUsers(users: StoredAdminAccount[]): void {
  try {
    localStorage.setItem(ADMIN_USERS_STORE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save admin users:', e);
  }
}

export function addAdminUser(newUserData: Omit<StoredAdminAccount, 'id' | 'createdAt'>): StoredAdminAccount {
  const users = getAdminUsers();
  const newUser: StoredAdminAccount = {
    ...newUserData,
    id: `adm-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveAdminUsers(users);

  addAuditLog({
    userId: getAdminSession()?.id || 'sys',
    userName: getAdminSession()?.name || 'Super Administrator',
    userRole: getAdminSession()?.role || 'Super Administrator',
    action: 'Buat Akun Admin Baru',
    target: `${newUser.name} (@${newUser.username}) - Role: ${newUser.role}`,
    category: 'users',
  });

  return newUser;
}

export function updateAdminUser(userId: string, updates: Partial<StoredAdminAccount>): boolean {
  const users = getAdminUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return false;

  const prevRole = users[index].role;
  users[index] = { ...users[index], ...updates };
  saveAdminUsers(users);

  // If currently active session is updated, sync it
  const session = getAdminSession();
  if (session && session.id === userId) {
    const updatedSession: AdminUser = {
      ...session,
      ...updates,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession));
  }

  addAuditLog({
    userId: getAdminSession()?.id || 'sys',
    userName: getAdminSession()?.name || 'Super Administrator',
    userRole: getAdminSession()?.role || 'Super Administrator',
    action: updates.role && updates.role !== prevRole ? 'Ubah Role Akun' : 'Perbarui Akun Admin',
    target: `${users[index].name} (${updates.role || prevRole})`,
    category: 'users',
  });

  return true;
}

export function deleteAdminUser(userId: string): boolean {
  const users = getAdminUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return false;

  // Protect against deleting last Super Admin
  if (target.role === 'Super Administrator') {
    const superAdminCount = users.filter(u => u.role === 'Super Administrator').length;
    if (superAdminCount <= 1) {
      throw new Error('Tidak dapat menghapus satu-satunya Super Administrator.');
    }
  }

  const filtered = users.filter(u => u.id !== userId);
  saveAdminUsers(filtered);

  addAuditLog({
    userId: getAdminSession()?.id || 'sys',
    userName: getAdminSession()?.name || 'Super Administrator',
    userRole: getAdminSession()?.role || 'Super Administrator',
    action: 'Hapus Akun Admin',
    target: `${target.name} (@${target.username})`,
    category: 'users',
  });

  return true;
}

// -------------------------------------------------------------
// ROLE PERMISSION OVERRIDES
// -------------------------------------------------------------
export function getRolePermissionsMap(): Record<AdminRole, PermissionKey[]> {
  try {
    const raw = localStorage.getItem(ROLE_PERMISSIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read role permissions:', e);
  }

  const defaults: Record<AdminRole, PermissionKey[]> = {
    'Super Administrator': [...ROLE_DEFINITIONS['Super Administrator'].defaultPermissions],
    'Linguist Editor': [...ROLE_DEFINITIONS['Linguist Editor'].defaultPermissions],
    'Moderator': [...ROLE_DEFINITIONS['Moderator'].defaultPermissions],
    'Viewer': [...ROLE_DEFINITIONS['Viewer'].defaultPermissions],
  };
  return defaults;
}

export function saveRolePermissionsMap(map: Record<AdminRole, PermissionKey[]>): void {
  try {
    localStorage.setItem(ROLE_PERMISSIONS_KEY, JSON.stringify(map));
    addAuditLog({
      userId: getAdminSession()?.id || 'sys',
      userName: getAdminSession()?.name || 'Super Administrator',
      userRole: getAdminSession()?.role || 'Super Administrator',
      action: 'Modifikasi Matriks Izin (RBAC)',
      target: 'Konfigurasi Hak Akses Role Sistem',
      category: 'roles',
    });
  } catch (e) {
    console.error('Failed to save role permissions:', e);
  }
}

// -------------------------------------------------------------
// PERMISSION CHECKER (RBAC ENGINE)
// -------------------------------------------------------------
export function hasPermission(user: AdminUser | null, permission: PermissionKey): boolean {
  if (!user) return false;
  if (user.status === 'suspended') return false;

  // Super Admin always bypasses all checks
  if (user.role === 'Super Administrator') return true;

  // Check custom user overrides if any
  if (user.customPermissions && user.customPermissions.includes(permission)) {
    return true;
  }

  // Check role-based permission table
  const roleMap = getRolePermissionsMap();
  const permissions = roleMap[user.role] || ROLE_DEFINITIONS[user.role]?.defaultPermissions || [];
  return permissions.includes(permission);
}

// -------------------------------------------------------------
// AUDIT LOG MANAGEMENT
// -------------------------------------------------------------
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read audit logs:', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  try {
    const logs = getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    // Keep last 150 entries
    const updated = [newEntry, ...logs].slice(0, 150);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add audit log:', e);
  }
}

export function clearAuditLogs(): void {
  try {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear audit logs:', e);
  }
}

// -------------------------------------------------------------
// SESSION & AUTHENTICATION
// -------------------------------------------------------------
export function getAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse admin session:', e);
  }
  return null;
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}

export async function authenticateAdmin(
  usernameOrEmail: string,
  passwordInput: string
): Promise<{ success: boolean; user?: AdminUser; message: string }> {
  const cleanInput = usernameOrEmail.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  // Try backend first
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: cleanInput,
        password: cleanPassword,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.admin) {
        const adminUser: AdminUser = {
          ...data.admin,
          lastLogin: new Date().toISOString(),
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        
        addAuditLog({
          userId: adminUser.id,
          userName: adminUser.name,
          userRole: adminUser.role,
          action: 'Login Berhasil (Server)',
          target: 'Portal Administrator',
          category: 'system',
        });

        return { success: true, user: adminUser, message: 'Login admin berhasil!' };
      }
    }
  } catch (err) {
    console.warn('Backend admin auth endpoint not responding, validating locally...', err);
  }

  // Local Accounts Authentication
  const allUsers = getAdminUsers();
  const matchedUser = allUsers.find(u =>
    (u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput) &&
    u.passwordHash === cleanPassword
  );

  if (matchedUser) {
    if (matchedUser.status === 'suspended') {
      return {
        success: false,
        message: 'Akun Anda sedang dinonaktifkan oleh Super Administrator. Hubungi pengelola.',
      };
    }

    const adminUser: AdminUser = {
      id: matchedUser.id,
      username: matchedUser.username,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      status: matchedUser.status,
      avatarUrl: matchedUser.avatarUrl,
      customPermissions: matchedUser.customPermissions,
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));

    // Update lastLogin in stored list
    updateAdminUser(matchedUser.id, { lastLogin: new Date().toISOString() });

    addAuditLog({
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: adminUser.role,
      action: 'Login Berhasil',
      target: `Portal Admin (${adminUser.role})`,
      category: 'system',
    });

    return { success: true, user: adminUser, message: `Selamat datang, ${adminUser.name}!` };
  }

  return {
    success: false,
    message: 'Username/Email atau Kata Sandi salah. Lihat opsi akun demo di bawah formulir.',
  };
}

export function switchActiveAdminUser(userId: string): AdminUser | null {
  const users = getAdminUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return null;

  const adminUser: AdminUser = {
    id: target.id,
    username: target.username,
    email: target.email,
    name: target.name,
    role: target.role,
    status: target.status,
    avatarUrl: target.avatarUrl,
    customPermissions: target.customPermissions,
    lastLogin: new Date().toISOString(),
  };

  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));

  addAuditLog({
    userId: target.id,
    userName: target.name,
    userRole: target.role,
    action: 'Beralih Akun (Simulasi Role)',
    target: `Aktif sebagai ${target.name} (${target.role})`,
    category: 'system',
  });

  return adminUser;
}

export function logoutAdmin(): void {
  try {
    const session = getAdminSession();
    if (session) {
      addAuditLog({
        userId: session.id,
        userName: session.name,
        userRole: session.role,
        action: 'Logout Sesi',
        target: 'Keluar dari Portal Admin',
        category: 'system',
      });
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Failed to remove admin session:', e);
  }
}
