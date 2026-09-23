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
  Link2
} from 'lucide-react';
import { WordEntry, Language, AdminUser, AdminTab, AdminRole } from '../types';
import { LANGUAGES_DATA } from '../data/languagesData';
import {
  hasPermission,
  getAdminUsers,
  switchActiveAdminUser,
  addAuditLog,
  getAuditLogs,
  updateAdminUser,
} from '../utils/adminAuth';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminAuditLogTab } from './AdminAuditLogTab';

interface AdminDashboardViewProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onSwitchToUserView: () => void;
  allWords: WordEntry[];
  contributedWords: WordEntry[];
  onAddWord: (wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>, contributorName: string) => void;
  onUpdateWord: (wordId: string, updatedFields: Partial<WordEntry>) => void;
  onDeleteWord: (wordId: string) => void;
  onOpenLinksModal?: () => void;
  onSwitchAdminUser?: (newAdmin: AdminUser) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  onLogout,
  onSwitchToUserView,
  allWords,
  contributedWords,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
  onOpenLinksModal,
  onSwitchAdminUser,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

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

  // RBAC Permissions resolution for current admin user
  const canManageWords = hasPermission(adminUser, 'can_manage_words');
  const canDeleteWords = hasPermission(adminUser, 'can_delete_words');
  const canModerate = hasPermission(adminUser, 'can_moderate_contributions');
  const canManageLanguages = hasPermission(adminUser, 'can_manage_languages');
  const canExport = hasPermission(adminUser, 'can_export_backup');
  const canRestore = hasPermission(adminUser, 'can_import_restore');
  const canManageUsers = hasPermission(adminUser, 'can_manage_users');
  const canViewAudit = hasPermission(adminUser, 'can_view_audit_logs');
  const canEditPermissions = hasPermission(adminUser, 'can_edit_permissions');
  const canSystemSettings = hasPermission(adminUser, 'can_system_settings');

  // Multi-account and Live Role Switching helper
  const allAdminAccounts = getAdminUsers();
  const handleSwitchAdmin = (userId: string) => {
    const target = switchActiveAdminUser(userId);
    if (target && onSwitchAdminUser) {
      onSwitchAdminUser(target);
      setFormNotification(`Beralih ke akun: ${target.name} (${target.role})`);
      setTimeout(() => setFormNotification(null), 3500);
    }
  };

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
      alert('Kata Bahasa Indonesia dan Terjemahan Daerah wajib diisi.');
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* ======================================================== */}
      {/* TOP ADMIN HEADER BAR                                     */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Admin Brand Logo & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    Portal Admin Leksika
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                    Administrator
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Pusat Kelola Kosakata & Preservasi Bahasa Sulawesi Tenggara
                </p>
              </div>
            </div>

            {/* Quick Actions (Role Switcher, User Mode & Logout) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Quick Persona / Role Switcher for RBAC verification */}
              <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="text-slate-400 font-medium">Uji Role:</span>
                <select
                  value={adminUser.id}
                  onChange={e => handleSwitchAdmin(e.target.value)}
                  className="bg-transparent text-white font-bold border-none focus:outline-none cursor-pointer text-xs"
                  title="Ganti akun / role langsung untuk menguji RBAC"
                >
                  {allAdminAccounts.map(acc => (
                    <option key={acc.id} value={acc.id} className="bg-slate-900 text-white">
                      {acc.role === 'Super Administrator' ? '👑' : acc.role === 'Linguist Editor' ? '📖' : acc.role === 'Moderator' ? '🛡️' : '👁️'} {acc.name} ({acc.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* User Profile Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <img
                  src={adminUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={adminUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-600"
                />
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-white text-[11px] leading-tight truncate max-w-[110px]">{adminUser.name}</div>
                  <div className="text-[10px] text-purple-300 font-semibold">{adminUser.role}</div>
                </div>
              </div>

              {/* Direct Links Modal */}
              {onOpenLinksModal && (
                <button
                  onClick={onOpenLinksModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer shadow-xs"
                  title="Lihat & Salin Daftar Tautan Halaman"
                >
                  <Link2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden xl:inline">Tautan Halaman</span>
                </button>
              )}

              {/* Switch to Public User Mode */}
              <button
                id="btn-switch-user-mode"
                onClick={onSwitchToUserView}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 transition-all cursor-pointer shadow-xs"
                title="Buka tampilan pengguna tanpa logout"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">User View</span>
              </button>

              {/* Admin Profile & Logout Button */}
              <button
                id="btn-admin-logout"
                onClick={onLogout}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 hover:text-rose-100 border border-rose-800/60 transition-all cursor-pointer shadow-xs"
                title="Keluar dari sesi admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan</span>
            </button>

            <button
              onClick={() => setActiveTab('words')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'words'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kelola Kosakata ({allWords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Moderasi Komunitas</span>
              {contributedWords.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-amber-500 text-slate-950 font-black rounded-full">
                  {contributedWords.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('languages')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'languages'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Bahasa Daerah Sultra</span>
            </button>

            {/* TAB: Users & Role Access Control (RBAC) */}
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Pengguna & RBAC</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                {allAdminAccounts.length}
              </span>
            </button>

            {/* TAB: Audit Logs */}
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Catatan Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Ekspor & Cadangan Data</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Admin</span>
            </button>
          </div>
        </div>

        {/* Active Role Simulator & Permissions Banner (if not Super Admin) */}
        {adminUser.role !== 'Super Administrator' && (
          <div className="bg-purple-950/60 border-b border-purple-800/60 px-4 py-2">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  <strong>Simulasi Role Aktif: {adminUser.role}</strong> — Sebagian aksi sistem dibatasi sesuai kebijakan izin RBAC.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-purple-300">Ganti Akun/Role Uji:</span>
                <select
                  value={adminUser.id}
                  onChange={e => handleSwitchAdmin(e.target.value)}
                  className="bg-purple-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-purple-700 focus:outline-none cursor-pointer"
                >
                  {allAdminAccounts.map(acc => (
                    <option key={acc.id} value={acc.id} className="bg-slate-900 text-white">
                      {acc.name} ({acc.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Notification Toast */}
      {formNotification && (
        <div className="fixed top-24 right-6 z-50 p-4 bg-emerald-800 border border-emerald-500 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <p className="text-sm font-bold">{formNotification}</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN ADMIN CONTENT BODY                                  */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================== */}
        {/* TAB 1: OVERVIEW & DASHBOARD STATS          */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-800/80 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sesi Admin Terotentikasi</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Selamat Datang, {adminUser.name}
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Kelola kamus leksikon Sulawesi Tenggara (Bahasa Tolaki, Moronene, Muna, Buton/Wolio), pantau usulan kosakata masyarakat, dan verifikasi entri resmi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kosakata Resmi</span>
                </button>
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                  <span>Review Usulan ({contributedWords.length})</span>
                </button>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kosakata</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-white">{allWords.length}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">100% Aktif</span> di mesin penerjemah
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usulan Komunitas</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-white">{contributedWords.length}</div>
                  <div className="text-xs text-amber-400 font-bold mt-1">
                    Membutuhkan verifikasi admin
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
                  <div className="text-3xl font-black text-white">4 Dialek</div>
                  <div className="text-xs text-slate-400 mt-1">Tolaki • Moronene • Muna • Buton</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Mesin AI</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xl font-black text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif & Tersinkron
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Leksikon + Hybrid Fallback</div>
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
                              <button
                                onClick={() => {
                                  if (!canDeleteWords) {
                                    setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin menghapus kosakata (can_delete_words).');
                                    setTimeout(() => setFormNotification(null), 3000);
                                    return;
                                  }
                                  if (confirm(`Hapus kosakata "${entry.word} - ${entry.translation}"?`)) {
                                    onDeleteWord(entry.id);
                                    addAuditLog({
                                      userId: adminUser.id,
                                      userName: adminUser.name,
                                      userRole: adminUser.role,
                                      action: 'Menghapus Kosakata',
                                      target: `${entry.word} (${entry.targetLangId.toUpperCase()})`,
                                      category: 'words',
                                    });
                                    setFormNotification(`Kosakata "${entry.word}" telah dihapus.`);
                                    setTimeout(() => setFormNotification(null), 3000);
                                  }
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
        {/* TAB 3: MODERASI KOMUNITAS                  */}
        {/* ========================================== */}
        {activeTab === 'moderation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Moderasi Usulan Kosakata Komunitas
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Tinjau, setujui, edit, atau tolak kosakata yang diajukan oleh pengguna masyarakat daerah Sultra
              </p>
            </div>

            {contributedWords.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-700 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Semua Usulan Sudah Ditinjau</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Belum ada kosakata baru yang diajukan dari fitur kontribusi pengguna.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributedWords.map(word => (
                  <div
                    key={word.id}
                    className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {getLanguageName(word.targetLangId)}
                        </span>
                        <div className="text-lg font-black text-white mt-1">
                          {word.word}
                        </div>
                        <div className="text-base font-bold text-emerald-400">
                          {word.translation}
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        <div>Oleh: <span className="text-slate-200 font-bold">{word.contributorName || 'Warga Sultra'}</span></div>
                        <div>{word.createdAt || 'Tanggal tidak tercatat'}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                      <div><span className="text-slate-400">Pelafalan Fonetis:</span> <span className="font-mono text-emerald-300">{word.phonetic || '-'}</span></div>
                      <div><span className="text-slate-400">Kategori:</span> {word.category || 'Umum'}</div>
                      {word.exampleSentence && (
                        <div className="pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Contoh Kalimat:</span>
                          <p className="text-slate-200 italic mt-0.5">"{word.exampleSentence}"</p>
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

                    {/* Moderation Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => {
                          if (!canModerate) {
                            setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin moderasi usulan (can_moderate_contributions).');
                            setTimeout(() => setFormNotification(null), 3000);
                            return;
                          }
                          if (confirm(`Tolak dan hapus usulan kosakata "${word.word}"?`)) {
                            onDeleteWord(word.id);
                            addAuditLog({
                              userId: adminUser.id,
                              userName: adminUser.name,
                              userRole: adminUser.role,
                              action: 'Menolak Usulan Komunitas',
                              target: `${word.word} (${word.targetLangId.toUpperCase()})`,
                              category: 'moderation',
                            });
                            setFormNotification(`Usulan "${word.word}" berhasil dihapus.`);
                            setTimeout(() => setFormNotification(null), 3000);
                          }
                        }}
                        disabled={!canModerate}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          canModerate
                            ? 'bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 cursor-pointer'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                        }`}
                        title={canModerate ? 'Tolak & Hapus' : 'Akses Ditolak: Memerlukan izin can_moderate_contributions'}
                      >
                        Tolak & Hapus
                      </button>

                      <button
                        onClick={() => {
                          if (!canManageWords) {
                            setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin edit kosakata.');
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
                        title={canManageWords ? 'Edit Detail' : 'Akses Ditolak: Memerlukan izin can_manage_words'}
                      >
                        Edit Detail
                      </button>

                      <button
                        onClick={() => {
                          if (!canModerate) {
                            setFormNotification('Akses ditolak: Akun Anda tidak memiliki izin moderasi usulan (can_moderate_contributions).');
                            setTimeout(() => setFormNotification(null), 3000);
                            return;
                          }
                          onUpdateWord(word.id, {
                            isUserContributed: false,
                            updatedAt: new Date().toISOString().split('T')[0]
                          });
                          addAuditLog({
                            userId: adminUser.id,
                            userName: adminUser.name,
                            userRole: adminUser.role,
                            action: 'Menyetujui Usulan Komunitas',
                            target: `${word.word} (${word.targetLangId.toUpperCase()})`,
                            category: 'moderation',
                          });
                          setFormNotification(`Kosakata "${word.word}" resmi disetujui & dipublikasikan!`);
                          setTimeout(() => setFormNotification(null), 3500);
                        }}
                        disabled={!canModerate}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs ${
                          canModerate
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        }`}
                        title={canModerate ? 'Setujui & Publikasikan' : 'Akses Ditolak: Memerlukan izin can_moderate_contributions'}
                      >
                        {canModerate ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                        <span>Setujui Resmi</span>
                      </button>
                    </div>
                  </div>
                ))}
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
        {/* TAB 7: MANAJEMEN PENGGUNA & RBAC           */}
        {/* ========================================== */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in duration-200">
            <AdminUsersTab
              currentAdmin={adminUser}
              onSwitchActiveAdmin={handleSwitchAdmin}
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
      </main>

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

      {/* Admin Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          Leksika Nusantara Admin Console • Akses Terbatas Khusus Administrator Database
        </div>
      </footer>
    </div>
  );
};
