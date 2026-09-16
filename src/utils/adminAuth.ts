import { AdminUser } from '../types';

const ADMIN_SESSION_KEY = 'leksika_admin_session_v1';
const ADMIN_CREDENTIALS_KEY = 'leksika_admin_credentials_v1';

export interface AdminCredentials {
  username: string;
  email: string;
  passwordHash: string; // Stored password
  name: string;
  role: 'Super Administrator' | 'Linguist Editor' | 'Moderator';
}

const DEFAULT_ADMIN: AdminCredentials = {
  username: 'admin',
  email: 'admin@leksika.id',
  passwordHash: 'admin123',
  name: 'Administrator Leksika',
  role: 'Super Administrator',
};

/**
 * Retrieves current admin credentials configuration (allows password updates)
 */
export function getAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read admin credentials:', e);
  }
  return DEFAULT_ADMIN;
}

/**
 * Saves updated admin credentials
 */
export function saveAdminCredentials(creds: AdminCredentials): void {
  try {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(creds));
  } catch (e) {
    console.error('Failed to save admin credentials:', e);
  }
}

/**
 * Gets currently active admin session, if logged in
 */
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

/**
 * Checks whether an admin is currently logged in
 */
export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}

/**
 * Authenticates admin via backend API or fallback local credentials
 */
export async function authenticateAdmin(
  usernameOrEmail: string,
  passwordInput: string
): Promise<{ success: boolean; user?: AdminUser; message: string }> {
  const cleanInput = usernameOrEmail.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  // 1. Try server-side validation first
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
        return { success: true, user: adminUser, message: 'Login admin berhasil!' };
      } else {
        return {
          success: false,
          message: data.message || 'Kredensial login admin tidak sesuai.',
        };
      }
    }
  } catch (err) {
    console.warn('Backend admin auth endpoint not responding, validating locally...', err);
  }

  // 2. Client-side fallback authentication
  const storedCreds = getAdminCredentials();
  const matchesUsername =
    cleanInput === storedCreds.username.toLowerCase() ||
    cleanInput === storedCreds.email.toLowerCase();
  const matchesPassword = cleanPassword === storedCreds.passwordHash;

  if (matchesUsername && matchesPassword) {
    const adminUser: AdminUser = {
      id: 'admin-usr-1',
      username: storedCreds.username,
      email: storedCreds.email,
      name: storedCreds.name,
      role: storedCreds.role,
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser, message: 'Login admin berhasil!' };
  }

  return {
    success: false,
    message: 'Username/Email atau Password salah. Gunakan admin / admin123',
  };
}

/**
 * Logs out the administrator
 */
export function logoutAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Failed to remove admin session:', e);
  }
}
