import { Badge } from '../types';

export const BADGE_DATABASE: Badge[] = [
  {
    id: 'badge-1',
    title: 'Pemula Nusantara',
    description: 'Mulai menjelajah dan mempelajari kosakata bahasa daerah pertamamu.',
    iconName: 'Compass',
    category: 'learning',
    requiredXp: 0,
    unlockedAt: '2026-07-28'
  },
  {
    id: 'badge-2',
    title: 'Penjelajah Bahasa',
    description: 'Mencapai 100 XP dan mempelajari minimal 3 bahasa daerah berbeda.',
    iconName: 'MapPin',
    category: 'learning',
    requiredXp: 100
  },
  {
    id: 'badge-3',
    title: 'Ahli Nusantara',
    description: 'Mengumpulkan 500 XP dan menguasai lebih dari 20 kosakata regional.',
    iconName: 'Award',
    category: 'mastery',
    requiredXp: 500
  },
  {
    id: 'badge-4',
    title: 'Master Bahasa',
    description: 'Mencapai 1000 XP dan menyelesaikan semua kuis tingkat Hard.',
    iconName: 'Crown',
    category: 'mastery',
    requiredXp: 1000
  },
  {
    id: 'badge-5',
    title: 'Juara Kuis',
    description: 'Menyelesaikan 5 kuis bahasa daerah dengan nilai sempurna.',
    iconName: 'Zap',
    category: 'quiz',
    requiredXp: 250
  },
  {
    id: 'badge-6',
    title: '7 Hari Rajin',
    description: 'Belajar dan membuka aplikasi selama 7 hari berturut-turut.',
    iconName: 'CalendarCheck',
    category: 'streak',
    requiredXp: 200
  }
];
