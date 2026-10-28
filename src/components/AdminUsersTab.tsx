import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { AdminUser } from '../types';
import {
  StoredAdminAccount,
  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../utils/adminAuth';

interface AdminUsersTabProps {
  currentAdmin: AdminUser;
  onNotification: (msg: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  currentAdmin,
  onNotification,
}) => {
  const [usersList, setUsersList] = useState<StoredAdminAccount[]>(() => getAdminUsers());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit Admin Account
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StoredAdminAccount | null>(null);

  // Form Fields
  const [formUsername, setFormUsername] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState<StoredAdminAccount | null>(null);

  const refreshUsers = () => {
    setUsersList(getAdminUsers());
  };

  const filteredUsers = usersList.filter(user => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormStatus('active');
    setFormError(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: StoredAdminAccount) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword(user.passwordHash || '');
    setFormStatus(user.status || 'active');
    setFormError(null);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formName.trim() || !formEmail.trim()) {
      setFormError('Nama, username, dan email wajib diisi.');
      return;
    }

    if (!editingUser && !formPassword.trim()) {
      setFormError('Kata sandi wajib diisi untuk akun Admin baru.');
      return;
    }

    try {
      if (editingUser) {
        updateAdminUser(editingUser.id, {
          username: formUsername.trim().toLowerCase(),
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          role: 'Admin',
          status: formStatus,
          ...(formPassword.trim() ? { passwordHash: formPassword.trim() } : {}),
        });
        onNotification(`Akun Admin ${formName} berhasil diperbarui.`);
      } else {
        const duplicate = usersList.some(
          u => u.username.toLowerCase() === formUsername.trim().toLowerCase()
        );
        if (duplicate) {
          setFormError(`Username "${formUsername}" sudah terdaftar.`);
          return;
        }

        addAdminUser({
          username: formUsername.trim().toLowerCase(),
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          status: formStatus,
          passwordHash: formPassword.trim(),
        });
        onNotification(`Akun Admin baru ${formName} berhasil dibuat.`);
      }

      refreshUsers();
      setIsUserModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan akun Admin.');
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    try {
      deleteAdminUser(userToDelete.id);
      onNotification(`Akun Admin ${userToDelete.name} berhasil dihapus.`);
      setUserToDelete(null);
      refreshUsers();
    } catch (err: any) {
      onNotification(err.message || 'Gagal menghapus akun Admin.');
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            <span>Manajemen Akun Admin</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Kelola akun pengelola yang memiliki akses ke Konsol Admin. Sistem ini hanya memiliki 2 peran: <strong>Admin</strong> (pengelola kamus) dan <strong>User</strong> (pengguna publik).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Admin</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari akun Admin berdasarkan nama, username, atau email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Admin Accounts Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200 tabular-nums">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Nama Admin</th>
                <th className="py-3.5 px-4">Username &amp; Email</th>
                <th className="py-3.5 px-4">Peran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Login Terakhir</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Tidak ada akun Admin yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isCurrent = user.id === currentAdmin.id;
                  const isSuspended = user.status === 'suspended';

                  return (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-700/60 text-sky-200 font-bold text-xs flex items-center justify-center shrink-0">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-mono text-sky-400">
                                  (Sesi Aktif)
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">ID: {user.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-sky-300 font-semibold">@{user.username}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-slate-200 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>Admin</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isSuspended ? (
                          <span className="text-rose-400 font-semibold">Nonaktif</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Aktif</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('id-ID') : 'Belum pernah'}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                            title="Sunting Akun Admin"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            disabled={isCurrent || usersList.length <= 1}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCurrent || usersList.length <= 1
                                ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                                : 'bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 border border-rose-900/70 cursor-pointer'
                            }`}
                            title={isCurrent ? 'Akun sedang aktif digunakan' : 'Hapus Akun Admin'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Add / Edit Admin Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-sky-400" />
                <span>{editingUser ? 'Sunting Akun Admin' : 'Tambah Akun Admin Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Contoh: Admin Kamus Sultra"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Username *</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="admin2"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status Akun</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="suspended">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="admin2@leksika.id"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {editingUser ? 'Kata Sandi Baru (Kosongkan jika tetap)' : 'Kata Sandi *'}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat Akun Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-11 h-11 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hapus Akun Admin?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Akun <strong>{userToDelete.name}</strong> (@{userToDelete.username}) akan dihapus permanen.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
