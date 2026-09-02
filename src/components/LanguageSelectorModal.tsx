import React, { useState } from 'react';
import { X, Search, Check, MapPin, Sparkles } from 'lucide-react';
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

  const filteredLanguages = LANGUAGES_DATA.filter(lang => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.province.toLowerCase().includes(query) ||
      lang.island.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        id="language-selector-modal"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">
              Pilih {type === 'source' ? 'Bahasa Asal' : 'Bahasa Sasaran'}
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black">Rumpun Bahasa Sulawesi Tenggara</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/20 rounded-full">
                {filteredLanguages.length} Pilihan
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">Bahasa Tolaki, Moronene, Muna, Buton, & Indonesia</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari bahasa Tolaki, Moronene, Muna, Buton..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Languages Grid / List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredLanguages.map(lang => {
            const isSelected = lang.id === selectedLangId;

            return (
              <div
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-3xl p-2 bg-slate-100 rounded-2xl shrink-0 border border-slate-200">
                    {lang.flagEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{lang.name}</h4>
                      <span className="text-xs text-slate-500 font-mono">({lang.nativeName})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-emerald-700">
                        <MapPin className="w-3.5 h-3.5" />
                        {lang.province}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{lang.speakerCount} Penutur</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                      <Check className="w-5 h-5" />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 hover:text-emerald-700">
                      Pilih
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Setiap bahasa daerah dilengkapi kosakata lengkap tubuh, alam, budaya, angka, dan audio pelafalan.
        </div>
      </div>
    </div>
  );
};
