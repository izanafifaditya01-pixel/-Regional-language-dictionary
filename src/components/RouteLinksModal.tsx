import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Globe, ShieldCheck, User, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';

interface RouteLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const RouteLinksModal: React.FC<RouteLinksModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const links = [
    {
      id: 'user',
      title: 'Halaman Pengguna (User Portal)',
      badge: 'Bebas Akses Tanpa Login',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Kamus 4 bahasa Sultra, Terjemahan kalimat, Modul Belajar, Game Budaya, dan AI Tutor.',
      path: '/user',
      fullUrl: `${origin}/user`,
      icon: Globe,
      route: 'user' as PageRoute,
    },
    {
      id: 'user-login',
      title: 'Halaman Login Pengguna',
      badge: 'Link Khusus Akun Pengguna',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Halaman login/masuk untuk personalisasi nama akun, sinkronisasi XP, dan lencana.',
      path: '/user/login',
      fullUrl: `${origin}/user/login`,
      icon: User,
      route: 'user-login' as PageRoute,
    },
    {
      id: 'admin',
      title: 'Halaman Login / Dashboard Admin',
      badge: 'Terproteksi Kata Sandi',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      description: 'Portal autentikasi dan manajemen database kosakata, moderasi kata komunitas, dan backup data.',
      path: '/admin',
      fullUrl: `${origin}/admin`,
      icon: ShieldCheck,
      route: 'admin' as PageRoute,
    },
  ];

  const handleCopy = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Daftar Tautan Halaman Resmi</h3>
              <p className="text-xs text-slate-400">Pemisahan tautan akses Pengguna dan Administrator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Links */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {links.map(item => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/70 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3 pl-10">
                  {item.description}
                </p>

                {/* Path & Buttons */}
                <div className="pl-10 flex flex-wrap items-center justify-between gap-2 pt-1">
                  <code className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 select-all">
                    {item.path}
                  </code>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.id, item.fullUrl)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                      title="Salin URL lengkap"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin Link'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate(item.route);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      <span>Buka</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Anda dapat menyalin tautan di atas untuk navigasi langsung.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
