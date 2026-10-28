import React, { useState } from 'react';
import {
  FileText,
  Search,
  Trash2,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AuditLogEntry, AdminUser } from '../types';
import { getAuditLogs, clearAuditLogs } from '../utils/adminAuth';

interface AdminAuditLogTabProps {
  currentAdmin: AdminUser;
  onNotification: (msg: string) => void;
}

export const AdminAuditLogTab: React.FC<AdminAuditLogTabProps> = ({
  onNotification,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const refreshLogs = () => {
    setLogs(getAuditLogs());
  };

  const handleConfirmClearLogs = () => {
    clearAuditLogs();
    setLogs([]);
    setConfirmClear(false);
    onNotification('Riwayat aktivitas Admin berhasil dibersihkan.');
  };

  const filteredLogs = logs.filter(entry => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        entry.userName.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const getCategoryLabel = (cat: AuditLogEntry['category']) => {
    switch (cat) {
      case 'words':
        return 'Kamus Kosakata';
      case 'moderation':
        return 'Usulan User';
      case 'users':
        return 'Akun Admin';
      case 'backup':
        return 'Cadangan Data';
      case 'system':
      default:
        return 'Sistem & Sesi';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>Riwayat Aktivitas Admin</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Catatan kronologis penambahan kosakata, persetujuan usulan user, ekspor cadangan database, dan sesi login Admin.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={refreshLogs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </button>

          {confirmClear ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleConfirmClearLogs}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer whitespace-nowrap"
              >
                Ya, Bersihkan
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer whitespace-nowrap"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-900/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aktivitas, aksi, atau target kosakata..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
        >
          <option value="all">Semua Kategori</option>
          <option value="words">Kamus Kosakata</option>
          <option value="moderation">Usulan User</option>
          <option value="users">Akun Admin</option>
          <option value="backup">Cadangan Data</option>
          <option value="system">Sistem &amp; Sesi</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200 tabular-nums">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-44">Waktu</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Aksi</th>
                <th className="py-3 px-4">Target / Keterangan</th>
                <th className="py-3 px-4">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada catatan aktivitas yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{log.userName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Role: Admin</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-sky-300">{log.action}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{log.target}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {getCategoryLabel(log.category)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
