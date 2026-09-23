import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  Clock,
  Shield,
  CheckCircle2,
  Sparkles,
  Users,
  Database,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AuditLogEntry, AdminUser, AdminRole } from '../types';
import { getAuditLogs, clearAuditLogs, hasPermission } from '../utils/adminAuth';

interface AdminAuditLogTabProps {
  currentAdmin: AdminUser;
  onNotification: (msg: string) => void;
}

export const AdminAuditLogTab: React.FC<AdminAuditLogTabProps> = ({
  currentAdmin,
  onNotification,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const isSuperAdmin = currentAdmin.role === 'Super Administrator';
  const canViewLogs = hasPermission(currentAdmin, 'can_view_audit_logs');

  const refreshLogs = () => {
    setLogs(getAuditLogs());
  };

  const handleClearLogs = () => {
    if (!isSuperAdmin) {
      onNotification('Hanya Super Administrator yang berhak mengosongkan riwayat audit log.');
      return;
    }
    if (window.confirm('Bersihkan semua catatan aktivitas (audit logs)? Tindakan ini permanen.')) {
      clearAuditLogs();
      setLogs([]);
      onNotification('Riwayat catatan audit berhasil dibersihkan.');
    }
  };

  const filteredLogs = logs.filter(entry => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        entry.userName.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q) ||
        (entry.ipAddress && entry.ipAddress.includes(q));
      if (!match) return false;
    }
    if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
      return false;
    }
    if (selectedRole !== 'all' && entry.userRole !== selectedRole) {
      return false;
    }
    return true;
  });

  const getCategoryBadge = (cat: AuditLogEntry['category']) => {
    switch (cat) {
      case 'words':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            Kamus Kosakata
          </span>
        );
      case 'moderation':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
            Moderasi Usulan
          </span>
        );
      case 'users':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
            Akun Admin
          </span>
        );
      case 'roles':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
            Izin & RBAC
          </span>
        );
      case 'backup':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            Cadangan Data
          </span>
        );
      case 'system':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Sistem & Sesi
          </span>
        );
    }
  };

  const getRoleIcon = (role: AdminRole) => {
    switch (role) {
      case 'Super Administrator':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case 'Linguist Editor':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Moderator':
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'Viewer':
      default:
        return <Users className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
              Audit Trail & Akuntabilitas
            </span>
            <span className="text-xs text-slate-400">• Transparansi Aktivitas Admin</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Catatan Aktivitas Sistem (Audit Logs)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Semua riwayat login, penambahan kata, moderasi usulan, pembaruan hak akses, dan ekspor database
            tercatat secara kronologis untuk menjamin integritas data.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refreshLogs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Segarkan data log"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={handleClearLogs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 border border-rose-800/80 transition-colors cursor-pointer"
              title="Kosongkan log (Super Admin)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aktivitas, nama pengguna, aksi, atau target..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="words">Kamus Kosakata</option>
            <option value="moderation">Moderasi Usulan</option>
            <option value="users">Akun Admin</option>
            <option value="roles">Izin & RBAC</option>
            <option value="backup">Cadangan Data</option>
            <option value="system">Sistem & Sesi</option>
          </select>

          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Role</option>
            <option value="Super Administrator">Super Admin</option>
            <option value="Linguist Editor">Linguist Editor</option>
            <option value="Moderator">Moderator</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-200">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-black tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-44">Waktu (WITA)</th>
                <th className="py-3.5 px-4">Operator / Pengguna</th>
                <th className="py-3.5 px-4">Aksi Dilakukan</th>
                <th className="py-3.5 px-4">Target Objek / Keterangan</th>
                <th className="py-3.5 px-4">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada catatan audit yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                        </div>
                      </td>

                      {/* Operator */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {getRoleIcon(log.userRole)}
                          <span>{log.userName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Role: {log.userRole}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 font-semibold text-emerald-300">
                        {log.action}
                      </td>

                      {/* Target */}
                      <td className="py-3.5 px-4 text-xs text-slate-300 font-mono">
                        {log.target}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getCategoryBadge(log.category)}
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
  );
};
