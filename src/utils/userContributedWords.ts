import { WordEntry } from '../types';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';

const CONTRIBUTED_WORDS_STORAGE_KEY = 'leksika_sultra_contributed_words_v2';

// Initial community contributed words (includes verified entries + pending proposals for Admin moderation)
export const INITIAL_CONTRIBUTED_WORDS: WordEntry[] = [
  {
    id: 'contrib-tk-1',
    sourceLangId: 'ind',
    targetLangId: 'tk',
    word: 'Saling Menyayangi',
    translation: 'Mombeore-orei',
    phonetic: 'mom-be-o-re-o-rei',
    category: 'Salam',
    exampleSentence: 'Ito toono Tolaki mombeore-orei ronga samaturu.',
    exampleTranslation: 'Kita masyarakat suku Tolaki harus saling menyayangi dan tolong-menolong.',
    culturalContext: 'Nilai luhur suku Tolaki dalam menjaga keharmonisan antar sesama warga.',
    isUserContributed: true,
    moderationStatus: 'approved',
    contributorName: 'Penyusun Komunitas Sultra',
    createdAt: '2026-08-15',
    isPopular: true
  },
  {
    id: 'contrib-mun-1',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Kain Tenun Muna',
    translation: 'Kamooru / Tenun Wuna',
    phonetic: 'ka-moo-ru',
    category: 'Budaya & Tradisi',
    exampleSentence: 'Ina momooru kamooru Masalili i lambu.',
    exampleTranslation: 'Ibu menenun kain tenun motif Masalili di serambi rumah.',
    culturalContext: 'Kain tenun tradisional Muna warisan leluhur berbahan pewarna alami tumbuhan hutan.',
    isUserContributed: true,
    moderationStatus: 'approved',
    contributorName: 'Komunitas Penenun Masalili',
    createdAt: '2026-08-20',
    isPopular: true
  },
  {
    id: 'contrib-btn-1',
    sourceLangId: 'ind',
    targetLangId: 'btn',
    word: 'Pintu Gerbang Benteng',
    translation: 'Lawa',
    phonetic: 'la-wa',
    category: 'Budaya & Tradisi',
    exampleSentence: 'Benteng Keraton Buton memiliki 12 Lawa yang dijaga hulubalang.',
    exampleTranslation: 'Benteng Keraton Buton memiliki 12 pintu gerbang Lawa yang masing-masing dijaga perwira keraton.',
    culturalContext: 'Dua belas Lawa melambangkan dua belas lubang pada tubuh manusia menurut filosofi tasawuf Wolio.',
    isUserContributed: true,
    moderationStatus: 'approved',
    contributorName: 'Budayawan Wolio Baubau',
    createdAt: '2026-08-25',
    isPopular: true
  },
  {
    id: 'proposal-mor-1',
    sourceLangId: 'ind',
    targetLangId: 'mor',
    word: 'Gotong Royong Panen',
    translation: 'Mombesosooli',
    phonetic: 'mom-be-so-soo-li',
    category: 'Budaya & Tradisi',
    exampleSentence: 'Mia Moronene mombesosooli i galu.',
    exampleTranslation: 'Masyarakat Moronene bergotong royong membantu panen di ladang.',
    culturalContext: 'Tradisi saling membantu menggarap kebun pada masyarakat adat Moronene di Bombana.',
    isUserContributed: true,
    moderationStatus: 'pending',
    contributorName: 'La Ode হারুন (Kontributor Bombana)',
    createdAt: '2026-09-28'
  },
  {
    id: 'proposal-tk-2',
    sourceLangId: 'ind',
    targetLangId: 'tk',
    word: 'Simbol Perdamaian Adat',
    translation: 'Kalosara',
    phonetic: 'ka-lo-sa-ra',
    category: 'Budaya & Tradisi',
    exampleSentence: 'Tolea mbeaso Kalosara i olono toono dadio.',
    exampleTranslation: 'Juru bicara adat meletakkan Kalosara di hadapan orang banyak.',
    culturalContext: 'Lingkaran rotan suci pemersatu hukum adat, musyawarah, dan perdamaian suku Tolaki.',
    isUserContributed: true,
    moderationStatus: 'pending',
    contributorName: 'Wa Ode Siti Rahmawati',
    createdAt: '2026-09-29'
  }
];

export function loadContributedWords(): WordEntry[] {
  try {
    const raw = localStorage.getItem(CONTRIBUTED_WORDS_STORAGE_KEY);
    if (!raw) {
      const cleaned = INITIAL_CONTRIBUTED_WORDS.map(w =>
        w.id === 'proposal-mor-1' ? { ...w, contributorName: 'Hendrikus Rumbia (Bombana)' } : w
      );
      saveContributedWords(cleaned);
      return cleaned;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CONTRIBUTED_WORDS;
  } catch (error) {
    console.error('Failed to load contributed words:', error);
    return INITIAL_CONTRIBUTED_WORDS;
  }
}

export function saveContributedWords(words: WordEntry[]): void {
  try {
    localStorage.setItem(CONTRIBUTED_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Failed to save contributed words to localStorage:', error);
  }
}

/**
 * Digunakan khusus oleh Role Pengguna:
 * Mengirimkan usulan kata baru ke antrean moderasi (`moderationStatus: 'pending'`).
 * Kata TIDAK langsung masuk kamus utama sebelum disetujui oleh Role Admin/Moderator.
 */
export function addContributedWord(
  newWord: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>,
  contributorName: string = 'Pengguna',
  options?: { autoApprove?: boolean; isOfficialAdmin?: boolean }
): { word: WordEntry; updatedList: WordEntry[] } {
  const currentList = loadContributedWords();
  const isOfficial = Boolean(options?.isOfficialAdmin);
  const status: 'pending' | 'approved' = options?.autoApprove || isOfficial ? 'approved' : 'pending';
  const prefix = isOfficial ? 'official' : 'proposal';
  const id = `${prefix}-${newWord.targetLangId}-${Date.now()}`;
  const nowStr = new Date().toISOString().split('T')[0];

  const fullWord: WordEntry = {
    ...newWord,
    id,
    isUserContributed: !isOfficial,
    moderationStatus: status,
    contributorName: contributorName.trim() || 'Pengguna Leksika',
    createdAt: nowStr
  };

  const updatedList = [fullWord, ...currentList];
  saveContributedWords(updatedList);
  return { word: fullWord, updatedList };
}

export function updateContributedWord(
  wordId: string,
  updatedFields: Partial<WordEntry>
): WordEntry[] {
  const currentList = loadContributedWords();
  const existsInContributed = currentList.some(w => w.id === wordId);

  let updatedList: WordEntry[];
  if (existsInContributed) {
    updatedList = currentList.map(w => {
      if (w.id === wordId) {
        return {
          ...w,
          ...updatedFields,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return w;
    });
  } else {
    // Jika admin mengedit entri bawaan DICTIONARY_DATABASE, simpan override-nya
    const baseEntry = DICTIONARY_DATABASE.find(w => w.id === wordId);
    if (baseEntry) {
      const overridden: WordEntry = {
        ...baseEntry,
        ...updatedFields,
        moderationStatus: 'approved',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      updatedList = [overridden, ...currentList];
    } else {
      updatedList = currentList;
    }
  }

  saveContributedWords(updatedList);
  return updatedList;
}

export function deleteContributedWord(wordId: string): WordEntry[] {
  const currentList = loadContributedWords();
  const updatedList = currentList.filter(w => w.id !== wordId);
  saveContributedWords(updatedList);
  return updatedList;
}

/**
 * Menggabungkan kamus resmi dengan entri yang SUDAH DISETUJUI (`moderationStatus !== 'pending' && !== 'rejected'`).
 * Usulan pengguna yang masih `pending` tidak muncul di kamus publik sampai disetujui oleh Role Admin/Moderator.
 */
export function getMergedDictionary(contributedWords: WordEntry[] = []): WordEntry[] {
  const approvedContributed = contributedWords.filter(
    w => w.moderationStatus !== 'pending' && w.moderationStatus !== 'rejected'
  );
  const overriddenIds = new Set(approvedContributed.map(w => w.id));
  const remainingBase = DICTIONARY_DATABASE.filter(w => !overriddenIds.has(w.id));
  return [...approvedContributed, ...remainingBase];
}
