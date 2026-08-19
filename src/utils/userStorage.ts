import { UserProfile, UserHistoryItem } from '../types';

const STORAGE_KEY = 'leksika_nusantara_user_profile_v1';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Penjelajah Nusantara',
  email: 'pengguna@nusantara.id',
  xp: 150,
  level: 1,
  streak: 3,
  lastLoginDate: new Date().toISOString().split('T')[0],
  bookmarks: ['bug-1', 'jav-1', 'sun-2', 'ban-2'],
  history: [
    {
      id: 'hist-1',
      wordId: 'bug-1',
      word: 'Makan',
      translation: 'Manre',
      sourceLangId: 'ind',
      targetLangId: 'bug',
      searchedAt: '2026-07-28 10:30'
    },
    {
      id: 'hist-2',
      wordId: 'jav-2',
      word: 'Selamat Pagi',
      translation: 'Sugeng Enjang',
      sourceLangId: 'ind',
      targetLangId: 'jav',
      searchedAt: '2026-07-28 11:15'
    }
  ],
  badges: ['badge-1'],
  unlockedLanguages: ['bug', 'jav', 'sun', 'ban'],
  completedQuizzesCount: 2,
  wordsMasteredCount: 8
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function addXpToProfile(
  profile: UserProfile,
  xpAmount: number
): { updatedProfile: UserProfile; leveledUp: boolean; newLevel: number } {
  const newXp = profile.xp + xpAmount;
  // Calculate level: Level 1 = 0-100 XP, Level 2 = 101-300, Level 3 = 301-600, Level 4 = 601-1000, etc.
  let newLevel = 1;
  if (newXp >= 1000) newLevel = 4;
  else if (newXp >= 600) newLevel = 3;
  else if (newXp >= 250) newLevel = 2;

  const leveledUp = newLevel > profile.level;

  const updatedProfile: UserProfile = {
    ...profile,
    xp: newXp,
    level: newLevel
  };

  saveUserProfile(updatedProfile);

  return { updatedProfile, leveledUp, newLevel };
}

export function toggleBookmarkInProfile(profile: UserProfile, wordId: string): UserProfile {
  const isBookmarked = profile.bookmarks.includes(wordId);
  const newBookmarks = isBookmarked
    ? profile.bookmarks.filter(id => id !== wordId)
    : [...profile.bookmarks, wordId];

  const updated: UserProfile = {
    ...profile,
    bookmarks: newBookmarks
  };

  saveUserProfile(updated);
  return updated;
}

export function addHistoryToProfile(
  profile: UserProfile,
  item: Omit<UserHistoryItem, 'id' | 'searchedAt'>
): UserProfile {
  const newHistoryItem: UserHistoryItem = {
    ...item,
    id: `hist-${Date.now()}`,
    searchedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  // Keep latest 25 search history items, unique by wordId
  const filtered = profile.history.filter(h => h.wordId !== item.wordId);
  const updatedHistory = [newHistoryItem, ...filtered].slice(0, 25);

  const updated: UserProfile = {
    ...profile,
    history: updatedHistory
  };

  saveUserProfile(updated);
  return updated;
}
