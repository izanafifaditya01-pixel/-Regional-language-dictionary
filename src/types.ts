/**
 * Types for Kamus Bahasa Nusantara
 */

export interface Language {
  id: string; // e.g. 'ind', 'bug', 'jav', 'sun', 'ban', 'mak', 'min', 'ace', 'btk', 'sas', 'bjn', 'dyn', 'mad', 'tor', 'gor', 'tk', 'btn'
  code: string;
  name: string; // e.g. 'Bahasa Bugis', 'Bahasa Jawa'
  nativeName: string; // e.g. 'Basa Jawa'
  province: string; // e.g. 'Sulawesi Selatan', 'Jawa Tengah'
  island: string; // e.g. 'Sulawesi', 'Jawa', 'Sumatera'
  speakerCount: string; // e.g. '5 Juta+'
  flagEmoji: string;
  accentColor: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

export interface WordEntry {
  id: string;
  sourceLangId: string; // 'ind' or regional language ID
  targetLangId: string;
  word: string;
  translation: string;
  phonetic: string; // Cara membaca, e.g. "man-reh"
  category: string; // e.g. 'Kata Kerja', 'Keluarga', 'Makanan'
  exampleSentence: string;
  exampleTranslation: string;
  culturalContext?: string;
  synonyms?: string[];
  antonyms?: string[];
  audioUrl?: string;
  isPopular?: boolean;
  isWordOfTheDay?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'scramble' | 'fill_blank' | 'guess';
  difficulty: 'easy' | 'medium' | 'hard';
  languageId: string;
  question: string;
  word: string; // target word
  translation: string; // correct answer or reference
  options?: string[]; // for MCQ
  scrambleLetters?: string[]; // for Scramble
  contextSentence?: string; // for fill in the blank
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'learning' | 'quiz' | 'streak' | 'mastery';
  requiredXp?: number;
  unlockedAt?: string;
}

export interface UserHistoryItem {
  id: string;
  wordId: string;
  word: string;
  translation: string;
  sourceLangId: string;
  targetLangId: string;
  searchedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  bookmarks: string[]; // array of word IDs
  history: UserHistoryItem[];
  badges: string[]; // array of badge IDs
  unlockedLanguages: string[];
  completedQuizzesCount: number;
  wordsMasteredCount: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  languageContext?: string;
  suggestedWords?: { word: string; translation: string; lang: string }[];
}
