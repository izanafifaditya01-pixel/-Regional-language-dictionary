import React, { useState, useEffect } from 'react';
import {
  Database,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Server,
  ShieldCheck,
  AlertCircle,
  Key,
  Layers,
  UploadCloud,
  DownloadCloud,
  Code2,
  FileText,
  CheckCircle2,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { WordEntry } from '../types';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  resetSupabaseConfig,
  DEFAULT_SUPABASE_URL
} from '../utils/supabaseClient';
import {
  testSupabaseConnection,
  syncLocalWordsToSupabase,
  fetchWordsFromSupabase,
  SupabaseConnectionStatus
} from '../utils/supabaseService';

interface AdminSupabaseTabProps {
  words: WordEntry[];
  onWordsUpdated?: (updatedWords: WordEntry[]) => void;
  canManageBackup: boolean;
  adminName: string;
}

export const AdminSupabaseTab: React.FC<AdminSupabaseTabProps> = ({
  words,
  onWordsUpdated,
  canManageBackup,
  adminName,
}) => {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);
  const [showKey, setShowKey] = useState(false);

  const [status, setStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'sql' | 'guide'>('overview');

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await testSupabaseConnection();
      setStatus(res);
      if (res.isConnected) {
        showToast('success', res.message);
      } else {
        showToast('error', res.message);
      }
    } catch (err: any) {
      showToast('error', `Gagal menguji koneksi: ${err.message || 'Error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleSaveConfig = () => {
    saveSupabaseConfig(urlInput.trim(), keyInput.trim());
    const updated = getSupabaseConfig();
    setConfig(updated);
    showToast('success', 'Konfigurasi Supabase berhasil disimpan.');
    setTimeout(() => {
      handleTestConnection();
    }, 400);
  };

  const handleResetConfig = () => {
    resetSupabaseConfig();
    const def = getSupabaseConfig();
    setConfig(def);
    setUrlInput(def.url);
    setKeyInput('');
    showToast('info', 'Konfigurasi dikembalikan ke default.');
    setStatus(null);
  };

  const handleSyncToSupabase = async () => {
    if (!config.isConfigured) {
      showToast('error', 'Masukkan Supabase Anon Key terlebih dahulu sebelum sinkronisasi.');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncLocalWordsToSupabase(words);
      if (result.success) {
        showToast('success', `Berhasil menyinkronkan ${result.count} kosakata lokal ke tabel Supabase!`);
        handleTestConnection();
      } else {
        showToast('error', `Gagal sinkronisasi: ${result.error}`);
      }
    } catch (err: any) {
      showToast('error', `Kesalahan sinkronisasi: ${err.message || 'Error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFetchFromSupabase = async () => {
    if (!config.isConfigured) {
      showToast('error', 'Masukkan Supabase Anon Key terlebih dahulu.');
      return;
    }

    setIsFetching(true);
    try {
      const result = await fetchWordsFromSupabase();
      if (result.success && result.data && result.data.length > 0) {
        if (onWordsUpdated) {
          onWordsUpdated(result.data);
        }
        showToast('success', `Berhasil mengimpor ${result.data.length} kosakata live dari database Supabase!`);
        handleTestConnection();
      } else if (result.success) {
        showToast('info', 'Tabel Supabase masih kosong. Anda dapat menyinkronkan data lokal ke Supabase.');
      } else {
        showToast('error', `Gagal mengambil data: ${result.error}`);
      }
    } catch (err: any) {
      showToast('error', `Kesalahan: ${err.message || 'Error'}`);
    } finally {
      setIsFetching(false);
    }
  };

  const FULL_SQL_SCHEMA = `-- ==============================================================================
-- DATABASE SCHEMA: LEKSIKA KAMUS BAHASA DAERAH SULAWESI TENGGARA
-- Target Project: https://mzdnmqkgebbfqgdgulln.supabase.co
-- Engine: PostgreSQL / Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL KOSAKATA KAMUS
CREATE TABLE IF NOT EXISTS public.dictionary_words (
    id VARCHAR(100) PRIMARY KEY,
    source_lang_id VARCHAR(10) NOT NULL DEFAULT 'ind',
    target_lang_id VARCHAR(10) NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    phonetic TEXT,
    category VARCHAR(100) DEFAULT 'Umum',
    example_sentence TEXT,
    example_translation TEXT,
    cultural_context TEXT,
    dialect VARCHAR(100),
    synonyms TEXT[] DEFAULT '{}',
    antonyms TEXT[] DEFAULT '{}',
    is_user_contributed BOOLEAN DEFAULT FALSE,
    contributor_name VARCHAR(150),
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dict_target_lang ON public.dictionary_words(target_lang_id);
CREATE INDEX IF NOT EXISTS idx_dict_word ON public.dictionary_words(word);
CREATE INDEX IF NOT EXISTS idx_dict_translation ON public.dictionary_words(translation);
CREATE INDEX IF NOT EXISTS idx_dict_category ON public.dictionary_words(category);

-- 2. TABEL USULAN KOSAKATA KOMUNITAS (+KATA)
CREATE TABLE IF NOT EXISTS public.community_contributions (
    id VARCHAR(100) PRIMARY KEY,
    source_lang_id VARCHAR(10) NOT NULL DEFAULT 'ind',
    target_lang_id VARCHAR(10) NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    phonetic TEXT,
    category VARCHAR(100) DEFAULT 'Umum',
    example_sentence TEXT,
    example_translation TEXT,
    cultural_context TEXT,
    contributor_name VARCHAR(150) NOT NULL,
    contributor_email VARCHAR(200),
    status VARCHAR(30) DEFAULT 'pending',
    moderator_notes TEXT,
    moderated_by VARCHAR(100),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL PROFIL PENGGUNA
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 1,
    badges TEXT[] DEFAULT '{}',
    favorites TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL CATATAN AUDIT SISTEM
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(200) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.dictionary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Dictionary" ON public.dictionary_words FOR SELECT USING (true);
CREATE POLICY "Allow Manage Dictionary" ON public.dictionary_words FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Contributions" ON public.community_contributions FOR SELECT USING (true);
CREATE POLICY "Public Insert Contributions" ON public.community_contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Manage Contributions" ON public.community_contributions FOR ALL USING (true);
CREATE POLICY "Public Manage Profiles" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Public Manage Audit Logs" ON public.system_audit_logs FOR ALL USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(FULL_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('success', 'Skrip SQL Schema Supabase berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const projectDashboardUrl = 'https://supabase.com/dashboard/project/mzdnmqkgebbfqgdgulln';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-lg text-sm font-bold border transition-all animate-in fade-in duration-200 ${
          notification.type === 'success' ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50' :
          notification.type === 'error' ? 'bg-rose-950/80 text-rose-200 border-rose-500/50' :
          'bg-blue-950/80 text-blue-200 border-blue-500/50'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {notification.type === 'info' && <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs text-slate-400 hover:text-white cursor-pointer ml-3">
            ✕
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-900/50 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Integrasi Database Supabase (PostgreSQL)
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cloud Live DB
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Penyimpanan cloud terpusat untuk kosakata 4 bahasa daerah Sultra (Tolaki, Moronene, Muna, Wolio), usulan komunitas (+Kata), profil pengguna, serta log audit sistem.
              </p>
              <div className="mt-2.5 flex items-center gap-2 text-xs font-mono text-emerald-400/90 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 w-fit">
                <span>URL Target:</span>
                <strong className="text-white select-all">{DEFAULT_SUPABASE_URL}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>

            <a
              href={projectDashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Buka Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Status & Sinkronisasi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sql')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sql'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Skrip SQL Schema & RLS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Panduan Aktivasi 3 Langkah</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYNCHRONIZATION */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status & Sync Actions (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-time Status Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${
                    status?.isConnected ? 'bg-emerald-400 animate-pulse' :
                    config.isConfigured ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <h4 className="text-sm font-bold text-white">Status Konektivitas Database</h4>
                </div>
                {status?.lastChecked && (
                  <span className="text-[11px] text-slate-400">
                    Diperiksa: {status.lastChecked}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-start gap-3">
                  {status?.isConnected ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-bold ${status?.isConnected ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {status?.message || 'Memeriksa status koneksi ke Supabase...'}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1">
                      {status?.wordCount !== undefined && status.wordCount > 0
                        ? 'Aplikasi terhubung ke database cloud Supabase. Kosakata dan usulan komunitas dapat disimpan secara persisten.'
                        : 'Kredensial anon key sudah terhubung ke project Supabase. Klik tombol di bawah untuk menyalin skrip SQL lalu jalankan di Supabase SQL Editor.'}
                    </p>

                    {/* Quick Step Buttons if tables not yet created or empty */}
                    {(status?.wordCount === undefined || status.wordCount === 0) && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleCopySql}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSql ? 'Tersalin!' : '1. Salin Skrip SQL Schema'}</span>
                        </button>
                        <a
                          href="https://supabase.com/dashboard/project/mzdnmqkgebbfqgdgulln/sql/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                        >
                          <span>2. Buka SQL Editor Supabase</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Total Kosakata Lokal</span>
                    <strong className="text-base text-white font-black">{words.length} Kata</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Terdeteksi di Supabase</span>
                    <strong className="text-base text-emerald-400 font-black">
                      {status?.wordCount !== undefined ? `${status.wordCount} Kata` : '-'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block">Status Anon Key</span>
                    <strong className={`text-xs font-bold ${config.isConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {config.isConfigured ? '✓ Terkonfigurasi' : '⚠️ Belum Diisi'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync & Bulk Operations */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Operasi Sinkronisasi Dua Arah</span>
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Sinkronkan seluruh kosakata master lokal (4 bahasa daerah Sultra) ke database Supabase, atau muat data live terbaru dari Supabase ke memori aplikasi.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSyncToSupabase}
                  disabled={isSyncing || !config.isConfigured}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Unggah seluruh kosakata lokal ke Supabase table dictionary_words"
                >
                  <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                  <span>{isSyncing ? 'Mengunggah ke Supabase...' : `Unggah ${words.length} Kosakata ke Supabase`}</span>
                </button>

                <button
                  onClick={handleFetchFromSupabase}
                  disabled={isFetching || !config.isConfigured}
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Muat data kosakata live dari Supabase ke tampilan aplikasi"
                >
                  <DownloadCloud className={`w-4 h-4 ${isFetching ? 'animate-bounce' : ''}`} />
                  <span>{isFetching ? 'Memuat dari Supabase...' : 'Muat Kosakata dari Supabase'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Form (1 col) */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Kredensial API Supabase</span>
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    placeholder="https://xyz.supabase.co"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Default: {DEFAULT_SUPABASE_URL}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Supabase Anon Public Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      {showKey ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={e => setKeyInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Dapatkan di dashboard Supabase: <br />
                    <span className="text-slate-300">Project Settings → API → Project API Keys → `anon public`</span>
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={handleSaveConfig}
                    className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Simpan Kredensial
                  </button>
                  <button
                    onClick={handleResetConfig}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                    title="Reset ke nilai default"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs space-y-2">
              <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Akses Cepat Dashboard:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Buka SQL Editor atau Table Editor langsung pada project Supabase Anda:
              </p>
              <a
                href={projectDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-xs underline"
              >
                <span>https://supabase.com/dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SQL SCHEMA & RLS */}
      {activeSubTab === 'sql' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Skrip SQL Migration Lengkap (CREATE TABLE, RLS, & Indeks)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Salin skrip ini lalu jalankan di menu <strong>SQL Editor</strong> pada dashboard Supabase Anda.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 ${
                copiedSql
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Skrip SQL'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-[500px] overflow-y-auto space-y-1">
            <pre className="whitespace-pre-wrap leading-relaxed select-all">
              {FULL_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP GUIDE */}
      {activeSubTab === 'guide' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span>Panduan Singkat Mengaktifkan Database Supabase (3 Langkah)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
                1
              </div>
              <h5 className="text-sm font-bold text-white">Buka SQL Editor Supabase</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Login ke dashboard Supabase pada project URL <code className="text-emerald-300">mzdnmqkgebbfqgdgulln</code>, lalu buka menu <strong>SQL Editor</strong> di bilah navigasi kiri.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
                2
              </div>
              <h5 className="text-sm font-bold text-white">Tempel & Klik "RUN"</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Salin skrip SQL dari tab <strong>"Skrip SQL Schema & RLS"</strong> di atas, tempel pada editor query SQL Supabase, lalu klik tombol hijau <strong>RUN</strong> untuk membuat tabel.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
                3
              </div>
              <h5 className="text-sm font-bold text-white">Salin Anon Key & Sinkron</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Masuk ke <strong>Project Settings → API</strong>, salin string <strong>anon public key</strong>, tempel pada formulir di tab ini, lalu klik tombol <strong>"Unggah Kosakata ke Supabase"</strong>!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
