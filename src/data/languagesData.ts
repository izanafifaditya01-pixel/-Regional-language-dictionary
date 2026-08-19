import { Language, Category } from '../types';

export const LANGUAGES_DATA: Language[] = [
  {
    id: 'ind',
    code: 'id',
    name: 'Bahasa Indonesia',
    nativeName: 'Bahasa Indonesia',
    province: 'Nasional',
    island: 'Indonesia',
    speakerCount: '270 Juta+',
    flagEmoji: '🇮🇩',
    accentColor: 'from-red-500 to-rose-600',
    description: 'Bahasa persatuan Republik Indonesia.'
  },
  {
    id: 'bug',
    code: 'bug',
    name: 'Bahasa Bugis',
    nativeName: 'Basa Ugi',
    province: 'Sulawesi Selatan',
    island: 'Sulawesi',
    speakerCount: '5 Juta+',
    flagEmoji: '⛵',
    accentColor: 'from-emerald-500 to-teal-700',
    description: 'Bahasa daerah yang dituturkan oleh suku Bugis di Sulawesi Selatan dengan aksara lontara.'
  },
  {
    id: 'mak',
    code: 'mak',
    name: 'Bahasa Makassar',
    nativeName: 'Basa Mangkasara',
    province: 'Sulawesi Selatan',
    island: 'Sulawesi',
    speakerCount: '2.5 Juta+',
    flagEmoji: '🏰',
    accentColor: 'from-amber-500 to-orange-600',
    description: 'Bahasa daerah yang dituturkan di wilayah Makassar, Gowa, Takalar, Jeneponto, dan Bantaeng.'
  },
  {
    id: 'jav',
    code: 'jv',
    name: 'Bahasa Jawa',
    nativeName: 'Basa Jawa',
    province: 'Jawa Tengah, Jatim, DIY',
    island: 'Jawa',
    speakerCount: '80 Juta+',
    flagEmoji: '👑',
    accentColor: 'from-blue-600 to-indigo-700',
    description: 'Bahasa daerah dengan penutur terbanyak di Indonesia, memiliki tingkatan tutur (Ngoko, Krama).'
  },
  {
    id: 'sun',
    code: 'su',
    name: 'Bahasa Sunda',
    nativeName: 'Basa Sunda',
    province: 'Jawa Barat & Banten',
    island: 'Jawa',
    speakerCount: '42 Juta+',
    flagEmoji: '⛰️',
    accentColor: 'from-teal-500 to-emerald-600',
    description: 'Bahasa daerah berirama lembut khas masyarakat Tatar Pasundan Jawa Barat.'
  },
  {
    id: 'ban',
    code: 'ban',
    name: 'Bahasa Bali',
    nativeName: 'Basa Bali',
    province: 'Bali',
    island: 'Bali',
    speakerCount: '3.3 Juta+',
    flagEmoji: '🌺',
    accentColor: 'from-orange-500 to-rose-500',
    description: 'Bahasa pulau Dewata yang memiliki kekayaan kosakata budaya, keagamaan, dan tradisi.'
  },
  {
    id: 'min',
    code: 'min',
    name: 'Bahasa Minangkabau',
    nativeName: 'Baso Minang',
    province: 'Sumatera Barat',
    island: 'Sumatera',
    speakerCount: '6.5 Juta+',
    flagEmoji: '🏡',
    accentColor: 'from-red-600 to-amber-600',
    description: 'Bahasa khas Ranah Minang yang kaya akan pepatah, pantun, dan ungkapan bijak.'
  },
  {
    id: 'ace',
    code: 'ace',
    name: 'Bahasa Aceh',
    nativeName: 'Basa Acèh',
    province: 'Aceh',
    island: 'Sumatera',
    speakerCount: '3.5 Juta+',
    flagEmoji: '🕌',
    accentColor: 'from-emerald-600 to-green-700',
    description: 'Bahasa khas Serambi Mekkah yang termasuk dalam rumpun bahasa Melayu-Polinesia.'
  },
  {
    id: 'btk',
    code: 'btk',
    name: 'Bahasa Batak Toba',
    nativeName: 'Hata Batak',
    province: 'Sumatera Utara',
    island: 'Sumatera',
    speakerCount: '2 Juta+',
    flagEmoji: '🏔️',
    accentColor: 'from-slate-700 to-zinc-800',
    description: 'Bahasa daerah sekitar Danau Toba dengan keunikan intonasi yang tegas dan hangat.'
  },
  {
    id: 'sas',
    code: 'sas',
    name: 'Bahasa Sasak',
    nativeName: 'Base Sasak',
    province: 'Nusa Tenggara Barat',
    island: 'Nusa Tenggara',
    speakerCount: '2.7 Juta+',
    flagEmoji: '🌴',
    accentColor: 'from-cyan-600 to-blue-700',
    description: 'Bahasa khas penduduk pulau Lombok dengan beragam dialek wilayah.'
  },
  {
    id: 'bjn',
    code: 'bjn',
    name: 'Bahasa Banjar',
    nativeName: 'Basa Banjar',
    province: 'Kalimantan Selatan',
    island: 'Kalimantan',
    speakerCount: '3.5 Juta+',
    flagEmoji: '🛶',
    accentColor: 'from-amber-600 to-yellow-600',
    description: 'Bahasa lingua franca di Kalimantan Selatan yang hangat dan ekspresif.'
  },
  {
    id: 'dyn',
    code: 'dyn',
    name: 'Bahasa Dayak Ngaju',
    nativeName: 'Basa Dayak',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    speakerCount: '1 Juta+',
    flagEmoji: '🦅',
    accentColor: 'from-emerald-700 to-teal-800',
    description: 'Bahasa daerah suku Dayak di Kalimantan Tengah yang kaya akan kearifan lokal pedalaman.'
  },
  {
    id: 'mad',
    code: 'mad',
    name: 'Bahasa Madura',
    nativeName: 'Basa Madhurâ',
    province: 'Jawa Timur (Madura)',
    island: 'Jawa',
    speakerCount: '6.8 Juta+',
    flagEmoji: '🐂',
    accentColor: 'from-red-700 to-red-900',
    description: 'Bahasa yang dinamis khas pulau Madura dan kawasan Tapak Kuda Jawa Timur.'
  },
  {
    id: 'tor',
    code: 'tor',
    name: 'Bahasa Toraja',
    nativeName: 'Basa Toraja',
    province: 'Sulawesi Selatan',
    island: 'Sulawesi',
    speakerCount: '750 Ribu+',
    flagEmoji: '🏛️',
    accentColor: 'from-amber-700 to-stone-800',
    description: 'Bahasa khas pegunungan Tana Toraja yang sarat nilai filosofi arsitektur Tongkonan.'
  },
  {
    id: 'gor',
    code: 'gor',
    name: 'Bahasa Gorontalo',
    nativeName: 'Bahasa Hulontalo',
    province: 'Gorontalo',
    island: 'Sulawesi',
    speakerCount: '1 Juta+',
    flagEmoji: '🌊',
    accentColor: 'from-teal-600 to-cyan-700',
    description: 'Bahasa daerah pesisir utara Sulawesi yang unik dan melodius.'
  },
  {
    id: 'tk',
    code: 'tk',
    name: 'Bahasa Tolaki',
    nativeName: 'Basa Tolaki',
    province: 'Sulawesi Tenggara',
    island: 'Sulawesi',
    speakerCount: '500 Ribu+',
    flagEmoji: '🌿',
    accentColor: 'from-green-600 to-emerald-700',
    description: 'Bahasa daerah suku Tolaki di Kendari dan sekitarnya.'
  },
  {
    id: 'btn',
    code: 'btn',
    name: 'Bahasa Buton',
    nativeName: 'Bahasa Wolio',
    province: 'Sulawesi Tenggara',
    island: 'Sulawesi',
    speakerCount: '400 Ribu+',
    flagEmoji: '⛵',
    accentColor: 'from-blue-700 to-indigo-800',
    description: 'Bahasa bersejarah Kesultanan Buton dengan naskah kuno Wolio.'
  }
];

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'Keluarga',
    name: 'Keluarga & Kekerabatan',
    iconName: 'Users',
    description: 'Panggilan orang tua, saudara, kakek, nenek, dan sanak kerabat.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'Makanan',
    name: 'Makanan & Minuman',
    iconName: 'Utensils',
    description: 'Nama santapan khas, bahan masakan, rasa, dan aktivitas makan.',
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'Hewan',
    name: 'Hewan & Satwa',
    iconName: 'Dog',
    description: 'Nama-nama binatang liar, ternak, dan unggas lokal.',
    color: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  {
    id: 'Angka',
    name: 'Angka & Bilangan',
    iconName: 'Hash',
    description: 'Penomoran, hitungan dasar, pecahan, dan urutan.',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'Warna',
    name: 'Warna & Rupa',
    iconName: 'Palette',
    description: 'Sebutan warna dasar dan corak khas daerah.',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'Alam',
    name: 'Alam & Cuaca',
    iconName: 'Sun',
    description: 'Gunung, laut, sungai, hujan, angin, dan cuaca.',
    color: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'Profesi',
    name: 'Profesi & Pekerjaan',
    iconName: 'Briefcase',
    description: 'Petani, nelayan, guru, pedagang, dan profesi tradisional.',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'Salam',
    name: 'Salam & Ungkapan',
    iconName: 'MessageSquare',
    description: 'Tegur sapa, ucapan selamat, terima kasih, dan adab santun.',
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'Tubuh',
    name: 'Tubuh & Anggota Badan',
    iconName: 'Activity',
    description: 'Kepala, mata, tangan, kaki, dan pancaindra.',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 'Sekolah',
    name: 'Sekolah & Belajar',
    iconName: 'BookOpen',
    description: 'Buku, ilmu, baca, tulis, sekolah, dan aktivitas belajar.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
];
