import React, { useState } from 'react';
import { X, Search, Check, MapPin, Globe } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES_DATA } from '../data/languagesData';

interface LanguageSelectorModalProps {
  type: 'source' | 'target';
  selectedLangId: string;
  onSelectLanguage: (lang: Language) => void;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  type,
  selectedLangId,
  onSelectLanguage,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState<string>('Semua');

  const islands = ['Semua', 'Sulawesi', 'Jawa', 'Sumatera', 'Kalimantan', 'Bali', 'Nusa Tenggara'];

  const filteredLanguages = LANGUAGES_DATA.filter(lang => {
    // Filter search query
    const matchQuery =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.island.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter island
    const matchIsland =
      selectedIsland === 'Semua' ||
      lang.island.toLowerCase().includes(selectedIsland.toLowerCase());

    return matchQuery && matchIsland;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        id="language-selector-modal"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">
              Pilih {type === 'source' ? 'Bahasa Asal' : 'Bahasa Tujuan'}
            </span>
            <h3 className="text-xl font-bold">Daftar Bahasa Daerah Indonesia</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Island Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama bahasa, provinsi, atau pulau..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Island Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {islands.map(island => (
              <button
                key={island}
                onClick={() => setSelectedIsland(island)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedIsland === island
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {island}
              </button>
            ))}
          </div>
        </div>

        {/* Languages Grid / List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredLanguages.map(lang => {
            const isSelected = lang.id === selectedLangId;

            return (
              <div
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/50 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-slate-100 rounded-xl shrink-0">{lang.flagEmoji}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{lang.name}</h4>
                      <span className="text-xs text-slate-400 font-mono">({lang.nativeName})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {lang.province}
                      </span>
                      <span>•</span>
                      <span>{lang.speakerCount} Penutur</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1.5 bg-emerald-600 text-white rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
