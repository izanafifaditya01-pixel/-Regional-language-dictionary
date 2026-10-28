import React, { useState } from 'react';
import {
  PlusCircle,
  BookPlus,
  Volume2,
  CheckCircle2,
  Search,
  Filter,
  BookOpen,
  Clock,
  Info,
} from 'lucide-react';
import { WordEntry, UserProfile } from '../types';
import { LANGUAGES_DATA, CATEGORIES_DATA } from '../data/languagesData';
import { speakWord } from '../utils/audioSpeech';
import { playSuccessSound, playTileClickSound, playErrorSound } from '../utils/soundEffects';

interface WordContributionViewProps {
  contributedWords: WordEntry[];
  onSubmitProposal: (
    wordData: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>,
    contributorName: string
  ) => void;
  onSelectWordDetail: (word: WordEntry) => void;
  userProfile: UserProfile;
}

export const WordContributionView: React.FC<WordContributionViewProps> = ({
  contributedWords,
  onSubmitProposal,
  onSelectWordDetail,
  userProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'list'>('form');

  // Form State (Proposal Submission Only — No Admin CRUD)
  const [targetLangId, setTargetLangId] = useState<string>('tk');
  const [wordIndonesian, setWordIndonesian] = useState<string>('');
  const [translationRegional, setTranslationRegional] = useState<string>('');
  const [phoneticGuide, setPhoneticGuide] = useState<string>('');
  const [category, setCategory] = useState<string>('Salam');
  const [exampleSentence, setExampleSentence] = useState<string>('');
  const [exampleTranslation, setExampleTranslation] = useState<string>('');
  const [culturalContext, setCulturalContext] = useState<string>('');
  const [contributorName, setContributorName] = useState<string>(
    userProfile.name || 'Kontributor Komunitas'
  );

  // Filter & Search State for Status List
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Notification State
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const regionalLanguages = LANGUAGES_DATA.filter(l => l.id !== 'ind');
  const currentTargetLangObj =
    LANGUAGES_DATA.find(l => l.id === targetLangId) || regionalLanguages[0];

  const pendingCount = contributedWords.filter(w => w.moderationStatus === 'pending').length;
  const approvedCount = contributedWords.filter(
    w => w.isUserContributed && w.moderationStatus !== 'pending' && w.moderationStatus !== 'rejected'
  ).length;

  const resetForm = () => {
    setWordIndonesian('');
    setTranslationRegional('');
    setPhoneticGuide('');
    setCategory('Salam');
    setExampleSentence('');
    setExampleTranslation('');
    setCulturalContext('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wordIndonesian.trim() || !translationRegional.trim()) {
      playErrorSound();
      setNotification({
        message: 'Mohon lengkapi Kata Bahasa Indonesia dan Terjemahan Daerah.',
        type: 'error',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const generatedPhonetic =
      phoneticGuide.trim() || translationRegional.toLowerCase().replace(/\s+/g, '-');

    onSubmitProposal(
      {
        sourceLangId: 'ind',
        targetLangId,
        word: wordIndonesian.trim(),
        translation: translationRegional.trim(),
        phonetic: generatedPhonetic,
        category,
        exampleSentence:
          exampleSentence.trim() || `${translationRegional.trim()} meambo i wonua.`,
        exampleTranslation:
          exampleTranslation.trim() || `${wordIndonesian.trim()} sangat baik.`,
        culturalContext: culturalContext.trim(),
        moderationStatus: 'pending',
      },
      contributorName.trim()
    );

    playSuccessSound();
    setNotification({
      message: `Usulan kosakata "${translationRegional}" berhasil dikirim (+30 XP). Kata akan tampil di kamus utama setelah disetujui Admin.`,
      type: 'success',
    });
    resetForm();
    setTimeout(() => setNotification(null), 6000);
  };

  const communityWordsOnly = contributedWords.filter(
    w => w.isUserContributed && w.moderationStatus !== 'rejected'
  );

  const filteredWords = communityWordsOnly.filter(w => {
    const matchesLang = selectedLangFilter === 'all' || w.targetLangId === selectedLangFilter;
    const isPending = w.moderationStatus === 'pending';
    if (statusFilter === 'pending' && !isPending) return false;
    if (statusFilter === 'approved' && isPending) return false;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      w.word.toLowerCase().includes(q) ||
      w.translation.toLowerCase().includes(q) ||
      (w.category && w.category.toLowerCase().includes(q)) ||
      (w.contributorName && w.contributorName.toLowerCase().includes(q));
    return matchesLang && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Editorial Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#14532D]">
          Role Pengguna · Pengajuan Kosakata Komunitas
        </p>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Usulkan Kosakata Bahasa Daerah Sultra
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Ajukan kosakata baru untuk <strong>Bahasa Tolaki</strong>, <strong>Bahasa Moronene</strong>,{' '}
          <strong>Bahasa Muna</strong>, dan <strong>Bahasa Buton</strong>. Setiap usulan kata dari User akan diperiksa oleh{' '}
          <strong>Admin</strong> sebelum ditampilkan di kamus resmi.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-stone-500 tabular-nums">
          <span className="text-[#14532D] font-semibold">+30 XP per Pengajuan</span>
          <span aria-hidden="true">·</span>
          <span>{approvedCount} Usulan Disetujui Admin</span>
          <span aria-hidden="true">·</span>
          <span>{pendingCount} Menunggu Persetujuan Admin</span>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
              : 'bg-rose-50 text-rose-950 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${
                notification.type === 'success' ? 'text-[#14532D]' : 'text-rose-600'
              }`}
            />
            <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-semibold underline opacity-75 hover:opacity-100 cursor-pointer whitespace-nowrap ml-3"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Segmented Navigation Sub-Tabs (User Proposal Scope Only) */}
      <div className="flex items-center gap-2 border-b border-stone-200/90 pb-4 overflow-x-auto">
        <button
          id="btn-subtab-form"
          type="button"
          onClick={() => {
            playTileClickSound();
            setActiveSubTab('form');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'form'
              ? 'pill-active'
              : 'bg-white text-stone-700 hover:bg-[#EFECE4] border border-stone-200/90'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Formulir Usulan Kata</span>
        </button>

        <button
          id="btn-subtab-list"
          type="button"
          onClick={() => {
            playTileClickSound();
            setActiveSubTab('list');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
            activeSubTab === 'list'
              ? 'pill-active'
              : 'bg-white text-stone-700 hover:bg-[#EFECE4] border border-stone-200/90'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Status Usulan Komunitas ({communityWordsOnly.length})</span>
        </button>
      </div>

      {/* TAB 1: FORMULIR PENGAJUAN USULAN PENGGUNA */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90">
            <div className="mb-6 pb-4 border-b border-stone-100">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Formulir Pengajuan Kosakata Baru
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Usulan Anda akan diperiksa oleh Admin sebelum ditambahkan ke kamus utama.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Pilih Bahasa Daerah */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Bahasa Daerah Sasaran <span className="text-rose-600">*</span>
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
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        targetLangId === lang.id
                          ? 'border-[#14532D] bg-[#14532D]/8 text-[#14532D]'
                          : 'border-stone-200/90 hover:bg-[#F8F6F1] bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold block whitespace-nowrap">
                        {lang.name.replace('Bahasa ', '')}
                      </span>
                      <span className="text-[11px] text-stone-500 truncate block mt-0.5">
                        {lang.nativeName.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Kata Bahasa Indonesia & Terjemahan Daerah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Kata Bahasa Indonesia <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wordIndonesian}
                    onChange={e => setWordIndonesian(e.target.value)}
                    placeholder="Contoh: Musyawarah, Panen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm text-stone-900 placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Padanan {currentTargetLangObj.name} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={translationRegional}
                    onChange={e => setTranslationRegional(e.target.value)}
                    placeholder={`Kata dalam ${currentTargetLangObj.name}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm font-semibold text-[#14532D] placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* 3. Panduan Fonetik & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Panduan Fonetik / Lafal (Opsional)
                  </label>
                  <input
                    type="text"
                    value={phoneticGuide}
                    onChange={e => setPhoneticGuide(e.target.value)}
                    placeholder="Contoh: ka-lo-sa-ra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm font-mono text-stone-800 placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Kategori Leksikon
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm text-stone-800 outline-hidden transition-colors cursor-pointer"
                  >
                    {CATEGORIES_DATA.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Contoh Kalimat */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Contoh Kalimat Daerah
                  </label>
                  <input
                    type="text"
                    value={exampleSentence}
                    onChange={e => setExampleSentence(e.target.value)}
                    placeholder={`Contoh penggunaan dalam ${currentTargetLangObj.name}...`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm text-stone-900 placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Terjemahan Contoh Kalimat (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={exampleTranslation}
                    onChange={e => setExampleTranslation(e.target.value)}
                    placeholder="Arti kalimat dalam Bahasa Indonesia..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm text-stone-900 placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* 5. Konteks Budaya & Nama Pengusul */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Catatan Budaya / Konteks Pemakaian (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={culturalContext}
                    onChange={e => setCulturalContext(e.target.value)}
                    placeholder="Jelaskan dialek wilayah atau konteks adat penggunaan kata ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm text-stone-900 placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Nama Pengusul
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={e => setContributorName(e.target.value)}
                    placeholder="Nama Anda atau Komunitas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-sm text-stone-900 placeholder-stone-400 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-submit-word"
                  className="w-full flex items-center justify-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white py-3 px-6 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Usulan Kata (+30 XP)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Card Preview & Workflow Explanation (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-wider font-semibold text-stone-600">
                  Pratinjau Usulan Entri
                </span>
                <span className="text-amber-700 font-medium">
                  Status Awal: Menunggu Admin
                </span>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-stone-500">
                      {currentTargetLangObj.name} · {category}
                    </p>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                      {translationRegional || "Monga'a"}
                    </h3>
                    <p className="font-mono text-xs text-[#14532D] mt-0.5">
                      /{phoneticGuide || translationRegional.toLowerCase().replace(/\s+/g, '-') || 'mo-nga-a'}/
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (translationRegional) {
                        speakWord(translationRegional, targetLangId);
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-[#F8F6F1] hover:bg-[#14532D] text-stone-700 hover:text-white flex items-center justify-center border border-stone-200 transition-colors cursor-pointer"
                    title="Uji Suara Pelafalan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Padanan Indonesia</span>
                    <span className="font-semibold text-stone-900">
                      {wordIndonesian || 'Makan / Kosakata Baru'}
                    </span>
                  </div>
                  <p className="font-serif italic text-stone-700 pt-1">
                    &ldquo;{exampleSentence || `${translationRegional || "Monga'a"} meambo i wonua.`}&rdquo;
                  </p>
                  <p className="text-stone-500">
                    — {exampleTranslation || `${wordIndonesian || 'Makan'} sangat baik.`}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Pengusul: {contributorName || 'Pengguna'}</span>
                  <span>Diverifikasi oleh Role Admin</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#EFECE4]/75 border border-stone-200/90 text-xs text-stone-700 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <strong className="text-stone-900 block">Alur Pemisahan User &amp; Admin</strong>
                <p>
                  Sebagai <strong>User</strong>, Anda dapat mengusulkan kosakata baru. Wewenang penyuntingan kamus master, persetujuan publikasi, serta penghapusan entri dikelola sepenuhnya oleh <strong>Admin</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAFTAR STATUS USULAN KOMUNITAS (READ-ONLY FOR USERS) */}
      {activeSubTab === 'list' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari usulan kata atau pengusul..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F6F1] border border-stone-200/90 focus:border-[#14532D] focus:bg-white text-xs sm:text-sm text-stone-900 outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 p-1 bg-[#EFECE4] rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                    statusFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
                  }`}
                >
                  Semua ({communityWordsOnly.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                    statusFilter === 'pending' ? 'bg-white text-amber-800 shadow-2xs font-semibold' : 'text-stone-600'
                  }`}
                >
                  Menunggu ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                    statusFilter === 'approved' ? 'bg-white text-[#14532D] shadow-2xs font-semibold' : 'text-stone-600'
                  }`}
                >
                  Terverifikasi ({approvedCount})
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
                <button
                  type="button"
                  onClick={() => setSelectedLangFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedLangFilter === 'all'
                      ? 'bg-[#14532D] text-white'
                      : 'bg-[#F8F6F1] text-stone-600 hover:bg-[#EFECE4]'
                  }`}
                >
                  Semua Bahasa
                </button>
                {regionalLanguages.map(lang => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedLangFilter(lang.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      selectedLangFilter === lang.id
                        ? 'bg-[#14532D] text-white'
                        : 'bg-[#F8F6F1] text-stone-600 hover:bg-[#EFECE4]'
                    }`}
                  >
                    {lang.name.replace('Bahasa ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/90 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#EFECE4] text-[#14532D] flex items-center justify-center mx-auto mb-4">
                <BookPlus className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                Belum Ada Usulan pada Filter Ini
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                Jadilah kontributor kosakata bahasa daerah Sulawesi Tenggara berikutnya.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('form')}
                className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajukan Usulan Baru</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {filteredWords.map(word => {
                const langObj =
                  LANGUAGES_DATA.find(l => l.id === word.targetLangId) || regionalLanguages[0];
                const isPending = word.moderationStatus === 'pending';

                return (
                  <article
                    key={word.id}
                    onClick={() => {
                      if (!isPending) onSelectWordDetail(word);
                    }}
                    className={`bg-white rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between space-y-4 transition-colors ${
                      !isPending ? 'hover:border-[#14532D]/50 cursor-pointer' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                        <span>
                          {langObj.name.replace('Bahasa ', '')} · {word.category}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Menunggu Kurasi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#14532D] font-semibold whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Disetujui</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-serif text-xl font-bold text-stone-900">
                            {word.translation}
                          </h4>
                          <p className="font-mono text-xs text-stone-500">/{word.phonetic}/</p>
                          <p className="text-xs text-stone-700 mt-1">
                            Arti: <strong>{word.word}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            speakWord(word.translation, word.targetLangId);
                          }}
                          className="w-9 h-9 rounded-xl bg-[#F8F6F1] hover:bg-[#14532D] text-stone-700 hover:text-white flex items-center justify-center border border-stone-200 transition-colors cursor-pointer shrink-0"
                          title="Dengarkan Pelafalan"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {word.exampleSentence && (
                        <p className="font-serif italic text-xs text-stone-600 pt-2 border-t border-stone-100">
                          &ldquo;{word.exampleSentence}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 tabular-nums">
                      <span className="truncate">Oleh: {word.contributorName || 'Kontributor'}</span>
                      <span className="font-mono shrink-0">{word.createdAt || ''}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
