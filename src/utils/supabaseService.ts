import { WordEntry, AuditLogEntry } from '../types';
import { getSupabaseClient, getSupabaseConfig } from './supabaseClient';

export interface SupabaseConnectionStatus {
  isConnected: boolean;
  isConfigured: boolean;
  url: string;
  message: string;
  wordCount?: number;
  lastChecked?: string;
}

// Convert WordEntry to Supabase DB Row
export function mapWordToDb(word: WordEntry) {
  return {
    id: word.id,
    source_lang_id: word.sourceLangId,
    target_lang_id: word.targetLangId,
    word: word.word,
    translation: word.translation,
    phonetic: word.phonetic || null,
    category: word.category || 'Umum',
    example_sentence: word.exampleSentence || null,
    example_translation: word.exampleTranslation || null,
    cultural_context: word.culturalContext || null,
    dialect: word.dialect || null,
    synonyms: word.synonyms || [],
    antonyms: word.antonyms || [],
    is_user_contributed: Boolean(word.isUserContributed),
    contributor_name: word.contributorName || null,
    is_popular: Boolean(word.isPopular),
    created_at: word.createdAt ? new Date(word.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Convert Supabase DB Row to WordEntry
export function mapDbToWord(row: any): WordEntry {
  return {
    id: row.id,
    sourceLangId: row.source_lang_id || 'ind',
    targetLangId: row.target_lang_id,
    word: row.word,
    translation: row.translation,
    phonetic: row.phonetic || undefined,
    category: row.category || 'Umum',
    exampleSentence: row.example_sentence || undefined,
    exampleTranslation: row.example_translation || undefined,
    culturalContext: row.cultural_context || undefined,
    dialect: row.dialect || undefined,
    synonyms: Array.isArray(row.synonyms) ? row.synonyms : [],
    antonyms: Array.isArray(row.antonyms) ? row.antonyms : [],
    isUserContributed: Boolean(row.is_user_contributed),
    contributorName: row.contributor_name || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : undefined,
    isPopular: Boolean(row.is_popular),
  };
}

/**
 * Check connection health with Supabase database
 */
export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const config = getSupabaseConfig();
  const nowStr = new Date().toLocaleTimeString('id-ID');

  if (!config.isConfigured) {
    return {
      isConnected: false,
      isConfigured: false,
      url: config.url,
      message: 'Anon Key belum diisi. Masukkan Anon Key Supabase Anda untuk mengaktifkan koneksi.',
      lastChecked: nowStr,
    };
  }

  try {
    const client = getSupabaseClient();
    const { data, error, count } = await client
      .from('dictionary_words')
      .select('id', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      // Check if table does not exist yet in Supabase (e.g. PGRST205 or 42P01)
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message.includes('schema cache') ||
        error.message.includes('dictionary_words') ||
        error.message.includes('relation "public.dictionary_words" does not exist')
      ) {
        return {
          isConnected: true,
          isConfigured: true,
          url: config.url,
          message: 'Koneksi ke Supabase Berhasil & Kredensial Valid! Tinggal 1 langkah: Jalankan skrip SQL di Supabase SQL Editor untuk mengaktifkan tabel "dictionary_words".',
          lastChecked: nowStr,
        };
      }

      return {
        isConnected: false,
        isConfigured: true,
        url: config.url,
        message: `Koneksi gagal: ${error.message} (${error.code || 'Error'})`,
        lastChecked: nowStr,
      };
    }

    return {
      isConnected: true,
      isConfigured: true,
      url: config.url,
      message: `Terhubung dengan sukses ke database Supabase! (${count ?? (data?.length || 0)} kosakata terdeteksi)`,
      wordCount: count ?? (data?.length || 0),
      lastChecked: nowStr,
    };
  } catch (err: any) {
    return {
      isConnected: false,
      isConfigured: true,
      url: config.url,
      message: `Gagal menghubungkan: ${err.message || 'Kesalahan jaringan'}`,
      lastChecked: nowStr,
    };
  }
}

/**
 * Fetch all words from Supabase dictionary_words table
 */
export async function fetchWordsFromSupabase(): Promise<{ success: boolean; data?: WordEntry[]; error?: string }> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return { success: false, error: 'Supabase Anon Key belum diatur' };
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('dictionary_words')
      .select('*')
      .order('word', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    const words = (data || []).map(mapDbToWord);
    return { success: true, data: words };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal memuat data' };
  }
}

/**
 * Upsert a single word to Supabase
 */
export async function upsertWordToSupabase(word: WordEntry): Promise<{ success: boolean; error?: string }> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return { success: false, error: 'Anon key belum diatur' };

  try {
    const client = getSupabaseClient();
    const payload = mapWordToDb(word);
    const { error } = await client.from('dictionary_words').upsert(payload, { onConflict: 'id' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan kosakata ke Supabase' };
  }
}

/**
 * Delete a word from Supabase
 */
export async function deleteWordFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return { success: false, error: 'Anon key belum diatur' };

  try {
    const client = getSupabaseClient();
    const { error } = await client.from('dictionary_words').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menghapus kosakata dari Supabase' };
  }
}

/**
 * Bulk sync local words to Supabase
 */
export async function syncLocalWordsToSupabase(words: WordEntry[]): Promise<{ success: boolean; count: number; error?: string }> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return { success: false, count: 0, error: 'Anon key belum diatur' };

  try {
    const client = getSupabaseClient();
    const rows = words.map(mapWordToDb);

    // Chunk upsert by 50 items to avoid payload limits
    const CHUNK_SIZE = 50;
    let syncedCount = 0;

    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const { error } = await client.from('dictionary_words').upsert(chunk, { onConflict: 'id' });
      if (error) {
        return { success: false, count: syncedCount, error: error.message };
      }
      syncedCount += chunk.length;
    }

    return { success: true, count: syncedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Sinkronisasi gagal' };
  }
}

/**
 * Record audit log to Supabase system_audit_logs
 */
export async function recordAuditLogToSupabase(log: AuditLogEntry): Promise<void> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return;

  try {
    const client = getSupabaseClient();
    await client.from('system_audit_logs').insert({
      id: log.id,
      user_id: log.userId,
      user_name: log.userName,
      user_role: log.userRole,
      action: log.action,
      target: log.target,
      category: log.category,
      created_at: log.timestamp,
    });
  } catch (err) {
    console.warn('Failed to record audit log to Supabase:', err);
  }
}

/**
 * Fetch audit logs from Supabase
 */
export async function fetchAuditLogsFromSupabase(): Promise<AuditLogEntry[]> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return [];

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('system_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      timestamp: row.created_at,
      userId: row.user_id,
      userName: row.user_name,
      userRole: row.user_role,
      action: row.action,
      target: row.target,
      category: row.category,
      details: row.details,
    }));
  } catch {
    return [];
  }
}
