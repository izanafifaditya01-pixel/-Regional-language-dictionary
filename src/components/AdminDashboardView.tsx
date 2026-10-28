import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Globe2,
  Download,
  Settings,
  LogOut,
  Eye,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  Award,
  Users,
  Database,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Volume2,
  Flame,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  FileText,
  Shield,
  UserCheck,
  ChevronDown,
  AlertTriangle,
  Link2,
  Menu,
  Copy,
  Check,
} from 'lucide-react';
import { WordEntry, Language, AdminUser, AdminTab, AdminRole } from '../types';
import { LANGUAGES_DATA } from '../data/languagesData';
import {
  hasPermission,
  getAdminUsers,
  addAuditLog,
  updateAdminUser,
} from '../utils/adminAuth';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminAuditLogTab } from './AdminAuditLogTab';
import { AdminSupabaseTab } from './AdminSupabaseTab';
import { getSecretAdminUrl } from '../utils/portalConfig';

interface AdminDashboardViewProps {
  adminUser: AdminUser;
  onLogout: () => void;
  allWords: WordEntry[];
  contributedWords: WordEntry[];
  onAddWord: (wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>, contributorName: string) => void;
  onUpdateWord: (wordId: string, updatedFields: Partial<WordEntry>) => void;
  onDeleteWord: (wordId: string) => void;
  onWordsUpdated?: (updatedWords: WordEntry[]) => void;
}

const ADMIN_TAB_TITLES: Record<AdminTab, string> = {
  overview: 'Ringkasan Dashboard',
  words: 'Kelola Kosakata Master',
  moderation: 'Usulan Kata dari User',
  languages: 'Rumpun Bahasa Daerah',
  users: 'Manajemen Akun Admin',
  audit: 'Riwayat Aktivitas Admin',
  backup: 'Ekspor & Cadangan Data',
  supabase: 'Database Cloud Supabase',
  settings: 'Pengaturan Akun Admin',
};

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  onLogout,
  allWords,
  contributedWords,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
  onWordsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [moderationSubFilter, setModerationSubFilter] = useState<'pending' | 'approved'>('pending');
  const [copiedSecretUrl, setCopiedSecretUrl] = useState(false);

  const handleCopySecretUrl = () => {
    navigator.clipboard.writeText(getSecretAdminUrl());
    setCopiedSecretUrl(true);
    setTimeout(() => setCopiedSecretUrl(false), 2500);
  };

  const pendingContributions = useMemo(
    () => contributedWords.filter(w => w.moderationStatus === 'pending'),
    [contributedWords]
  );
  const approvedContributions = useMemo(
    () =>
      contributedWords.filter(
        w => w.isUserContributed && w.moderationStatus !== 'pending' && w.moderationStatus !== 'rejected'
      ),
    [contributedWords]
  );

  // Search & Filters in Words Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<'all' | 'official' | 'community'>('all');

  // Word Editor Modal State (For Adding or Editing a Word)
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordEntry | null>(null);

  // Form Fields for Add/Edit
  const [formWord, setFormWord] = useState('');
  const [formTranslation, setFormTranslation] = useState('');
  const [formPhonetic, setFormPhonetic] = useState('');
  const [formTargetLangId, setFormTargetLangId] = useState('tk');
  const [formCategory, setFormCategory] = useState('Kosakata Umum');
  const [formExampleSentence, setFormExampleSentence] = useState('');
  const [formExampleTranslation, setFormExampleTranslation] = useState('');
  const [formCulturalContext, setFormCulturalContext] = useState('');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsWordOfTheDay, setFormIsWordOfTheDay] = useState(false);
  const [formNotification, setFormNotification] = useState<string | null>(null);

  // Settings tab form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminDisplayName, setAdminDisplayName] = useState(adminUser.name);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Full Admin permissions
  const canManageWords = hasPermission(adminUser, 'can_manage_words');
  const canDeleteWords = hasPermission(adminUser, 'can_delete_words');
  const canModerate = hasPermission(adminUser, 'can_moderate_contributions');
  const canExport = hasPermission(adminUser, 'can_export_backup');

  const allAdminAccounts = getAdminUsers();

  // Sultra Languages list
  const sultraLanguages = useMemo(() => {
    return LANGUAGES_DATA.filter(l => ['tk', 'mun', 'btn'].includes(l.id) || l.id === 'mor');
  }, []);

  // Filtered Words for the Table
  const filteredWords = useMemo(() => {
    return allWords.filter(entry => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          entry.word.toLowerCase().includes(q) ||
          entry.translation.toLowerCase().includes(q) ||
          entry.phonetic.toLowerCase().includes(q) ||
          (entry.exampleSentence && entry.exampleSentence.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Language filter
      if (selectedLangFilter !== 'all' && entry.targetLangId !== selectedLangFilter) {
        return false;
      }

      // Category filter
      if (selectedCategoryFilter !== 'all' && entry.category !== selectedCategoryFilter) {
        return false;
      }

      // Source filter
      if (selectedSourceFilter === 'official' && entry.isUserContributed) {
        return false;
      }
      if (selectedSourceFilter === 'community' && !entry.isUserContributed) {
        return false;
      }

      return true;
    });
  }, [allWords, searchQuery, selectedLangFilter, selectedCategoryFilter, selectedSourceFilter]);

  // Distinct categories
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    allWords.forEach(w => {
      if (w.category) cats.add(w.category);
    });
    return Array.from(cats);
  }, [allWords]);

  // Open modal for new word
  const handleOpenAddModal = () => {
    setEditingWord(null);
    setFormWord('');
    setFormTranslation('');
    setFormPhonetic('');
    setFormTargetLangId('tk');
    setFormCategory('Kosakata Umum');
    setFormExampleSentence('');
    setFormExampleTranslation('');
    setFormCulturalContext('');
    setFormIsPopular(false);
    setFormIsWordOfTheDay(false);
    setIsWordModalOpen(true);
  };

  // Open modal for editing word
  const handleOpenEditModal = (word: WordEntry) => {
    setEditingWord(word);
    setFormWord(word.word);
    setFormTranslation(word.translation);
    setFormPhonetic(word.phonetic || '');
    setFormTargetLangId(word.targetLangId);
    setFormCategory(word.category || 'Kosakata Umum');
    setFormExampleSentence(word.exampleSentence || '');
    setFormExampleTranslation(word.exampleTranslation || '');
    setFormCulturalContext(word.culturalContext || '');
    setFormIsPopular(!!word.isPopular);
    setFormIsWordOfTheDay(!!word.isWordOfTheDay);
    setIsWordModalOpen(true);
  };

  // Save word handler
  const handleSaveWordForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWord.trim() || !formTranslation.trim()) {
      setFormNotification('Kata Bahasa Indonesia dan Terjemahan Daerah wajib diisi.');
      setTimeout(() => setFormNotification(null), 3500);
      return;
    }

    if (!canManageWords) {
      setFormNotification('Akses ditolak: Akun Anda tidak memiliki hak akses mengubah kosakata (can_manage_words).');
      setTimeout(() => setFormNotification(null), 3500);
      setIsWordModalOpen(false);
      return;
    }

    if (editingWord) {
      // Update existing word
      onUpdateWord(editingWord.id, {
        word: formWord.trim(),
        translation: formTranslation.trim(),
        phonetic: formPhonetic.trim() || formTranslation.toLowerCase(),
        targetLangId: formTargetLangId,
        category: formCategory.trim(),
        exampleSentence: formExampleSentence.trim(),
        exampleTranslation: formExampleTranslation.trim(),
        culturalContext: formCulturalContext.trim(),
        isPopular: formIsPopular,
        isWordOfTheDay: formIsWordOfTheDay,
      });
      addAuditLog({
        userId: adminUser.id,
        userName: adminUser.name,
        userRole: adminUser.role,
        action: 'Memperbarui Kosakata',
        target: `${formWord.trim()} (${formTargetLangId.toUpperCase()})`,
        category: 'words',
      });
      setFormNotification(`Kosakata "${formWord}" berhasil diperbarui.`);
    } else {
      // Add new word
      onAddWord(
        {
          sourceLangId: 'ind',
          targetLangId: formTargetLangId,
          word: formWord.trim(),
          translation: formTranslation.trim(),
          phonetic: formPhonetic.trim() || formTranslation.toLowerCase(),
          category: formCategory.trim(),
          exampleSentence: formExampleSentence.trim(),
          exampleTranslation: formExampleTranslation.trim(),
          culturalContext: formCulturalContext.trim(),
          isPopular: formIsPopular,
          isWordOfTheDay: formIsWordOfTheDay,
        },
        adminUser.name
      );
      addAuditLog({
        userId: adminUser.id,
        userName: adminUser.name,
        userRole: adminUser.role,
        action: 'Menambah Kosakata Baru',
        target: `${formWord.trim()} (${formTargetLangId.toUpperCase()})`,
        category: 'words',
      });
      setFormNotification(`Kosakata baru "${formWord}" berhasil ditambahkan ke basis data.`);
    }

    setIsWordModalOpen(false);
    setTimeout(() => setFormNotification(null), 3500);
  };

  // Export database as JSON
  const handleExportJson = () => {
    if (!canExport) {
      setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin ekspor cadangan data (can_export_backup).');
      setTimeout(() => setFormNotification(null), 3500);
      return;
    }
    addAuditLog({
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: adminUser.role,
      action: 'Ekspor Data JSON',
      target: `${allWords.length} entri kata kamus`,
      category: 'backup',
    });
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allWords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `leksika_kamus_sultra_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export database as CSV
  const handleExportCsv = () => {
    if (!canExport) {
      setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin ekspor cadangan data (can_export_backup).');
      setTimeout(() => setFormNotification(null), 3500);
      return;
    }
    addAuditLog({
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: adminUser.role,
      action: 'Ekspor Data CSV',
      target: `${allWords.length} entri kata kamus`,
      category: 'backup',
    });
    const headers = ['ID', 'Bahasa Asal', 'Bahasa Tujuan', 'Kata', 'Terjemahan', 'Fonetik', 'Kategori', 'Contoh Kalimat', 'Arti Kalimat', 'Konteks Budaya', 'Tipe Kontributor'];
    const rows = allWords.map(w => [
      `"${w.id}"`,
      `"${w.sourceLangId}"`,
      `"${w.targetLangId}"`,
      `"${(w.word || '').replace(/"/g, '""')}"`,
      `"${(w.translation || '').replace(/"/g, '""')}"`,
      `"${(w.phonetic || '').replace(/"/g, '""')}"`,
      `"${(w.category || '').replace(/"/g, '""')}"`,
      `"${(w.exampleSentence || '').replace(/"/g, '""')}"`,
      `"${(w.exampleTranslation || '').replace(/"/g, '""')}"`,
      `"${(w.culturalContext || '').replace(/"/g, '""')}"`,
      `"${w.isUserContributed ? 'Komunitas' : 'Resmi Master'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `leksika_kamus_sultra_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Change Admin Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setSettingsMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    const success = updateAdminUser(adminUser.id, {
      name: adminDisplayName.trim() || adminUser.name,
      ...(newPassword ? { passwordHash: newPassword } : {}),
    });

    if (success) {
      setSettingsMessage({ type: 'success', text: 'Pengaturan profil administrator berhasil disimpan!' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSettingsMessage(null), 3000);
    } else {
      setSettingsMessage({ type: 'error', text: 'Gagal memperbarui pengaturan akun.' });
    }
  };

  const getLanguageName = (langId: string) => {
    const found = LANGUAGES_DATA.find(l => l.id === langId);
    return found ? found.name : langId.toUpperCase();
  };

  const handleSelectSidebarTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const renderSidebarContent = () => (
    <div className="h-full flex flex-col justify-between bg-[#070B14] text-slate-200">
      {/* Top Sidebar Brand & Navigation Groups */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Console Brand Lockup */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800/90">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-white tracking-tight truncate">
                Leksika Console
              </div>
              <div className="text-[10px] font-mono text-sky-400 truncate">
                BACK-OFFICE CMS
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Group 1: Operasional Leksikon */}
        <div className="space-y-1">
          <div className="px-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Operasional Leksikon
          </div>
          <button
            type="button"
            onClick={() => handleSelectSidebarTab('overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Ringkasan Sistem</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSidebarTab('words')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
              activeTab === 'words'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Database Kosakata</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">{allWords.length}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSidebarTab('languages')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'languages'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Globe2 className="w-4 h-4 shrink-0" />
              <span>Rumpun Bahasa</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">4</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSidebarTab('moderation')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
              activeTab === 'moderation'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Usulan Kata User</span>
            </span>
            <span className="font-mono text-[11px] text-amber-400 font-bold">
              {pendingContributions.length}
            </span>
          </button>
        </div>

        {/* Group 2: Sistem & Akun Admin */}
        <div className="space-y-1">
          <div className="px-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Sistem &amp; Akun Admin
          </div>
          <button
            type="button"
            onClick={() => handleSelectSidebarTab('users')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
              activeTab === 'users'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0" />
              <span>Akun Admin</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">{allAdminAccounts.length}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSidebarTab('audit')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Riwayat Aktivitas</span>
            </span>
          </button>
        </div>

        {/* Group 3: Infrastruktur Data */}
        <div className="space-y-1">
          <div className="px-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Infrastruktur Data
          </div>
          <button
            type="button"
            onClick={() => handleSelectSidebarTab('backup')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Download className="w-4 h-4 shrink-0" />
              <span>Cadangan JSON/CSV</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSidebarTab('supabase')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Database className="w-4 h-4 shrink-0" />
              <span>Database Supabase</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSidebarTab('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 shrink-0" />
              <span>Pengaturan Admin</span>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Sidebar Active Admin Account & Logout */}
      <div className="p-4 border-t border-slate-800/90 space-y-3 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {adminUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white text-xs truncate">{adminUser.name}</div>
            <div className="text-[11px] font-mono text-sky-400 truncate">Role: Admin</div>
          </div>
        </div>

        <button
          id="btn-admin-logout"
          type="button"
          onClick={onLogout}
          className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-900/70 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex font-sans antialiased selection:bg-sky-500/25 selection:text-sky-200">
      {/* Desktop Fixed Vertical Sidebar (256px) */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-800/90 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[82vw] h-full border-r border-slate-800">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Right Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Compact Top Contextual Header Bar (Follows SaaS Top Bar Contract) */}
        <header className="sticky top-0 z-30 h-14 bg-slate-950/95 border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Trigger + Breadcrumb Trail */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Buka navigasi konsol"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <span className="text-slate-500 font-mono hidden sm:inline whitespace-nowrap">
                Konsol Admin
              </span>
              <span className="text-slate-700 hidden sm:inline" aria-hidden="true">/</span>
              <span className="font-semibold text-white truncate">
                {ADMIN_TAB_TITLES[activeTab]}
              </span>
            </div>
          </div>

          {/* Right: Secret Link Copy + New Entry Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySecretUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              title="Salin Link Rahasia Akses Admin"
            >
              {copiedSecretUrl ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span className="hidden sm:inline">
                {copiedSecretUrl ? 'Link Rahasia Disalin' : 'Link Rahasia'}
              </span>
            </button>

            <button
              type="button"
              onClick={canManageWords ? handleOpenAddModal : undefined}
              disabled={!canManageWords}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                canManageWords
                  ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {canManageWords ? <Plus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Entri Baru</span>
            </button>
          </div>
        </header>

        {/* Notification Toast */}
        {formNotification && (
          <div className="fixed top-16 right-6 z-50 px-4 py-3 bg-slate-900 border border-sky-500/60 text-white rounded-xl shadow-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <p className="text-xs font-semibold">{formNotification}</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* MAIN CONSOLE WORKSPACE BODY                              */}
        {/* ======================================================== */}
        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ========================================== */}
          {/* TAB 1: OVERVIEW & DASHBOARD STATS          */}
          {/* ========================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Compact Operational Console Header */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 mb-1">
                    ROLE ADMIN · DASHBOARD PENGELOLAAN
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Selamat Datang, {adminUser.name}
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Kelola database kosakata Bahasa Tolaki, Moronene, Muna, dan Buton, serta tinjau usulan kosakata yang dikirimkan oleh User.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('moderation')}
                    className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-800 transition-colors flex items-center gap-2 text-xs cursor-pointer tabular-nums whitespace-nowrap"
                  >
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <span>Usulan User ({pendingContributions.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('words')}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 text-xs cursor-pointer whitespace-nowrap"
                  >
                    <Database className="w-4 h-4" />
                    <span>Kelola Kosakata</span>
                  </button>
                </div>
              </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 tabular-nums">
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kamus Terverifikasi</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-white">{allWords.length}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Tayang di Portal User
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usulan Kata User</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-white">{pendingContributions.length}</div>
                  <div className="text-xs text-amber-400 font-bold mt-1">
                    Menunggu Persetujuan Admin
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bahasa Daerah Sultra</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Globe2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-white">4 Rumpun</div>
                  <div className="text-xs text-slate-400 mt-1">Tolaki · Moronene · Muna · Buton</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peran Aktif</span>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-black text-sky-400 truncate">
                    Admin
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Akses Pengelolaan Penuh</div>
                </div>
              </div>
            </div>

            {/* Language Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'tk', name: 'Bahasa Tolaki', region: 'Konawe, Kendari, Kolaka', color: 'from-amber-600/20 to-amber-900/10 border-amber-500/30' },
                { id: 'mor', name: 'Bahasa Moronene', region: 'Bombana & Kabaena', color: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/30' },
                { id: 'mun', name: 'Bahasa Muna (Wuna)', region: 'Pulau Muna & Tiworo', color: 'from-blue-600/20 to-blue-900/10 border-blue-500/30' },
                { id: 'btn', name: 'Bahasa Buton (Wolio)', region: 'Baubau & Kesultanan Buton', color: 'from-purple-600/20 to-purple-900/10 border-purple-500/30' },
              ].map(langItem => {
                const count = allWords.filter(w => w.targetLangId === langItem.id).length;
                return (
                  <div
                    key={langItem.id}
                    onClick={() => {
                      setSelectedLangFilter(langItem.id);
                      setActiveTab('words');
                    }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${langItem.color} border p-4 cursor-pointer hover:scale-[1.02] transition-transform`}
                  >
                    <div className="text-xs font-bold text-slate-400">{langItem.region}</div>
                    <h4 className="font-extrabold text-white text-base mt-1">{langItem.name}</h4>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className="text-slate-300 font-bold">{count} Kosakata Terdaftar</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        Buka <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Contributions Preview */}
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Usulan Kosakata Komunitas Terbaru</h3>
                  <p className="text-xs text-slate-400">Kata-kata yang diajukan masyarakat penutur daerah</p>
                </div>
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  Lihat Semua ({contributedWords.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {contributedWords.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Belum ada usulan kata baru dari komunitas.
                </div>
              ) : (
                <div className="divide-y divide-slate-700/60">
                  {contributedWords.slice(0, 3).map(w => (
                    <div key={w.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{w.word}</span>
                          <span className="text-xs text-slate-400">→</span>
                          <span className="font-bold text-emerald-400 text-sm">{w.translation}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                            {getLanguageName(w.targetLangId)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Oleh: <span className="text-slate-300">{w.contributorName || 'Pengguna'}</span> • {w.createdAt || 'Baru ini'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenEditModal(w)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Tinjau & Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: KELOLA KOSAKATA (WORDS MANAGEMENT)  */}
        {/* ========================================== */}
        {activeTab === 'words' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Kelola Kosakata Kamus ({filteredWords.length} Entri)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Database kosakata bahasa daerah Sulawesi Tenggara (Tolaki, Moronene, Muna, Buton)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Ekspor ke JSON"
                >
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Unduh JSON</span>
                </button>
                <button
                  onClick={canManageWords ? handleOpenAddModal : undefined}
                  disabled={!canManageWords}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                    canManageWords
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                  title={canManageWords ? 'Tambah Kosakata' : 'Akses Ditolak: Memerlukan izin can_manage_words'}
                >
                  {canManageWords ? <Plus className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Tambah Kosakata</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Query */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari kata Indonesia / daerah..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Language Filter */}
              <div>
                <select
                  value={selectedLangFilter}
                  onChange={e => setSelectedLangFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">Semua Bahasa Daerah</option>
                  <option value="tk">Bahasa Tolaki</option>
                  <option value="mor">Bahasa Moronene</option>
                  <option value="mun">Bahasa Muna</option>
                  <option value="btn">Bahasa Buton (Wolio)</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">Semua Kategori</option>
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <select
                  value={selectedSourceFilter}
                  onChange={e => setSelectedSourceFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">Semua Sumber</option>
                  <option value="official">Entri Resmi (Master)</option>
                  <option value="community">Usulan Komunitas</option>
                </select>
              </div>
            </div>

            {/* Words Table */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Kata (Indonesia)</th>
                      <th className="px-4 py-3">Terjemahan Daerah</th>
                      <th className="px-4 py-3">Bahasa</th>
                      <th className="px-4 py-3">Fonetik</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Sumber</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredWords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          Tidak ada kosakata yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredWords.slice(0, 50).map(entry => (
                        <tr key={entry.id} className="hover:bg-slate-800/80 transition-colors">
                          <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                            {entry.word}
                            {entry.isWordOfTheDay && (
                              <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                Kata Hari Ini
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-bold text-emerald-400 whitespace-nowrap">
                            {entry.translation}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 text-[10px] font-bold">
                              {getLanguageName(entry.targetLangId)}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-400">
                            {entry.phonetic || '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.category || 'Kosakata'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {entry.isUserContributed ? (
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                                Komunitas
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                Master Resmi
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  if (!canManageWords) {
                                    setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin edit kosakata (can_manage_words).');
                                    setTimeout(() => setFormNotification(null), 3000);
                                    return;
                                  }
                                  handleOpenEditModal(entry);
                                }}
                                disabled={!canManageWords}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  canManageWords
                                    ? 'text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer'
                                    : 'text-slate-600 cursor-not-allowed opacity-40'
                                }`}
                                title={canManageWords ? 'Edit Kosakata' : 'Akses Ditolak: Memerlukan izin can_manage_words'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {confirmDeleteId === entry.id ? (
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteWord(entry.id);
                                      addAuditLog({
                                        userId: adminUser.id,
                                        userName: adminUser.name,
                                        userRole: adminUser.role,
                                        action: 'Menghapus Kosakata',
                                        target: `${entry.word} (${entry.targetLangId.toUpperCase()})`,
                                        category: 'words',
                                      });
                                      setConfirmDeleteId(null);
                                      setFormNotification(`Kosakata "${entry.word}" telah dihapus.`);
                                      setTimeout(() => setFormNotification(null), 3000);
                                    }}
                                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold cursor-pointer"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!canDeleteWords) {
                                      setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin menghapus kosakata (can_delete_words).');
                                      setTimeout(() => setFormNotification(null), 3000);
                                      return;
                                    }
                                    setConfirmDeleteId(entry.id);
                                  }}
                                  disabled={!canDeleteWords}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    canDeleteWords
                                      ? 'text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 cursor-pointer'
                                      : 'text-slate-600 cursor-not-allowed opacity-40'
                                  }`}
                                  title={canDeleteWords ? 'Hapus Kosakata' : 'Akses Ditolak: Memerlukan izin can_delete_words'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {filteredWords.length > 50 && (
                <div className="p-3 bg-slate-900/60 text-center text-xs text-slate-400 border-t border-slate-700">
                  Menampilkan 50 entri teratas dari total {filteredWords.length} kosakata. Gunakan filter pencarian untuk mempersempit hasil.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: USULAN KATA DARI USER               */}
        {/* ========================================== */}
        {activeTab === 'moderation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Usulan Kosakata dari User
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Setujui atau tolak usulan kata dari User sebelum ditampilkan di kamus utama
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-slate-800 rounded-xl border border-slate-700 text-xs font-bold shrink-0 tabular-nums">
                <button
                  type="button"
                  onClick={() => setModerationSubFilter('pending')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    moderationSubFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Menunggu Verifikasi ({pendingContributions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModerationSubFilter('approved')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    moderationSubFilter === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Telah Disetujui ({approvedContributions.length})
                </button>
              </div>
            </div>

            {(moderationSubFilter === 'pending' ? pendingContributions : approvedContributions).length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-700 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  {moderationSubFilter === 'pending'
                    ? 'Tidak Ada Antrean Usulan yang Menunggu'
                    : 'Belum Ada Riwayat Usulan Terverifikasi'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {moderationSubFilter === 'pending'
                    ? 'Seluruh usulan kosakata dari Portal User sudah ditinjau oleh Admin.'
                    : 'Usulan yang Anda setujui akan tercatat di sini dan langsung aktif di kamus publik.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(moderationSubFilter === 'pending' ? pendingContributions : approvedContributions).map(word => {
                  const isPending = word.moderationStatus === 'pending';
                  return (
                    <div
                      key={word.id}
                      className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-bold text-amber-300">
                              {getLanguageName(word.targetLangId)} · {word.category || 'Umum'}
                            </span>
                            <div className="text-lg font-black text-white mt-0.5">
                              {word.word}
                            </div>
                            <div className="text-base font-bold text-emerald-400">
                              {word.translation}
                            </div>
                          </div>

                          <div className="text-right text-[11px] text-slate-400">
                            <div>Pengusul: <span className="text-slate-200 font-bold">{word.contributorName || 'Warga Sultra'}</span></div>
                            <div className="font-mono">{word.createdAt || ''}</div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                          <div><span className="text-slate-400">Fonetik:</span> <span className="font-mono text-emerald-300">/{word.phonetic || '-'}/</span></div>
                          {word.exampleSentence && (
                            <div className="pt-1 border-t border-slate-800">
                              <p className="text-slate-200 italic mt-0.5">&ldquo;{word.exampleSentence}&rdquo;</p>
                              <p className="text-slate-400 text-[11px] mt-0.5">Arti: {word.exampleTranslation}</p>
                            </div>
                          )}
                          {word.culturalContext && (
                            <div className="pt-1 border-t border-slate-800 text-[11px]">
                              <span className="text-amber-400 font-bold">Konteks Budaya: </span>
                              <span>{word.culturalContext}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Moderation Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                        {confirmDeleteId === word.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-rose-300 font-semibold">Tolak &amp; hapus usulan ini?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteWord(word.id);
                                addAuditLog({
                                  userId: adminUser.id,
                                  userName: adminUser.name,
                                  userRole: adminUser.role,
                                  action: 'Menolak Usulan Komunitas',
                                  target: `${word.word} (${word.targetLangId.toUpperCase()})`,
                                  category: 'moderation',
                                });
                                setConfirmDeleteId(null);
                                setFormNotification(`Usulan "${word.word}" ditolak dan dihapus.`);
                                setTimeout(() => setFormNotification(null), 3000);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                            >
                              Ya, Tolak
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                if (!canModerate) {
                                  setFormNotification('Akses ditolak: Memerlukan izin moderasi (can_moderate_contributions).');
                                  setTimeout(() => setFormNotification(null), 3000);
                                  return;
                                }
                                setConfirmDeleteId(word.id);
                              }}
                              disabled={!canModerate}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                canModerate
                                  ? 'bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 cursor-pointer'
                                  : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                              }`}
                            >
                              Tolak Usulan
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!canManageWords) {
                                  setFormNotification('Akses ditolak: Memerlukan izin sunting kosakata (can_manage_words).');
                                  setTimeout(() => setFormNotification(null), 3000);
                                  return;
                                }
                                handleOpenEditModal(word);
                              }}
                              disabled={!canManageWords}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                canManageWords
                                  ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                                  : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                              }`}
                            >
                              Sunting Detail
                            </button>

                            {isPending && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!canModerate) {
                                    setFormNotification('Akses ditolak: Memerlukan izin moderasi (can_moderate_contributions).');
                                    setTimeout(() => setFormNotification(null), 3000);
                                    return;
                                  }
                                  onUpdateWord(word.id, {
                                    moderationStatus: 'approved',
                                    updatedAt: new Date().toISOString().split('T')[0],
                                  });
                                  addAuditLog({
                                    userId: adminUser.id,
                                    userName: adminUser.name,
                                    userRole: adminUser.role,
                                    action: 'Menyetujui Usulan Komunitas',
                                    target: `${word.word} (${word.targetLangId.toUpperCase()})`,
                                    category: 'moderation',
                                  });
                                  setFormNotification(`Kosakata "${word.word}" disetujui & kini tayang di Kamus Pengguna!`);
                                  setTimeout(() => setFormNotification(null), 3500);
                                }}
                                disabled={!canModerate}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs ${
                                  canModerate
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                }`}
                              >
                                {canModerate ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                                <span>Setujui ke Kamus Publik</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: MASTER BAHASA DAERAH                */}
        {/* ========================================== */}
        {activeTab === 'languages' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Rumpun & Dialek Bahasa Daerah Sulawesi Tenggara
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Informasi klasifikasi linguistik, daerah penutur asli, dan karakteristik bahasa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 'tk',
                  name: 'Bahasa Tolaki',
                  nativeName: 'Toono Tolaki / Konawe',
                  region: 'Kab. Konawe, Konawe Selatan, Konawe Utara, Kolaka, Kolaka Utara, Kolaka Timur, & Kota Kendari',
                  speakers: 'Sekitar 400.000+ Penutur Asli',
                  features: 'Menggunakan partikel kesantunan "Ito", salam "Tabea", kata kerja berawalan "mo-" (mombereorei, monganggo), kaya kosakata adat tradisi Kalosara.',
                  lexiconCount: allWords.filter(w => w.targetLangId === 'tk').length,
                  badge: 'Daratan Sultra',
                  accent: 'border-amber-500/40 bg-amber-950/20',
                },
                {
                  id: 'mor',
                  name: 'Bahasa Moronene',
                  nativeName: 'Basa Moronene',
                  region: 'Kab. Bombana (Rumbia, Poleang, Rarowatu) & Pulau Kabaena',
                  speakers: 'Sekitar 40.000+ Penutur Asli',
                  features: 'Suku tertua di Sultra. Kosakata pelafalan lembut, kata "Tontong" (lihat), "Kumaa" (makan), "Mee" (datang), kaya kosakata maritim dan pertanian.',
                  lexiconCount: allWords.filter(w => w.targetLangId === 'mor').length,
                  badge: 'Daratan & Kepulauan Bombana',
                  accent: 'border-emerald-500/40 bg-emerald-950/20',
                },
                {
                  id: 'mun',
                  name: 'Bahasa Muna (Wuna)',
                  nativeName: 'Basa Wuna',
                  region: 'Kab. Muna, Muna Barat, & Buton Tengah (Raha, Tiworo, Tongkuno, Gu)',
                  speakers: 'Sekitar 300.000+ Penutur Asli',
                  features: 'Pola intonasi khas, kata "Aitu" (ini), "Kauma" (makan), "Kainkea" (cinta/kasih), tradisi tenun Masalili dan layang-layang purba Kaghati Kolope.',
                  lexiconCount: allWords.filter(w => w.targetLangId === 'mun').length,
                  badge: 'Kepulauan Muna',
                  accent: 'border-blue-500/40 bg-blue-950/20',
                },
                {
                  id: 'btn',
                  name: 'Bahasa Buton (Wolio)',
                  nativeName: 'Basa Wolio',
                  region: 'Kota Baubau, Buton, Buton Selatan, Buton Utara, Wakatobi',
                  speakers: 'Sekitar 150.000+ Penutur Asli',
                  features: 'Bahasa resmi Kesultanan Buton masa lampau dengan aksara Buri Wolio (huruf Arab gundul). Salam "Tabea", "Manga" (makan), "Poaka" (sayang).',
                  lexiconCount: allWords.filter(w => w.targetLangId === 'btn').length,
                  badge: 'Kepulauan Buton & Baubau',
                  accent: 'border-purple-500/40 bg-purple-950/20',
                },
              ].map(lang => (
                <div
                  key={lang.id}
                  className={`p-6 rounded-3xl border ${lang.accent} space-y-4 shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {lang.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {lang.lexiconCount} Kosakata Aktif
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{lang.name}</h3>
                    <p className="text-xs text-slate-400">{lang.nativeName}</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400 font-bold">Wilayah Sebaran: </span>
                      <span>{lang.region}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Estimasi Penutur: </span>
                      <span>{lang.speakers}</span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                      <span className="text-amber-400 font-bold">Ciri Khas Linguistik: </span>
                      {lang.features}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLangFilter(lang.id);
                      setActiveTab('words');
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Lihat Daftar Kosakata {lang.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: EKSPOR & CADANGAN DATA              */}
        {/* ========================================== */}
        {activeTab === 'backup' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Ekspor & Cadangan Data Kamus (Backup & Sync)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Unduh salinan data kamus untuk kebutuhan pengarsipan akademik, analisis leksikografi, atau backup data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* JSON Export Card */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ekspor Format JSON</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Format objek data lengkap beserta contoh kalimat, fonetik, konteks budaya, dan metadata kontributor. Cocok untuk integrasi API dan developer.
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  Total Entri: <span className="font-bold text-white">{allWords.length} entri</span>
                </div>
                <button
                  onClick={handleExportJson}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh leksika_kamus_sultra.json</span>
                </button>
              </div>

              {/* CSV Export Card */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ekspor Format CSV (Excel)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Format tabel data terpisah koma yang dapat langsung dibuka di Microsoft Excel, Google Sheets, atau software statistik penelitian.
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  Total Baris: <span className="font-bold text-white">{allWords.length} baris</span>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh leksika_kamus_sultra.csv</span>
                </button>
              </div>
            </div>

            {/* Sync & Integrity Status */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Integritas Basis Data & Sinkronisasi Mesin AI</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seluruh kosakata dalam master data secara otomatis terhubung langsung ke mesin penerjemah N-gram offline, pencarian kamus cepat, dan materi kuis pembelajaran. Perubahan yang dilakukan admin akan langsung tercermin secara instan di sisi pengguna.
              </p>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: PENGATURAN AKUN ADMIN               */}
        {/* ========================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Pengaturan Akun & Keamanan Admin
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Kelola nama tampilan dan ubah kata sandi akses administrator
              </p>
            </div>

            {settingsMessage && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-bold ${
                  settingsMessage.type === 'success'
                    ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-200'
                    : 'bg-rose-900/60 border border-rose-500 text-rose-200'
                }`}
              >
                {settingsMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{settingsMessage.text}</span>
              </div>
            )}

            {/* Secret Admin Link Info Box */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Key className="w-4 h-4" />
                  <span>Link Rahasia Akses Admin (Tersembunyi dari User)</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySecretUrl}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {copiedSecretUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSecretUrl ? 'Tersalin' : 'Salin URL'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 break-all">
                {getSecretAdminUrl()}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simpan URL di atas secara pribadi. Pengunjung yang mengetik rute umum seperti <code className="text-slate-200 font-mono">/admin</code> atau membuka beranda utama akan otomatis diarahkan ke tampilan Kamus User biasa. Anda juga dapat mengganti kode unik URL melalui variabel <code className="text-slate-200 font-mono">VITE_ADMIN_SECRET_PATH</code> saat deployment.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nama Tampilan Admin
                </label>
                <input
                  type="text"
                  value={adminDisplayName}
                  onChange={e => setAdminDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Administrator
                </label>
                <input
                  type="email"
                  value={adminUser.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Email akun super admin baku.</span>
              </div>

              <div className="pt-3 border-t border-slate-700/60">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  Ganti Kata Sandi (Opsional)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Masukkan kata sandi baru jika ingin diubah..."
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru..."
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Pengaturan</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 7: MANAJEMEN AKUN ADMIN                */}
        {/* ========================================== */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in duration-200">
            <AdminUsersTab
              currentAdmin={adminUser}
              onNotification={msg => {
                setFormNotification(msg);
                setTimeout(() => setFormNotification(null), 3500);
              }}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 8: CATATAN AUDIT SISTEM (AUDIT LOGS)   */}
        {/* ========================================== */}
        {activeTab === 'audit' && (
          <div className="animate-in fade-in duration-200">
            <AdminAuditLogTab
              currentAdmin={adminUser}
              onNotification={msg => {
                setFormNotification(msg);
                setTimeout(() => setFormNotification(null), 3500);
              }}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 9: DATABASE SUPABASE CLOUD             */}
        {/* ========================================== */}
        {activeTab === 'supabase' && (
          <div className="animate-in fade-in duration-200">
            <AdminSupabaseTab
              words={allWords}
              canManageBackup={canExport}
              adminName={adminUser.name}
              onWordsUpdated={onWordsUpdated}
            />
          </div>
        )}
        </main>

        {/* Minimal Console Footer inside Right Workspace Column */}
        <footer className="py-4 px-6 border-t border-slate-800/80 text-xs text-slate-500 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <span>Leksika Console · Sistem Back-Office Kurator Bahasa Daerah Sultra</span>
          <span>Sesi: {adminUser.role}</span>
        </footer>
      </div>

      {/* ======================================================== */}
      {/* WORD ADD/EDIT MODAL                                      */}
      {/* ======================================================== */}
      {isWordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  {editingWord ? 'Edit Kosakata Kamus' : 'Tambah Kosakata Resmi Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsWordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveWordForm} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Kata Bahasa Indonesia *
                  </label>
                  <input
                    type="text"
                    value={formWord}
                    onChange={e => setFormWord(e.target.value)}
                    placeholder="Contoh: Selamat Datang, Makan, Cinta..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Bahasa Daerah Tujuan *
                  </label>
                  <select
                    value={formTargetLangId}
                    onChange={e => setFormTargetLangId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="tk">Bahasa Tolaki</option>
                    <option value="mor">Bahasa Moronene</option>
                    <option value="mun">Bahasa Muna (Wuna)</option>
                    <option value="btn">Bahasa Buton (Wolio)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Terjemahan Bahasa Daerah *
                  </label>
                  <input
                    type="text"
                    value={formTranslation}
                    onChange={e => setFormTranslation(e.target.value)}
                    placeholder="Contoh: Tabea, Monga'a, Poaka..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Pelafalan Fonetis (Cara Membaca)
                  </label>
                  <input
                    type="text"
                    value={formPhonetic}
                    onChange={e => setFormPhonetic(e.target.value)}
                    placeholder="Contoh: mo-nga-a, ta-be-a..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Kategori Kata
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="Kata Kerja, Salam, Makanan, Budaya..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={e => setFormIsPopular(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Kata Populer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={formIsWordOfTheDay}
                      onChange={e => setFormIsWordOfTheDay(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Kata Hari Ini</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Contoh Kalimat Penggunaan Daerah
                </label>
                <input
                  type="text"
                  value={formExampleSentence}
                  onChange={e => setFormExampleSentence(e.target.value)}
                  placeholder="Contoh: Tabea, maiito monganggo ronga-ronga..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Arti Terjemahan Kalimat (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  value={formExampleTranslation}
                  onChange={e => setFormExampleTranslation(e.target.value)}
                  placeholder="Contoh: Permisi/Salam, mari kita makan bersama-sama..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Konteks Budaya & Catatan Bahasa Daerah
                </label>
                <textarea
                  rows={2}
                  value={formCulturalContext}
                  onChange={e => setFormCulturalContext(e.target.value)}
                  placeholder="Nilai kearifan lokal, etiket kesantunan, atau tradisi suku..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWordModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingWord ? 'Simpan Pembaruan' : 'Tambahkan Kosakata'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
