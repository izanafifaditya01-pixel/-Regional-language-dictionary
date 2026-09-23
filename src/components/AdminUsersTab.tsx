import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Key,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Info,
  UserCheck
} from 'lucide-react';
import { AdminUser, AdminRole, PermissionKey } from '../types';
import {
  StoredAdminAccount,
  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getRolePermissionsMap,
  saveRolePermissionsMap,
  ROLE_DEFINITIONS,
  PERMISSION_ITEMS,
  hasPermission,
} from '../utils/adminAuth';

interface AdminUsersTabProps {
  currentAdmin: AdminUser;
  onSwitchActiveAdmin: (userId: string) => void;
  onNotification: (msg: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  currentAdmin,
  onSwitchActiveAdmin,
  onNotification,
}) => {
  const [subTab, setSubTab] = useState<'accounts' | 'rbac-matrix'>('accounts');
  const [usersList, setUsersList] = useState<StoredAdminAccount[]>(() => getAdminUsers());
  const [rolePermissions, setRolePermissions] = useState<Record<AdminRole, PermissionKey[]>>(() =>
    getRolePermissionsMap()
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Modal State for Add / Edit User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StoredAdminAccount | null>(null);

  // Form Fields
  const [formUsername, setFormUsername] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('Linguist Editor');
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState<StoredAdminAccount | null>(null);

  const canManageUsers = hasPermission(currentAdmin, 'can_manage_users');
  const canEditPermissions = hasPermission(currentAdmin, 'can_edit_permissions');

  const refreshUsers = () => {
    setUsersList(getAdminUsers());
  };

  // Filtered Users
  const filteredUsers = usersList.filter(user => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterRole !== 'all' && user.role !== filterRole) {
      return false;
    }
    return true;
  });

  // Open Create User Modal
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('Linguist Editor');
    setFormStatus('active');
    setFormError(null);
    setIsUserModalOpen(true);
  };

  // Open Edit User Modal
  const handleOpenEditModal = (user: StoredAdminAccount) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword(user.passwordHash || '');
    setFormRole(user.role);
    setFormStatus(user.status || 'active');
    setFormError(null);
    setIsUserModalOpen(true);
  };

  // Submit User Form
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formName.trim() || !formEmail.trim()) {
      setFormError('Nama, username, dan email wajib diisi.');
      return;
    }

    if (!editingUser && !formPassword.trim()) {
      setFormError('Kata sandi wajib diisi untuk akun baru.');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        updateAdminUser(editingUser.id, {
          username: formUsername.trim().toLowerCase(),
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          status: formStatus,
          ...(formPassword.trim() ? { passwordHash: formPassword.trim() } : {}),
        });
        onNotification(`Akun ${formName} berhasil diperbarui!`);
      } else {
        // Check duplicate username
        const duplicate = usersList.some(
          u => u.username.toLowerCase() === formUsername.trim().toLowerCase()
        );
        if (duplicate) {
          setFormError(`Username "${formUsername}" sudah digunakan oleh akun lain.`);
          return;
        }

        // Add new user
        addAdminUser({
          username: formUsername.trim().toLowerCase(),
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          status: formStatus,
          passwordHash: formPassword.trim(),
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        });
        onNotification(`Akun baru ${formName} (${formRole}) berhasil dibuat!`);
      }

      refreshUsers();
      setIsUserModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan akun.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    try {
      deleteAdminUser(userToDelete.id);
      onNotification(`Akun ${userToDelete.name} berhasil dihapus.`);
      setUserToDelete(null);
      refreshUsers();
    } catch (err: any) {
      onNotification(err.message || 'Gagal menghapus pengguna.');
    }
  };

  // Toggle single permission in RBAC matrix
  const handleTogglePermission = (role: AdminRole, permKey: PermissionKey) => {
    if (!canEditPermissions) {
      onNotification('Hanya Super Administrator yang diizinkan memodifikasi matriks izin role.');
      return;
    }
    if (role === 'Super Administrator') {
      onNotification('Super Administrator memiliki semua izin secara mutlak dan tidak dapat dikurangi.');
      return;
    }

    setRolePermissions(prev => {
      const currentList = prev[role] || [];
      const hasPerm = currentList.includes(permKey);
      const updatedList = hasPerm
        ? currentList.filter(k => k !== permKey)
        : [...currentList, permKey];

      const newMap = { ...prev, [role]: updatedList };
      saveRolePermissionsMap(newMap);
      return newMap;
    });

    onNotification(`Hak akses role ${role} diperbarui.`);
  };

  // Reset to factory permissions
  const handleResetToDefaults = () => {
    if (!canEditPermissions) return;
    const defaults: Record<AdminRole, PermissionKey[]> = {
      'Super Administrator': [...ROLE_DEFINITIONS['Super Administrator'].defaultPermissions],
      'Linguist Editor': [...ROLE_DEFINITIONS['Linguist Editor'].defaultPermissions],
      'Moderator': [...ROLE_DEFINITIONS['Moderator'].defaultPermissions],
      'Viewer': [...ROLE_DEFINITIONS['Viewer'].defaultPermissions],
    };
    setRolePermissions(defaults);
    saveRolePermissionsMap(defaults);
    onNotification('Matriks hak akses (RBAC) berhasil dikembalikan ke standar awal sistem.');
  };

  // Role Badge Helper
  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'Super Administrator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Super Administrator</span>
          </span>
        );
      case 'Linguist Editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Linguist Editor</span>
          </span>
        );
      case 'Moderator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Moderator</span>
          </span>
        );
      case 'Viewer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Viewer (Read-Only)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Subtab Navigation */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md">
                Sistem Keamanan & Otorisasi
              </span>
              <span className="text-xs text-slate-400">• Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <span>Manajemen Pengguna & Hak Akses (Role)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Kontrol penuh atas siapa yang dapat mengelola kamus, memoderasi kata komunitas, mengekspor data,
              dan mengatur konfigurasi otorisasi platform.
            </p>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setSubTab('accounts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                subTab === 'accounts'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Akun Admin ({usersList.length})</span>
            </button>

            <button
              onClick={() => setSubTab('rbac-matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                subTab === 'rbac-matrix'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Matriks Hak Akses (RBAC)</span>
            </button>
          </div>
        </div>

        {/* Access Warning if non-superadmin */}
        {!canManageUsers && (
          <div className="mt-4 p-3.5 bg-amber-950/50 border border-amber-800/80 rounded-2xl flex items-center gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong>Mode Peninjau (Akses Terbatas):</strong> Akun Anda dengan role{' '}
              <span className="underline font-bold">{currentAdmin.role}</span> hanya memiliki hak melihat daftar akun.
              Hanya <strong>Super Administrator</strong> yang dapat membuat akun, mengubah role, atau mengatur matriks izin.
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: DAFTAR AKUN PENGGUNA ADMIN                    */}
      {/* ======================================================== */}
      {subTab === 'accounts' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Role Filter, and Add User Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, username, atau email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Semua Role</option>
                <option value="Super Administrator">Super Administrator</option>
                <option value="Linguist Editor">Linguist Editor</option>
                <option value="Moderator">Moderator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            {canManageUsers && (
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Akun Baru</span>
              </button>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-black tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Pengguna / Nama</th>
                    <th className="py-3.5 px-4">Username & Email</th>
                    <th className="py-3.5 px-4">Role & Hak Akses</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Login Terakhir</th>
                    <th className="py-3.5 px-4 text-right">Aksi & Simulasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Tidak ada akun admin yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      const isCurrent = user.id === currentAdmin.id;
                      const isSuspended = user.status === 'suspended';

                      return (
                        <tr
                          key={user.id}
                          className={`hover:bg-slate-800/50 transition-colors ${
                            isCurrent ? 'bg-purple-950/20' : ''
                          }`}
                        >
                          {/* Name & Avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isCurrent && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono">ID: {user.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* Username & Email */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-purple-300 font-semibold text-xs">
                              @{user.username}
                            </div>
                            <div className="text-[11px] text-slate-400">{user.email}</div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {isSuspended ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                                <Lock className="w-3 h-3" />
                                <span>Dinonaktifkan</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                <Unlock className="w-3 h-3" />
                                <span>Aktif</span>
                              </span>
                            )}
                          </td>

                          {/* Last Login */}
                          <td className="py-3.5 px-4 text-xs text-slate-400">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString('id-ID') : 'Belum pernah'}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Switch / Impersonate */}
                              <button
                                onClick={() => onSwitchActiveAdmin(user.id)}
                                disabled={isCurrent}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                  isCurrent
                                    ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-default'
                                    : 'bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-purple-200 border border-slate-700'
                                }`}
                                title="Beralih ke sesi akun ini untuk menguji hak akses"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">{isCurrent ? 'Sesi Aktif' : 'Uji Role'}</span>
                              </button>

                              {/* Edit Button */}
                              {canManageUsers && (
                                <button
                                  onClick={() => handleOpenEditModal(user)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                                  title="Edit role, nama, email, atau status"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Button */}
                              {canManageUsers && (
                                <button
                                  onClick={() => setUserToDelete(user)}
                                  disabled={isCurrent}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isCurrent
                                      ? 'bg-slate-800/30 text-slate-600 border border-slate-800 cursor-not-allowed'
                                      : 'bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 border border-rose-800/60 cursor-pointer'
                                  }`}
                                  title={isCurrent ? 'Tidak dapat menghapus akun yang sedang aktif' : 'Hapus akun'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: MATRIKS HAK AKSES ROLE (RBAC MATRIX)          */}
      {/* ======================================================== */}
      {subTab === 'rbac-matrix' && (
        <div className="space-y-4">
          {/* Information & Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                Centang atau hapus centang untuk mengaktifkan/menonaktifkan wewenang setiap role.
                Perubahan tersimpan secara instan di sistem.
              </span>
            </div>

            {canEditPermissions && (
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer shrink-0"
                title="Kembalikan semua izin ke standar pabrik"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Standar Default</span>
              </button>
            )}
          </div>

          {/* Interactive RBAC Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-black tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-1/3">Wewenang / Fitur Sistem</th>
                    <th className="py-3.5 px-3 text-center bg-purple-950/30 border-x border-slate-800 text-purple-300">
                      👑 Super Admin
                    </th>
                    <th className="py-3.5 px-3 text-center bg-emerald-950/20 border-r border-slate-800 text-emerald-300">
                      📖 Linguist Editor
                    </th>
                    <th className="py-3.5 px-3 text-center bg-blue-950/20 border-r border-slate-800 text-blue-300">
                      🛡️ Moderator
                    </th>
                    <th className="py-3.5 px-3 text-center bg-slate-950/40 text-slate-300">
                      👁️ Viewer
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {PERMISSION_ITEMS.map(item => {
                    const superHas = true; // Super Admin always has full access
                    const editorHas = (rolePermissions['Linguist Editor'] || []).includes(item.key);
                    const modHas = (rolePermissions['Moderator'] || []).includes(item.key);
                    const viewerHas = (rolePermissions['Viewer'] || []).includes(item.key);

                    return (
                      <tr key={item.key} className="hover:bg-slate-800/40 transition-colors">
                        {/* Permission Description */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-400 uppercase">
                              {item.group}
                            </span>
                            <span className="font-bold text-white text-xs sm:text-sm">{item.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                          <code className="text-[10px] text-purple-300 font-mono">{item.key}</code>
                        </td>

                        {/* Super Admin (Always Checked) */}
                        <td className="py-3 px-3 text-center bg-purple-950/15 border-x border-slate-800">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 rounded-md bg-purple-600/30 border border-purple-500 text-purple-300 flex items-center justify-center shadow-inner">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        </td>

                        {/* Linguist Editor Toggle */}
                        <td className="py-3 px-3 text-center bg-emerald-950/10 border-r border-slate-800">
                          <button
                            onClick={() => handleTogglePermission('Linguist Editor', item.key)}
                            disabled={!canEditPermissions}
                            className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              editorHas
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-800 border border-slate-700 text-slate-500 hover:border-slate-600'
                            } ${!canEditPermissions ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={editorHas ? 'Klik untuk mencabut izin' : 'Klik untuk memberikan izin'}
                          >
                            {editorHas ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Moderator Toggle */}
                        <td className="py-3 px-3 text-center bg-blue-950/10 border-r border-slate-800">
                          <button
                            onClick={() => handleTogglePermission('Moderator', item.key)}
                            disabled={!canEditPermissions}
                            className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              modHas
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-800 border border-slate-700 text-slate-500 hover:border-slate-600'
                            } ${!canEditPermissions ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={modHas ? 'Klik untuk mencabut izin' : 'Klik untuk memberikan izin'}
                          >
                            {modHas ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Viewer Toggle */}
                        <td className="py-3 px-3 text-center bg-slate-950/20">
                          <button
                            onClick={() => handleTogglePermission('Viewer', item.key)}
                            disabled={!canEditPermissions}
                            className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              viewerHas
                                ? 'bg-slate-600 text-white shadow-xs'
                                : 'bg-slate-800 border border-slate-700 text-slate-500 hover:border-slate-600'
                            } ${!canEditPermissions ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={viewerHas ? 'Klik untuk mencabut izin' : 'Klik untuk memberikan izin'}
                          >
                            {viewerHas ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT PENGGUNA                            */}
      {/* ======================================================== */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <span>{editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Admin Baru'}</span>
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Contoh: Dr. La Ode M.Hum"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Username *</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="misal: laode_editor"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Resmi *</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="nama@leksika.id"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Peran (Role) *</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as AdminRole)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Super Administrator">👑 Super Administrator</option>
                    <option value="Linguist Editor">📖 Linguist Editor</option>
                    <option value="Moderator">🛡️ Moderator</option>
                    <option value="Viewer">👁️ Viewer (Read-Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Status Akun</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">🟢 Aktif</option>
                    <option value="suspended">🔴 Dinonaktifkan (Suspended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {editingUser ? 'Ubah Kata Sandi (Kosongkan jika tidak ingin ganti)' : 'Kata Sandi Awal *'}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  placeholder={editingUser ? 'Biarkan kosong untuk password tetap' : 'Minimal 6 karakter'}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: KONFIRMASI HAPUS AKUN                             */}
      {/* ======================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/80 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong> (@{userToDelete.username})?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
