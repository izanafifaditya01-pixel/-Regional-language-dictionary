import { WordEntry } from '../types';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';

const CONTRIBUTED_WORDS_STORAGE_KEY = 'leksika_sultra_contributed_words_v1';

// Initial sample community contributed words for Sultra
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
    contributorName: 'Budayawan Wolio Baubau',
    createdAt: '2026-08-25',
    isPopular: true
  }
];

export function loadContributedWords(): WordEntry[] {
  try {
    const raw = localStorage.getItem(CONTRIBUTED_WORDS_STORAGE_KEY);
    if (!raw) {
      saveContributedWords(INITIAL_CONTRIBUTED_WORDS);
      return INITIAL_CONTRIBUTED_WORDS;
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

export function addContributedWord(
  newWord: Omit<WordEntry, 'id' | 'createdAt' | 'isUserContributed'>,
  contributorName: string = 'Pengguna'
): { word: WordEntry; updatedList: WordEntry[] } {
  const currentList = loadContributedWords();
  const id = `contrib-${newWord.targetLangId}-${Date.now()}`;
  const nowStr = new Date().toISOString().split('T')[0];

  const fullWord: WordEntry = {
    ...newWord,
    id,
    isUserContributed: true,
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
  const updatedList = currentList.map(w => {
    if (w.id === wordId) {
      return {
        ...w,
        ...updatedFields,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }
    return w;
  });

  saveContributedWords(updatedList);
  return updatedList;
}

export function deleteContributedWord(wordId: string): WordEntry[] {
  const currentList = loadContributedWords();
  const updatedList = currentList.filter(w => w.id !== wordId);
  saveContributedWords(updatedList);
  return updatedList;
}

export function getMergedDictionary(contributedWords: WordEntry[] = []): WordEntry[] {
  // Merge base Sultra dictionary with user contributed words
  // Contributed words are placed first or merged seamlessly
  return [...contributedWords, ...DICTIONARY_DATABASE];
}
