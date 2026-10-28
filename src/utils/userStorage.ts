import { UserProfile, UserHistoryItem } from '../types';

const PROFILE_STORAGE_KEY = 'leksika_nusantara_user_profile_v2';
const REGISTERED_USERS_KEY = 'leksika_registered_learner_accounts_v1';

export interface RegisteredLearnerAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
  createdAt: string;
}

export const GUEST_USER_PROFILE: UserProfile = {
  name: 'Pembelajar Tamu',
  email: 'Mode Tamu (Belum Masuk Akun)',
  role: 'pengguna',
  isAuthenticated: false,
  xp: 120,
  level: 1,
  streak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  bookmarks: ['contrib-tk-1', 'contrib-mun-1', 'contrib-btn-1'],
  history: [
    {
      id: 'hist-tk-1',
      wordId: 'contrib-tk-1',
      word: 'Saling Menyayangi',
      translation: 'Mombeore-orei',
      sourceLangId: 'ind',
      targetLangId: 'tk',
      searchedAt: '09:30'
    },
    {
      id: 'hist-btn-1',
      wordId: 'contrib-btn-1',
      word: 'Pintu Gerbang Benteng',
      translation: 'Lawa',
      sourceLangId: 'ind',
      targetLangId: 'btn',
      searchedAt: '10:15'
    }
  ],
  badges: ['badge-1'],
  unlockedLanguages: ['tk', 'mor', 'mun', 'btn'],
  completedQuizzesCount: 1,
  wordsMasteredCount: 5
};

const DEFAULT_LEARNER_ACCOUNTS: RegisteredLearnerAccount[] = [
  {
    id: 'usr-001',
    name: 'Wa Ode Siti Rahmawati',
    email: 'pengguna@leksika.id',
    passwordHash: 'pengguna123',
    createdAt: '2026-08-01T08:00:00.000Z',
    profile: {
      name: 'Wa Ode Siti Rahmawati',
      email: 'pengguna@leksika.id',
      role: 'pengguna',
      isAuthenticated: true,
      xp: 340,
      level: 2,
      streak: 5,
      lastLoginDate: new Date().toISOString().split('T')[0],
      bookmarks: ['contrib-tk-1', 'contrib-mun-1', 'contrib-btn-1'],
      history: [
        {
          id: 'hist-mun-1',
          wordId: 'contrib-mun-1',
          word: 'Kain Tenun Muna',
          translation: 'Kamooru / Tenun Wuna',
          sourceLangId: 'ind',
          targetLangId: 'mun',
          searchedAt: '08:45'
        }
      ],
      badges: ['badge-1'],
      unlockedLanguages: ['tk', 'mor', 'mun', 'btn'],
      completedQuizzesCount: 4,
      wordsMasteredCount: 14
    }
  }
];

export function getRegisteredLearners(): RegisteredLearnerAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_LEARNER_ACCOUNTS));
      return DEFAULT_LEARNER_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LEARNER_ACCOUNTS;
  } catch {
    return DEFAULT_LEARNER_ACCOUNTS;
  }
}

function saveRegisteredLearners(accounts: RegisteredLearnerAccount[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save learner accounts:', e);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return GUEST_USER_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...GUEST_USER_PROFILE,
      ...parsed,
      role: 'pengguna'
    };
  } catch {
    return GUEST_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const normalized: UserProfile = {
      ...profile,
      role: 'pengguna'
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));

    // Sync back to registered account if logged in
    if (normalized.isAuthenticated && normalized.email) {
      const accounts = getRegisteredLearners();
      const idx = accounts.findIndex(a => a.email.toLowerCase() === normalized.email.toLowerCase());
      if (idx !== -1) {
        accounts[idx] = {
          ...accounts[idx],
          name: normalized.name,
          profile: normalized
        };
        saveRegisteredLearners(accounts);
      }
    }
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function authenticateLearner(
  email: string,
  password: string
): { success: boolean; message: string; profile?: UserProfile } {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getRegisteredLearners();
  const found = accounts.find(a => a.email.toLowerCase() === cleanEmail);

  if (!found || found.passwordHash !== password) {
    return {
      success: false,
      message: 'Email atau kata sandi akun pengguna tidak sesuai.'
    };
  }

  const activeProfile: UserProfile = {
    ...found.profile,
    name: found.name,
    email: found.email,
    role: 'pengguna',
    isAuthenticated: true,
    lastLoginDate: new Date().toISOString().split('T')[0]
  };

  saveUserProfile(activeProfile);
  return {
    success: true,
    message: `Selamat datang kembali, ${activeProfile.name}.`,
    profile: activeProfile
  };
}

export function registerLearner(
  name: string,
  email: string,
  password: string,
  currentGuestProfile?: UserProfile
): { success: boolean; message: string; profile?: UserProfile } {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanEmail || password.length < 6) {
    return {
      success: false,
      message: 'Lengkapi nama, email valid, dan kata sandi minimal 6 karakter.'
    };
  }

  const accounts = getRegisteredLearners();
  if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      message: 'Email tersebut sudah terdaftar pada akun pengguna lain. Silakan masuk.'
    };
  }

  const base = currentGuestProfile || GUEST_USER_PROFILE;
  const newProfile: UserProfile = {
    ...base,
    name: cleanName,
    email: cleanEmail,
    role: 'pengguna',
    isAuthenticated: true,
    lastLoginDate: new Date().toISOString().split('T')[0]
  };

  const newAccount: RegisteredLearnerAccount = {
    id: `usr-${Date.now().toString(36)}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: password,
    profile: newProfile,
    createdAt: new Date().toISOString()
  };

  saveRegisteredLearners([...accounts, newAccount]);
  saveUserProfile(newProfile);

  return {
    success: true,
    message: `Akun pembelajar ${cleanName} berhasil dibuat.`,
    profile: newProfile
  };
}

export function logoutLearner(): UserProfile {
  const guestCopy: UserProfile = {
    ...GUEST_USER_PROFILE,
    lastLoginDate: new Date().toISOString().split('T')[0]
  };
  saveUserProfile(guestCopy);
  return guestCopy;
}

export function addXpToProfile(
  profile: UserProfile,
  xpAmount: number
): { updatedProfile: UserProfile; leveledUp: boolean; newLevel: number } {
  const newXp = profile.xp + xpAmount;
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

  const filtered = profile.history.filter(h => h.wordId !== item.wordId);
  const updatedHistory = [newHistoryItem, ...filtered].slice(0, 25);

  const updated: UserProfile = {
    ...profile,
    history: updatedHistory
  };

  saveUserProfile(updated);
  return updated;
}

export function recordGameScoreInProfile(
  profile: UserProfile,
  gameId: string,
  score: number
): { updatedProfile: UserProfile; isNewHighScore: boolean } {
  const currentScores = profile.gameHighScores || {};
  const previousHigh = currentScores[gameId] || 0;
  const isNewHighScore = score > previousHigh;

  const newScores = {
    ...currentScores,
    [gameId]: Math.max(previousHigh, score)
  };

  const updatedProfile: UserProfile = {
    ...profile,
    gameHighScores: newScores
  };

  saveUserProfile(updatedProfile);
  return { updatedProfile, isNewHighScore };
}

export function recordWheelSpinInProfile(profile: UserProfile): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const updatedProfile: UserProfile = {
    ...profile,
    lastWheelSpinDate: today
  };
  saveUserProfile(updatedProfile);
  return updatedProfile;
}

export function claimDailyQuestInProfile(profile: UserProfile, questId: string): UserProfile {
  const currentClaimed = profile.claimedDailyQuests || [];
  if (currentClaimed.includes(questId)) return profile;

  const updatedProfile: UserProfile = {
    ...profile,
    claimedDailyQuests: [...currentClaimed, questId]
  };
  saveUserProfile(updatedProfile);
  return updatedProfile;
}
