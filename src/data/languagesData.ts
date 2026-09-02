import { Language, Category } from '../types';

export const LANGUAGES_DATA: Language[] = [
  {
    id: 'ind',
    code: 'id',
    name: 'Bahasa Indonesia',
    nativeName: 'Bahasa Indonesia',
    province: 'Nasional (Seluruh Indonesia)',
    island: 'Indonesia',
    speakerCount: '270 Juta+',
    flagEmoji: '🇮🇩',
    accentColor: 'from-red-500 to-rose-600',
    description: 'Bahasa persatuan dan bahasa resmi Negara Kesatuan Republik Indonesia sebagai jembatan komunikasi antar suku bangsa.'
  },
  {
    id: 'tk',
    code: 'tk',
    name: 'Bahasa Tolaki',
    nativeName: 'Basa Tolaki (Konawe / Mekongga)',
    province: 'Sulawesi Tenggara (Konawe, Kendari, Kolaka)',
    island: 'Sulawesi Tenggara',
    speakerCount: '500 Ribu+',
    flagEmoji: '🌾',
    accentColor: 'from-green-600 to-emerald-700',
    description: 'Bahasa suku Tolaki di Kendari, Konawe, dan Kolaka dengan tradisi tarian persahabatan Molulo, makanan khas Sinonggi, dan lambang adat Kalosara sebagai hukum pemersatu.'
  },
  {
    id: 'mrn',
    code: 'mrn',
    name: 'Bahasa Moronene',
    nativeName: 'Bahasa Moronene',
    province: 'Sulawesi Tenggara (Bombana & Kabaena)',
    island: 'Sulawesi Tenggara',
    speakerCount: '60 Ribu+',
    flagEmoji: '🌿',
    accentColor: 'from-emerald-600 to-teal-800',
    description: 'Bahasa suku asli tertua daratan jazirah Sulawesi Tenggara di Kabupaten Bombana dan Pulau Kabaena, kaya tradisi Tontou, kearifan hutan adat Kondehao, dan kuliner Tinutu.'
  },
  {
    id: 'mun',
    code: 'mun',
    name: 'Bahasa Muna',
    nativeName: 'Basa Wuna',
    province: 'Sulawesi Tenggara (Pulau Muna & Muna Barat)',
    island: 'Sulawesi Tenggara',
    speakerCount: '380 Ribu+',
    flagEmoji: '🪁',
    accentColor: 'from-cyan-600 to-blue-700',
    description: 'Bahasa masyarakat Pulau Muna (Suku Wuna) dengan warisan layang-layang tertua di dunia Kaghati Kolope, tenun tradisional Masalili, tradisi syukuran Kasambu, dan kuliner Kasoami.'
  },
  {
    id: 'btn',
    code: 'btn',
    name: 'Bahasa Buton',
    nativeName: 'Bahasa Wolio / Buton',
    province: 'Sulawesi Tenggara (Kota Baubau & Kepulauan Buton)',
    island: 'Sulawesi Tenggara',
    speakerCount: '450 Ribu+',
    flagEmoji: '🏰',
    accentColor: 'from-blue-700 to-indigo-800',
    description: 'Bahasa resmi Kesultanan Buton beraksara kuno Buri Wolio dengan benteng keraton terluas di dunia, kuliner sup Parende & Kasuami, serta falsafah luhur kemanusiaan Poma-maasiaka.'
  }
];

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'Salam',
    name: 'Salam & Ungkapan',
    iconName: 'MessageSquare',
    description: 'Tegur sapa, ucapan terima kasih, sapaan hangat, dan adab sopan santun.',
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'Kata Kerja',
    name: 'Kata Kerja & Aktivitas',
    iconName: 'Activity',
    description: 'Aktivitas harian: makan, minum, tidur, pergi, gotong royong, dan bekerja.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'Kata Sifat',
    name: 'Kata Sifat & Keadaan',
    iconName: 'Sparkles',
    description: 'Karakter, sifat, perasaan senang, indah, baik, dan kondisi fisik.',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'Keluarga',
    name: 'Keluarga & Kekerabatan',
    iconName: 'Users',
    description: 'Panggilan ayah, ibu, anak, kakek, nenek, saudara, dan sanak famili.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'Makanan',
    name: 'Makanan & Kuliner Khas',
    iconName: 'Utensils',
    description: 'Sinonggi, Kasuami, Kasoami, Tinutu, Parende, ikan bakar, dan rempah khas Sultra.',
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'Budaya & Tradisi',
    name: 'Budaya, Adat & Tradisi',
    iconName: 'Award',
    description: 'Kalosara, Molulo, Kaghati Kolope, Buri Wolio, tenun Wuna, dan kearifan leluhur.',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'Angka',
    name: 'Angka & Bilangan',
    iconName: 'Hash',
    description: 'Penomoran 1 hingga puluhan dalam 4 bahasa daerah Sultra.',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'Tubuh',
    name: 'Tubuh & Anggota Badan',
    iconName: 'Heart',
    description: 'Kepala, mata, telinga, tangan, kaki, dan pancaindra.',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 'Alam',
    name: 'Alam & Lingkungan',
    iconName: 'Sun',
    description: 'Laut, sungai, gunung, hujan, air, tanah, dan cuaca.',
    color: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'Hewan',
    name: 'Hewan & Satwa',
    iconName: 'Dog',
    description: 'Anoa, rusa, burung maleo, ikan, ayam, dan satwa endemik.',
    color: 'bg-teal-100 text-teal-800 border-teal-200'
  }
];
