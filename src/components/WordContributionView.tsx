import React, { useState } from 'react';
import { 
  PlusCircle, 
  BookPlus, 
  Sparkles, 
  Volume2, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  BookOpen, 
  Award,
  Layers,
  ArrowRight,
  Info,
  RotateCcw
} from 'lucide-react';
import { WordEntry, Language, UserProfile } from '../types';
import { LANGUAGES_DATA, CATEGORIES_DATA } from '../data/languagesData';
import { speakWord } from '../utils/audioSpeech';
import { playSuccessSound, playTileClickSound, playErrorSound } from '../utils/soundEffects';

interface WordContributionViewProps {
  contributedWords: WordEntry[];
  onAddWord: (wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>, contributorName: string) => void;
  onUpdateWord: (wordId: string, updatedFields: Partial<WordEntry>) => void;
  onDeleteWord: (wordId: string) => void;
  onSelectWordDetail: (word: WordEntry) => void;
  userProfile: UserProfile;
}

export const WordContributionView: React.FC<WordContributionViewProps> = ({
  contributedWords,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
  onSelectWordDetail,
  userProfile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'list' | 'backup'>('form');

  // Form State
  const [targetLangId, setTargetLangId] = useState<string>('tk');
  const [wordIndonesian, setWordIndonesian] = useState<string>('');
  const [translationRegional, setTranslationRegional] = useState<string>('');
  const [phoneticGuide, setPhoneticGuide] = useState<string>('');
  const [category, setCategory] = useState<string>('Salam');
  const [exampleSentence, setExampleSentence] = useState<string>('');
  const [exampleTranslation, setExampleTranslation] = useState<string>('');
  const [culturalContext, setCulturalContext] = useState<string>('');
  const [contributorName, setContributorName] = useState<string>(userProfile.name || 'Pengguna Leksika');

  // Edit Mode State
  const [editingWordId, setEditingWordId] = useState<string | null>(null);

  // Filter & Search State for List
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');

  // Success Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Available Regional Sultra Languages (excluding 'ind')
  const regionalLanguages = LANGUAGES_DATA.filter(l => l.id !== 'ind');
  const currentTargetLangObj = LANGUAGES_DATA.find(l => l.id === targetLangId) || regionalLanguages[0];

  const resetForm = () => {
    setWordIndonesian('');
    setTranslationRegional('');
    setPhoneticGuide('');
    setCategory('Salam');
    setExampleSentence('');
    setExampleTranslation('');
    setCulturalContext('');
    setEditingWordId(null);
  };

  const handleStartEdit = (word: WordEntry) => {
    setEditingWordId(word.id);
    setTargetLangId(word.targetLangId);
    setWordIndonesian(word.word);
    setTranslationRegional(word.translation);
    setPhoneticGuide(word.phonetic || '');
    setCategory(word.category || 'Salam');
    setExampleSentence(word.exampleSentence || '');
    setExampleTranslation(word.exampleTranslation || '');
    setCulturalContext(word.culturalContext || '');
    setContributorName(word.contributorName || userProfile.name);
    setActiveSubTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wordIndonesian.trim() || !translationRegional.trim()) {
      playErrorSound();
      setNotification({
        message: 'Mohon lengkapi Kata Bahasa Indonesia dan Terjemahan Daerah.',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Auto-generate phonetic guide if empty
    const generatedPhonetic = phoneticGuide.trim() || translationRegional.toLowerCase().replace(/\s+/g, '-');

    if (editingWordId) {
      // Update existing word
      onUpdateWord(editingWordId, {
        targetLangId,
        word: wordIndonesian.trim(),
        translation: translationRegional.trim(),
        phonetic: generatedPhonetic,
        category,
        exampleSentence: exampleSentence.trim() || `${translationRegional.trim()} meambo i wonua.`,
        exampleTranslation: exampleTranslation.trim() || `${wordIndonesian.trim()} sangat baik.`,
        culturalContext: culturalContext.trim(),
        contributorName: contributorName.trim()
      });

      playSuccessSound();
      setNotification({
        message: `Kosakata "${translationRegional}" berhasil diperbarui!`,
        type: 'success'
      });
      resetForm();
      setActiveSubTab('list');
    } else {
      // Add new word
      onAddWord(
        {
          sourceLangId: 'ind',
          targetLangId,
          word: wordIndonesian.trim(),
          translation: translationRegional.trim(),
          phonetic: generatedPhonetic,
          category,
          exampleSentence: exampleSentence.trim() || `${translationRegional.trim()} meambo i wonua.`,
          exampleTranslation: exampleTranslation.trim() || `${wordIndonesian.trim()} sangat baik.`,
          culturalContext: culturalContext.trim()
        },
        contributorName.trim()
      );

      playSuccessSound();
      setNotification({
        message: `Kosakata "${translationRegional}" berhasil ditambahkan! Anda mendapatkan +30 XP Kontributor.`,
        type: 'success'
      });
      resetForm();
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const handleDelete = (wordId: string, wordName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kosakata "${wordName}" dari kamus?`)) {
      onDeleteWord(wordId);
      playTileClickSound();
      setNotification({
        message: `Kosakata "${wordName}" telah dihapus.`,
        type: 'success'
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Filtered contributed words for the list tab
  const filteredWords = contributedWords.filter(w => {
    const matchesLang = selectedLangFilter === 'all' || w.targetLangId === selectedLangFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      w.word.toLowerCase().includes(q) ||
      w.translation.toLowerCase().includes(q) ||
      (w.category && w.category.toLowerCase().includes(q)) ||
      (w.culturalContext && w.culturalContext.toLowerCase().includes(q));
    return matchesLang && matchesSearch;
  });

  // Export JSON handler
  const handleExportJson = () => {
    playTileClickSound();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contributedWords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kamus-sultra-kontribusi-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 mb-8 shadow-xl border border-emerald-700/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-12 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <BookPlus className="w-3.5 h-3.5" />
            <span>Kamus Komunitas & Pelestarian Bahasa Sultra</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Pengembangan Kosakata Daerah Sultra
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Bantu memperkaya perbendaharaan kata <strong>Bahasa Tolaki</strong>, <strong>Bahasa Moronene</strong>, <strong>Bahasa Muna</strong>, dan <strong>Bahasa Buton</strong>. Setiap kata yang Anda tambahkan langsung aktif di seluruh fitur kamus, pencarian, kuis, dan audio!
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-slate-100">+{30} XP per Kata Baru</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <Layers className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold text-slate-100">{contributedWords.length} Kata Dikontribusikan</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-blue-300" />
              <span className="font-semibold text-slate-100">4 Rumpun Bahasa Sultra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl mb-6 flex items-center justify-between shadow-md transition-all animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className={`w-5 h-5 ${notification.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`} />
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
        <button
          id="btn-subtab-form"
          onClick={() => {
            playTileClickSound();
            setActiveSubTab('form');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'form'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingWordId ? 'Edit Kosakata' : 'Tambah Kata Baru'}</span>
        </button>

        <button
          id="btn-subtab-list"
          onClick={() => {
            playTileClickSound();
            setActiveSubTab('list');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'list'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Daftar Kata Kontribusi ({contributedWords.length})</span>
        </button>

        <button
          id="btn-subtab-backup"
          onClick={() => {
            playTileClickSound();
            setActiveSubTab('backup');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'backup'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Cadangkan & Bagikan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FORMULIR TAMBAH / EDIT KATA */}
      {/* ========================================================================= */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {editingWordId ? 'Perbarui Kosakata Daerah' : 'Formulir Penambahan Kosakata Baru'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Isi data terjemahan, pelafalan, dan contoh kalimat di bawah ini.
                </p>
              </div>
              {editingWordId && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Batal Edit</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Pilih Bahasa Sasaran Daerah */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Bahasa Daerah Sasaran (Sulawesi Tenggara) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {regionalLanguages.map(lang => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        playTileClickSound();
                        setTargetLangId(lang.id);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        targetLangId === lang.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl mb-1">{lang.flagEmoji}</span>
                      <span className="text-xs font-bold leading-tight">{lang.name.replace('Bahasa ', '')}</span>
                      <span className="text-[10px] text-slate-500 truncate w-full">{lang.nativeName.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Kata Bahasa Indonesia & Terjemahan Daerah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Kata Bahasa Indonesia <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wordIndonesian}
                    onChange={e => setWordIndonesian(e.target.value)}
                    placeholder="Contoh: Makan, Selamat Pagi, Indah"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Terjemahan {currentTargetLangObj.name} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={translationRegional}
                    onChange={e => setTranslationRegional(e.target.value)}
                    placeholder={`Contoh dalam ${currentTargetLangObj.name}`}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-emerald-900 placeholder-slate-400 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* 3. Panduan Fonetik & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Panduan Fonetik / Cara Baca (Opsional)
                  </label>
                  <input
                    type="text"
                    value={phoneticGuide}
                    onChange={e => setPhoneticGuide(e.target.value)}
                    placeholder="Contoh: mo-nga-a, ku-maa"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Otomatis diisi jika dikosongkan.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Kategori Kosakata
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium text-slate-800 outline-hidden transition-all bg-white cursor-pointer"
                  >
                    {CATEGORIES_DATA.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Contoh Kalimat Daerah & Terjemahan */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Contoh Kalimat dalam {currentTargetLangObj.name}
                  </label>
                  <input
                    type="text"
                    value={exampleSentence}
                    onChange={e => setExampleSentence(e.target.value)}
                    placeholder={`Contoh kalimat dalam ${currentTargetLangObj.name}...`}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Arti Contoh Kalimat (Bahasa Indonesia)
                  </label>
                  <input
                    type="text"
                    value={exampleTranslation}
                    onChange={e => setExampleTranslation(e.target.value)}
                    placeholder="Arti kalimat di atas dalam Bahasa Indonesia..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* 5. Catatan Budaya / Filosofi & Nama Kontributor */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Catatan Budaya, Dialek atau Filosofi Daerah (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={culturalContext}
                    onChange={e => setCulturalContext(e.target.value)}
                    placeholder="Contoh: Digunakan dalam tradisi adat Kalosara, atau ungkapan khas suku di pedesaan..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Nama Kontributor / Penyusun
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={e => setContributorName(e.target.value)}
                    placeholder="Nama Anda atau Komunitas"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  id="btn-submit-word"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white py-3.5 px-6 rounded-2xl font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{editingWordId ? 'Simpan Perubahan' : 'Tambahkan ke Kamus (+30 XP)'}</span>
                </button>
                {editingWordId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-600 text-sm cursor-pointer"
                  >
                    Batal
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Live Card Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pratinjau Kartu Kamus Real-Time</span>
                </span>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Preview
                </span>
              </div>

              {/* Simulated Dictionary Card */}
              <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-6 shadow-lg shadow-emerald-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />

                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <span>{currentTargetLangObj.flagEmoji}</span>
                      <span>{currentTargetLangObj.name}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      {category}
                    </span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-md">
                    Komunitas
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-slate-400 font-medium mb-0.5">Bahasa Indonesia:</div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {wordIndonesian || 'Makan / Kata Baru'}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-800/70 font-semibold mb-0.5">
                        Terjemahan Daerah:
                      </div>
                      <div className="text-2xl font-black text-emerald-950">
                        {translationRegional || 'Monga\'a'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (translationRegional) {
                          speakWord(translationRegional, targetLangId);
                        }
                      }}
                      className="w-10 h-10 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 flex items-center justify-center shadow-xs border border-emerald-200 transition-colors cursor-pointer"
                      title="Dengarkan Suara Pelafalan"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs font-mono text-emerald-700 bg-white/70 px-2.5 py-1 rounded-lg inline-block">
                    /{phoneticGuide || translationRegional.toLowerCase().replace(/\s+/g, '-') || 'mo-nga-a'}/
                  </div>
                </div>

                {/* Example sentence preview */}
                <div className="space-y-2 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-700">Contoh: </span>
                    <span className="italic text-slate-800 font-medium">
                      "{exampleSentence || `${translationRegional || 'Monga\'a'} meambo ronga motaha.`}"
                    </span>
                  </div>
                  <div className="text-slate-500">
                    <span className="font-bold text-slate-600">Arti: </span>
                    "{exampleTranslation || `${wordIndonesian || 'Makan'} sangat nikmat bersama.`}"
                  </div>
                </div>

                {/* Cultural Context Preview */}
                {culturalContext && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 mb-4">
                    <span className="font-bold block mb-1">📖 Catatan Budaya / Filosofi:</span>
                    <p className="text-amber-800 leading-relaxed">{culturalContext}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                  <span>Kontributor: <strong>{contributorName || 'Pengguna Leksika'}</strong></span>
                  <span className="text-emerald-600 font-semibold">Tersimpan di Kamus</span>
                </div>
              </div>

              {/* Tips Box */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-1">Tips Kontribusi Sultra:</strong>
                  Semua kosakata yang Anda masukkan langsung aktif pada fitur <strong>Kamus</strong>, <strong>Penerjemah Cepat</strong>, <strong>Kuis Interaktif</strong>, dan <strong>Flashcard Belajar</strong>.
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAFTAR KATA KONTRIBUSI PENGGUNA */}
      {/* ========================================================================= */}
      {activeSubTab === 'list' && (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kata kontribusi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Bahasa:</span>
              </span>
              <button
                onClick={() => setSelectedLangFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedLangFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({contributedWords.length})
              </button>
              {regionalLanguages.map(lang => {
                const count = contributedWords.filter(w => w.targetLangId === lang.id).length;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLangFilter(lang.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                      selectedLangFilter === lang.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{lang.flagEmoji}</span>
                    <span>{lang.name.replace('Bahasa ', '')}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Word List Cards */}
          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <BookPlus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Belum Ada Kata yang Cocok</h3>
              <p className="text-xs text-slate-500 mb-6">
                Belum ada kata kontribusi untuk kriteria pencarian ini. Tambahkan kosakata pertama Anda sekarang!
              </p>
              <button
                onClick={() => setActiveSubTab('form')}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Kata Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map(word => {
                const langObj = LANGUAGES_DATA.find(l => l.id === word.targetLangId) || regionalLanguages[0];
                return (
                  <div
                    key={word.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/40 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {langObj.flagEmoji} {langObj.name.replace('Bahasa ', '')}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {word.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          ✨ Komunitas
                        </span>
                      </div>

                      <div className="mb-3">
                        <span className="text-xs text-slate-400 font-medium">Indonesia:</span>
                        <h4 className="text-base font-bold text-slate-800">{word.word}</h4>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 mb-3 flex items-center justify-between">
                        <div>
                          <div className="text-xl font-black text-emerald-950">{word.translation}</div>
                          <div className="text-[11px] font-mono text-emerald-700">/{word.phonetic}/</div>
                        </div>
                        <button
                          onClick={() => speakWord(word.translation, word.targetLangId)}
                          className="w-9 h-9 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 flex items-center justify-center border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
                          title="Dengarkan Suara"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {word.exampleSentence && (
                        <div className="text-xs text-slate-600 mb-3 space-y-1">
                          <div className="italic font-medium text-slate-700">"{word.exampleSentence}"</div>
                          <div className="text-slate-500 text-[11px]">Arti: "{word.exampleTranslation}"</div>
                        </div>
                      )}

                      {word.culturalContext && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900 mb-3 line-clamp-2">
                          <strong>Konteks: </strong> {word.culturalContext}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        Oleh: <strong>{word.contributorName || 'Pengguna'}</strong>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(word)}
                          className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit Kosakata"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(word.id, word.translation)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Kosakata"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CADANGKAN & BAGIKAN */}
      {/* ========================================================================= */}
      {activeSubTab === 'backup' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Cadangkan & Bagikan Data Kosakata</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Unduh seluruh perbendaharaan kata kontribusi Anda dalam format JSON untuk disimpan di perangkat, atau dibagikan ke rekan dan pelestari bahasa daerah lainnya.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-800">Total Kata Kontribusi</div>
              <div className="text-xs text-slate-500">{contributedWords.length} entri kosakata aktif</div>
            </div>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <strong className="font-bold block">✨ Keunggulan Sistem Leksika Sultra:</strong>
            <p className="leading-relaxed">
              Semua kata yang tersimpan disimpan secara lokal di browser Anda. Mengunduh cadangan JSON memastikan data berharga ini tetap aman meskipun Anda membersihkan cache peramban.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
