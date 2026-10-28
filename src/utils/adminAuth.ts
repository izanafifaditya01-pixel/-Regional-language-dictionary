import { AdminUser, PermissionKey, AuditLogEntry } from '../types';

const ADMIN_SESSION_KEY = 'leksika_admin_session_v3';
const ADMIN_USERS_STORE_KEY = 'leksika_admin_users_v3';
const AUDIT_LOGS_KEY = 'leksika_admin_audit_logs_v3';

export interface StoredAdminAccount extends AdminUser {
  passwordHash: string;
}

// -------------------------------------------------------------
// DEFAULT INITIAL ADMIN ACCOUNT (SINGLE ADMIN ROLE)
// -------------------------------------------------------------
const INITIAL_ADMIN_USERS: StoredAdminAccount[] = [
  {
    id: 'adm-001',
    username: 'admin',
    email: 'admin@leksika.id',
    name: 'Administrator Leksika',
    role: 'Admin',
    status: 'active',
    passwordHash: 'admin123',
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLogin: '2026-09-15T10:30:00.000Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-15T10:30:15.000Z',
    userId: 'adm-001',
    userName: 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Login Sesi Admin',
    target: 'Konsol Admin Leksika',
    category: 'system',
  },
  {
    id: 'log-002',
    timestamp: '2026-09-15T09:12:00.000Z',
    userId: 'adm-001',
    userName: 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Tambah Kosakata Resmi',
    target: 'Tolaki: "Metambo" (Makan bersama)',
    category: 'words',
  },
  {
    id: 'log-003',
    timestamp: '2026-09-15T08:45:22.000Z',
    userId: 'adm-001',
    userName: 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Setujui Usulan User',
    target: 'Muna: "Katumbu" (Nasi ketupat khas Muna)',
    category: 'moderation',
  },
  {
    id: 'log-004',
    timestamp: '2026-09-14T11:05:00.000Z',
    userId: 'adm-001',
    userName: 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Ekspor Cadangan Database',
    target: 'Unduh leksika_kamus_sultra.json',
    category: 'backup',
  },
];

// -------------------------------------------------------------
// ADMIN ACCOUNT STORE HELPERS
// -------------------------------------------------------------
export function getAdminUsers(): StoredAdminAccount[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_STORE_KEY);
    if (raw) {
      const parsed: StoredAdminAccount[] = JSON.parse(raw);
      return parsed.map(u => ({ ...u, role: 'Admin' }));
    }
  } catch (e) {
    console.error('Failed to read admin users:', e);
  }
  return INITIAL_ADMIN_USERS;
}

export function saveAdminUsers(users: StoredAdminAccount[]): void {
  try {
    localStorage.setItem(
      ADMIN_USERS_STORE_KEY,
      JSON.stringify(users.map(u => ({ ...u, role: 'Admin' as const })))
    );
  } catch (e) {
    console.error('Failed to save admin users:', e);
  }
}

export function addAdminUser(
  newUserData: Omit<StoredAdminAccount, 'id' | 'createdAt' | 'role'> & { role?: 'Admin' }
): StoredAdminAccount {
  const users = getAdminUsers();
  const newUser: StoredAdminAccount = {
    ...newUserData,
    role: 'Admin',
    id: `adm-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveAdminUsers(users);

  addAuditLog({
    userId: getAdminSession()?.id || 'adm-001',
    userName: getAdminSession()?.name || 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Tambah Akun Admin',
    target: `${newUser.name} (@${newUser.username})`,
    category: 'users',
  });

  return newUser;
}

export function updateAdminUser(userId: string, updates: Partial<StoredAdminAccount>): boolean {
  const users = getAdminUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return false;

  users[index] = { ...users[index], ...updates, role: 'Admin' };
  saveAdminUsers(users);

  const session = getAdminSession();
  if (session && session.id === userId) {
    const updatedSession: AdminUser = {
      ...session,
      ...updates,
      role: 'Admin',
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession));
  }

  addAuditLog({
    userId: getAdminSession()?.id || 'adm-001',
    userName: getAdminSession()?.name || 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Perbarui Akun Admin',
    target: `${users[index].name} (@${users[index].username})`,
    category: 'users',
  });

  return true;
}

export function deleteAdminUser(userId: string): boolean {
  const users = getAdminUsers();
  const target = users.find(u => u.id === userId);
  if (!target) return false;

  if (users.length <= 1) {
    throw new Error('Tidak dapat menghapus satu-satunya akun Admin sistem.');
  }

  const filtered = users.filter(u => u.id !== userId);
  saveAdminUsers(filtered);

  addAuditLog({
    userId: getAdminSession()?.id || 'adm-001',
    userName: getAdminSession()?.name || 'Administrator Leksika',
    userRole: 'Admin',
    action: 'Hapus Akun Admin',
    target: `${target.name} (@${target.username})`,
    category: 'users',
  });

  return true;
}

// -------------------------------------------------------------
// PERMISSION CHECKER (ALL ACTIVE ADMINS HAVE FULL ADMIN ACCESS)
// -------------------------------------------------------------
export function hasPermission(user: AdminUser | null, _permission: PermissionKey): boolean {
  if (!user) return false;
  if (user.status === 'suspended') return false;
  return true;
}

// -------------------------------------------------------------
// AUDIT LOG MANAGEMENT
// -------------------------------------------------------------
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (raw) {
      const parsed: AuditLogEntry[] = JSON.parse(raw);
      return parsed.map(l => ({ ...l, userRole: 'Admin' }));
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
      userRole: 'Admin',
      id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
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
      const parsed: AdminUser = JSON.parse(raw);
      return { ...parsed, role: 'Admin' };
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
          role: 'Admin',
          lastLogin: new Date().toISOString(),
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));

        addAuditLog({
          userId: adminUser.id,
          userName: adminUser.name,
          userRole: 'Admin',
          action: 'Login Berhasil',
          target: 'Konsol Admin',
          category: 'system',
        });

        return { success: true, user: adminUser, message: 'Login Admin berhasil!' };
      }
    }
  } catch (err) {
    console.warn('Backend admin auth endpoint fallback to local store:', err);
  }

  const allUsers = getAdminUsers();
  const matchedUser = allUsers.find(
    u =>
      (u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput) &&
      u.passwordHash === cleanPassword
  );

  if (matchedUser) {
    if (matchedUser.status === 'suspended') {
      return {
        success: false,
        message: 'Akun Admin ini sedang dinonaktifkan.',
      };
    }

    const adminUser: AdminUser = {
      id: matchedUser.id,
      username: matchedUser.username,
      email: matchedUser.email,
      name: matchedUser.name,
      role: 'Admin',
      status: matchedUser.status,
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    updateAdminUser(matchedUser.id, { lastLogin: new Date().toISOString() });

    addAuditLog({
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: 'Admin',
      action: 'Login Berhasil',
      target: 'Konsol Admin',
      category: 'system',
    });

    return { success: true, user: adminUser, message: `Selamat datang, ${adminUser.name}!` };
  }

  return {
    success: false,
    message: 'Username/Email atau Kata Sandi Admin tidak sesuai.',
  };
}

export function logoutAdmin(): void {
  try {
    const session = getAdminSession();
    if (session) {
      addAuditLog({
        userId: session.id,
        userName: session.name,
        userRole: 'Admin',
        action: 'Logout Sesi',
        target: 'Keluar dari Konsol Admin',
        category: 'system',
      });
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Failed to remove admin session:', e);
  }
}
