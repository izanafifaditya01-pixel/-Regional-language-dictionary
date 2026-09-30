import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default target Supabase project URL and anon key provided by the user
export const DEFAULT_SUPABASE_URL = 'https://mzdnmqkgebbfqgdgulln.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16ZG5tcWtnZWJiZnFnZGd1bGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMDQzOTUsImV4cCI6MjEwNTY4MDM5NX0.F4hVUPyIXBm92mxdv4Yy22eDu2cnAYW20RkEpZcY3EE';

// Storage keys
const SUPABASE_URL_KEY = 'leksika_supabase_url_v1';
const SUPABASE_ANON_KEY_KEY = 'leksika_supabase_anon_key_v1';

// Get active configuration (Priority: localStorage > import.meta.env > default)
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = DEFAULT_SUPABASE_URL;
  let anonKey = DEFAULT_SUPABASE_ANON_KEY;

  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const savedKey = localStorage.getItem(SUPABASE_ANON_KEY_KEY);
    if (savedUrl && savedUrl.trim()) url = savedUrl.trim();
    if (savedKey && savedKey.trim()) anonKey = savedKey.trim();
  }

  // Fallback to Vite env variables if not in localStorage
  if (!anonKey && typeof import.meta !== 'undefined') {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv?.VITE_SUPABASE_URL) {
      url = metaEnv.VITE_SUPABASE_URL;
    }
    if (metaEnv?.VITE_SUPABASE_ANON_KEY) {
      anonKey = metaEnv.VITE_SUPABASE_ANON_KEY;
    }
  }

  const isConfigured = Boolean(url && anonKey && anonKey.length > 20);

  return { url, anonKey, isConfigured };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  if (url && url.trim()) {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  }
  if (anonKey !== undefined) {
    localStorage.setItem(SUPABASE_ANON_KEY_KEY, anonKey.trim());
  }
  // Reinitialize client instance
  clientInstance = null;
}

export function resetSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUPABASE_URL_KEY);
  localStorage.removeItem(SUPABASE_ANON_KEY_KEY);
  clientInstance = null;
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client instance.
 * If anonKey is not yet set, creates a dummy instance that fails gracefully.
 */
export function getSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();
  const activeKey = anonKey || 'placeholder-anon-key-pending-input';

  if (!clientInstance) {
    clientInstance = createClient(url, activeKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return clientInstance;
}
