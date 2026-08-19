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
    description: 'Bahasa persatuan dan bahasa resmi Negara Kesatuan Republik Indonesia.'
  },

  // ==========================================
  // PULAU SUMATERA (10 PROVINSI)
  // ==========================================
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
    id: 'gay',
    code: 'gay',
    name: 'Bahasa Gayo',
    nativeName: 'Basa Gayo',
    province: 'Aceh (Dataran Tinggi Gayo)',
    island: 'Sumatera',
    speakerCount: '300 Ribu+',
    flagEmoji: '☕',
    accentColor: 'from-amber-700 to-yellow-800',
    description: 'Bahasa suku Gayo di pegunungan Aceh Tengah, Bener Meriah, dan Gayo Lues.'
  },
  {
    id: 'btk',
    code: 'btk',
    name: 'Bahasa Batak Toba',
    nativeName: 'Hata Batak',
    province: 'Sumatera Utara',
    island: 'Sumatera',
    speakerCount: '2.5 Juta+',
    flagEmoji: '🏔️',
    accentColor: 'from-slate-700 to-zinc-800',
    description: 'Bahasa daerah sekitar Danau Toba dengan keunikan intonasi yang tegas, kaya filosofi Dalihan Na Tolu.'
  },
  {
    id: 'nia',
    code: 'nia',
    name: 'Bahasa Nias',
    nativeName: 'Li Niha',
    province: 'Sumatera Utara (Kepulauan Nias)',
    island: 'Sumatera',
    speakerCount: '800 Ribu+',
    flagEmoji: '🗿',
    accentColor: 'from-blue-700 to-slate-800',
    description: 'Bahasa kepulauan Nias yang kaya akan tradisi megalitikum dan tradisi lompat batu (Hombo Batu).'
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
    description: 'Bahasa khas Ranah Minang yang kaya akan pepatah petitih, pantun, dan kearifan falsafah alam.'
  },
  {
    id: 'ria',
    code: 'ria',
    name: 'Bahasa Melayu Riau',
    nativeName: 'Bahasa Melayu Riau',
    province: 'Riau',
    island: 'Sumatera',
    speakerCount: '3 Juta+',
    flagEmoji: '📜',
    accentColor: 'from-yellow-600 to-amber-700',
    description: 'Akar historis bahasa Melayu standar yang menjadi cikal bakal Bahasa Indonesia di Semenanjung Siak dan Indragiri.'
  },
  {
    id: 'kri',
    code: 'kri',
    name: 'Bahasa Melayu Kepulauan Riau',
    nativeName: 'Bahase Melayu Kepri',
    province: 'Kepulauan Riau',
    island: 'Sumatera',
    speakerCount: '1.5 Juta+',
    flagEmoji: '⚓',
    accentColor: 'from-cyan-600 to-teal-700',
    description: 'Bahasa pesisir Kepri, pusat sastra Gurindam Dua Belas karya Raja Ali Haji di Pulau Penyengat.'
  },
  {
    id: 'jmb',
    code: 'jmb',
    name: 'Bahasa Melayu Jambi',
    nativeName: 'Baso Jambi',
    province: 'Jambi',
    island: 'Sumatera',
    speakerCount: '2.5 Juta+',
    flagEmoji: '🛶',
    accentColor: 'from-orange-600 to-amber-700',
    description: 'Bahasa daerah di sepanjang Daerah Aliran Sungai Batanghari dengan dialek vokal "o" yang khas.'
  },
  {
    id: 'plb',
    code: 'plb',
    name: 'Bahasa Palembang',
    nativeName: 'Baso Pelembang',
    province: 'Sumatera Selatan',
    island: 'Sumatera',
    speakerCount: '4 Juta+',
    flagEmoji: '🌉',
    accentColor: 'from-red-600 to-rose-700',
    description: 'Bahasa khas tepian Sungai Musi dan Kesultanan Palembang Darussalam berakhiran vokal "o".'
  },
  {
    id: 'rej',
    code: 'rej',
    name: 'Bahasa Rejang',
    nativeName: 'Baso Jang',
    province: 'Bengkulu',
    island: 'Sumatera',
    speakerCount: '1 Juta+',
    flagEmoji: '🌺',
    accentColor: 'from-rose-600 to-pink-700',
    description: 'Bahasa kuno suku Rejang di Bengkulu yang memiliki aksara tradisional Kaganga.'
  },
  {
    id: 'lmp',
    code: 'lmp',
    name: 'Bahasa Lampung',
    nativeName: 'Bahasa Lappung',
    province: 'Lampung',
    island: 'Sumatera',
    speakerCount: '2 Juta+',
    flagEmoji: '🐘',
    accentColor: 'from-amber-600 to-yellow-700',
    description: 'Bahasa suku Lampung dengan dua dialek utama (Dialek Api dan Nyow) serta aksara Had Lampung.'
  },
  {
    id: 'bgk',
    code: 'bgk',
    name: 'Bahasa Melayu Bangka Belitung',
    nativeName: 'Bahaso Bangka',
    province: 'Kepulauan Bangka Belitung',
    island: 'Sumatera',
    speakerCount: '1.2 Juta+',
    flagEmoji: '🏖️',
    accentColor: 'from-teal-600 to-blue-600',
    description: 'Bahasa Melayu kepulauan timah dengan akulturasi budaya Melayu dan Tionghoa Hakka.'
  },

  // ==========================================
  // PULAU JAWA (6 PROVINSI)
  // ==========================================
  {
    id: 'btw',
    code: 'btw',
    name: 'Bahasa Betawi',
    nativeName: 'Bahasa Betawi',
    province: 'DKI Jakarta',
    island: 'Jawa',
    speakerCount: '5 Juta+',
    flagEmoji: '🎭',
    accentColor: 'from-orange-500 to-red-600',
    description: 'Bahasa khas warga Jakarta berdialek santai, ekspresif, dan berakhiran "é" yang hangat.'
  },
  {
    id: 'sun',
    code: 'su',
    name: 'Bahasa Sunda',
    nativeName: 'Basa Sunda',
    province: 'Jawa Barat',
    island: 'Jawa',
    speakerCount: '42 Juta+',
    flagEmoji: '⛰️',
    accentColor: 'from-teal-500 to-emerald-600',
    description: 'Bahasa daerah berirama lembut khas masyarakat Tatar Pasundan Jawa Barat dengan undak-usuk basa.'
  },
  {
    id: 'snb',
    code: 'snb',
    name: 'Bahasa Sunda Banten & Baduy',
    nativeName: 'Basa Sunda Banten',
    province: 'Banten',
    island: 'Jawa',
    speakerCount: '4 Juta+',
    flagEmoji: '🦏',
    accentColor: 'from-emerald-700 to-teal-800',
    description: 'Dialek Sunda arkais khas tanah Jawara Banten dan masyarakat adat Kanekes (Baduy).'
  },
  {
    id: 'jav',
    code: 'jv',
    name: 'Bahasa Jawa',
    nativeName: 'Basa Jawa',
    province: 'Jawa Tengah',
    island: 'Jawa',
    speakerCount: '80 Juta+',
    flagEmoji: '👑',
    accentColor: 'from-blue-600 to-indigo-700',
    description: 'Bahasa daerah dengan penutur terbanyak di Indonesia, memiliki tingkatan tutur (Ngoko, Madya, Krama Inggil).'
  },
  {
    id: 'jyg',
    code: 'jyg',
    name: 'Bahasa Jawa Ngayogyakarta',
    nativeName: 'Basa Jawa Mataraman',
    province: 'DI Yogyakarta',
    island: 'Jawa',
    speakerCount: '3.8 Juta+',
    flagEmoji: '🏰',
    accentColor: 'from-amber-600 to-orange-700',
    description: 'Dialek Jawa Mataraman Kraton yang sangat halus dan menjunjung tinggi unggah-ungguh kesantunan.'
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
    description: 'Bahasa yang dinamis dan berenergi khas pulau Madura dan kawasan Tapak Kuda Jawa Timur.'
  },
  {
    id: 'osg',
    code: 'osg',
    name: 'Bahasa Osing',
    nativeName: 'Basa Osing',
    province: 'Jawa Timur (Banyuwangi)',
    island: 'Jawa',
    speakerCount: '500 Ribu+',
    flagEmoji: '🌄',
    accentColor: 'from-indigo-600 to-purple-700',
    description: 'Bahasa asli suku Osing di ujung timur pulau Jawa (Banyuwangi) warisan Kerajaan Blambangan.'
  },

  // ==========================================
  // BALI & NUSA TENGGARA (3 PROVINSI)
  // ==========================================
  {
    id: 'ban',
    code: 'ban',
    name: 'Bahasa Bali',
    nativeName: 'Basa Bali',
    province: 'Bali',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '3.3 Juta+',
    flagEmoji: '🌺',
    accentColor: 'from-orange-500 to-rose-500',
    description: 'Bahasa pulau Dewata yang memiliki kekayaan kosakata budaya, aksara Bali, dan tata krama Singgih-Sor.'
  },
  {
    id: 'sas',
    code: 'sas',
    name: 'Bahasa Sasak',
    nativeName: 'Base Sasak',
    province: 'Nusa Tenggara Barat (Lombok)',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '2.7 Juta+',
    flagEmoji: '🌴',
    accentColor: 'from-cyan-600 to-blue-700',
    description: 'Bahasa khas penduduk pulau Lombok dengan beragam dialek (Meno-Mene, Ngeno-Ngene).'
  },
  {
    id: 'smw',
    code: 'smw',
    name: 'Bahasa Sumbawa (Samawa)',
    nativeName: 'Basa Samawa',
    province: 'Nusa Tenggara Barat (Sumbawa)',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '500 Ribu+',
    flagEmoji: '🐎',
    accentColor: 'from-yellow-600 to-amber-700',
    description: 'Bahasa suku Samawa di bagian barat Pulau Sumbawa yang akrab dan puitis.'
  },
  {
    id: 'mbo',
    code: 'mbo',
    name: 'Bahasa Bima (Mbojo)',
    nativeName: 'Nggahi Mbojo',
    province: 'Nusa Tenggara Barat (Bima & Dompu)',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '600 Ribu+',
    flagEmoji: '🌾',
    accentColor: 'from-emerald-600 to-teal-700',
    description: 'Bahasa suku Mbojo di wilayah Bima dan Dompu di bagian timur Pulau Sumbawa.'
  },
  {
    id: 'mgr',
    code: 'mgr',
    name: 'Bahasa Manggarai',
    nativeName: 'Bahasa Manggarai',
    province: 'Nusa Tenggara Timur (Flores)',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '700 Ribu+',
    flagEmoji: '🐉',
    accentColor: 'from-emerald-700 to-green-800',
    description: 'Bahasa daerah di Flores Barat (Manggarai, Komodo, Labuan Bajo) yang kaya sastra lisan Goet.'
  },
  {
    id: 'dwn',
    code: 'dwn',
    name: 'Bahasa Dawan (Uab Meto)',
    nativeName: 'Uab Meto',
    province: 'Nusa Tenggara Timur (Timor)',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '900 Ribu+',
    flagEmoji: '🏜️',
    accentColor: 'from-amber-700 to-stone-800',
    description: 'Bahasa asli suku Atoni Pah Meto di daratan Pulau Timor bagian barat.'
  },
  {
    id: 'rot',
    code: 'rot',
    name: 'Bahasa Rote',
    nativeName: 'Li Rote',
    province: 'Nusa Tenggara Timur (Rote Ndao)',
    island: 'Bali & Nusa Tenggara',
    speakerCount: '150 Ribu+',
    flagEmoji: '🎻',
    accentColor: 'from-sky-600 to-blue-700',
    description: 'Bahasa pulau terselatan Indonesia, tempat lahirnya alat musik tradisional Sasando.'
  },

  // ==========================================
  // PULAU KALIMANTAN (5 PROVINSI)
  // ==========================================
  {
    id: 'kyn',
    code: 'kyn',
    name: 'Bahasa Dayak Kanayatn',
    nativeName: 'Bahasa Kanayatn',
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    speakerCount: '600 Ribu+',
    flagEmoji: '🌳',
    accentColor: 'from-green-700 to-emerald-800',
    description: 'Bahasa suku Dayak Kanayatn di wilayah Landak, Mempawah, Bengkayang, dan Kubu Raya.'
  },
  {
    id: 'dyn',
    code: 'dyn',
    name: 'Bahasa Dayak Ngaju',
    nativeName: 'Basa Dayak Ngaju',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    speakerCount: '1 Juta+',
    flagEmoji: '🦅',
    accentColor: 'from-emerald-700 to-teal-800',
    description: 'Bahasa Dayak di sepanjang Sungai Kahayan dan Kapuas yang kaya akan kearifan Kaharingan.'
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
    description: 'Bahasa lingua franca di Kalimantan Selatan yang hangat, ekspresif, dan kaya kosakata pasar terapung.'
  },
  {
    id: 'kut',
    code: 'kut',
    name: 'Bahasa Kutai',
    nativeName: 'Bahasa Kutai',
    province: 'Kalimantan Timur (IKN)',
    island: 'Kalimantan',
    speakerCount: '400 Ribu+',
    flagEmoji: '👑',
    accentColor: 'from-orange-600 to-amber-700',
    description: 'Bahasa Kesultanan Kutai Kartanegara di sepanjang Sungai Mahakam dan kawasan IKN Nusantara.'
  },
  {
    id: 'tdg',
    code: 'tdg',
    name: 'Bahasa Tidung',
    nativeName: 'Bahasa Tidung',
    province: 'Kalimantan Utara',
    island: 'Kalimantan',
    speakerCount: '150 Ribu+',
    flagEmoji: '🛶',
    accentColor: 'from-teal-600 to-cyan-700',
    description: 'Bahasa suku Tidung di wilayah Tarakan, Nunukan, dan Malinau perbatasan Kalimantan Utara.'
  },

  // ==========================================
  // PULAU SULAWESI (6 PROVINSI)
  // ==========================================
  {
    id: 'mdo',
    code: 'mdo',
    name: 'Bahasa Manado',
    nativeName: 'Bahasa Melayu Manado',
    province: 'Sulawesi Utara',
    island: 'Sulawesi',
    speakerCount: '2 Juta+',
    flagEmoji: '🌋',
    accentColor: 'from-red-500 to-orange-600',
    description: 'Bahasa pergaulan di Minahasa dan Manado yang ceria dengan ungkapan "Torang Samua Basudara".'
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
    description: 'Bahasa daerah pesisir utara Teluk Tomini yang memiliki struktur gramatika berirama puitis.'
  },
  {
    id: 'kli',
    code: 'kli',
    name: 'Bahasa Kaili',
    nativeName: 'Basa Kaili (Ledo)',
    province: 'Sulawesi Tengah',
    island: 'Sulawesi',
    speakerCount: '450 Ribu+',
    flagEmoji: '🌿',
    accentColor: 'from-green-600 to-teal-700',
    description: 'Bahasa suku Kaili di Lembah Palu, Donggala, dan Sigi dengan dialek Ledo, Tara, dan Rai.'
  },
  {
    id: 'mdr',
    code: 'mdr',
    name: 'Bahasa Mandar',
    nativeName: 'Basa Mande',
    province: 'Sulawesi Barat',
    island: 'Sulawesi',
    speakerCount: '500 Ribu+',
    flagEmoji: '⛵',
    accentColor: 'from-blue-600 to-cyan-700',
    description: 'Bahasa suku pelaut ulung Mandar pembuat perahu Sandeq di pesisir Sulawesi Barat.'
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
    description: 'Bahasa suku Bugis di Sulawesi Selatan dengan warisan naskah epik terpanjang I La Galigo dan aksara Lontara.'
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
    description: 'Bahasa daerah pesisir barat daya Sulawesi Selatan dengan partikel penegas seperti "ji", "ki", "mi".'
  },
  {
    id: 'tor',
    code: 'tor',
    name: 'Bahasa Toraja',
    nativeName: 'Basa Toraja',
    province: 'Sulawesi Selatan (Tana Toraja)',
    island: 'Sulawesi',
    speakerCount: '750 Ribu+',
    flagEmoji: '🏛️',
    accentColor: 'from-amber-700 to-stone-800',
    description: 'Bahasa khas pegunungan Tana Toraja yang sarat nilai filosofi arsitektur Rumah Tongkonan dan adat Rambu Solo.'
  },
  {
    id: 'tk',
    code: 'tk',
    name: 'Bahasa Tolaki',
    nativeName: 'Basa Tolaki',
    province: 'Sulawesi Tenggara (Kendari)',
    island: 'Sulawesi',
    speakerCount: '500 Ribu+',
    flagEmoji: '🌾',
    accentColor: 'from-green-600 to-emerald-700',
    description: 'Bahasa suku Tolaki di Kendari dan Konawe dengan tradisi adat tarian Lulo dan filosofi Kalosara.'
  },
  {
    id: 'btn',
    code: 'btn',
    name: 'Bahasa Buton (Wolio)',
    nativeName: 'Bahasa Wolio',
    province: 'Sulawesi Tenggara (Bau-Bau)',
    island: 'Sulawesi',
    speakerCount: '400 Ribu+',
    flagEmoji: '🏰',
    accentColor: 'from-blue-700 to-indigo-800',
    description: 'Bahasa resmi Kesultanan Buton dengan naskah kuno beraksara Buri Wolio.'
  },

  // ==========================================
  // KEPULAUAN MALUKU (2 PROVINSI)
  // ==========================================
  {
    id: 'amb',
    code: 'amb',
    name: 'Bahasa Melayu Ambon',
    nativeName: 'Bahasa Ambon',
    province: 'Maluku',
    island: 'Maluku',
    speakerCount: '1.5 Juta+',
    flagEmoji: '🌴',
    accentColor: 'from-cyan-600 to-blue-700',
    description: 'Bahasa kepulauan rempah Ambon Manise yang berirama musikal dan penuh kehangatan persaudaraan Pela Gandong.'
  },
  {
    id: 'ter',
    code: 'ter',
    name: 'Bahasa Ternate',
    nativeName: 'Bahasa Ternate',
    province: 'Maluku Utara',
    island: 'Maluku',
    speakerCount: '250 Ribu+',
    flagEmoji: '🌋',
    accentColor: 'from-amber-600 to-red-700',
    description: 'Bahasa bersejarah Kesultanan Ternate di bawah bayang-bayang Gunung Gamalama yang berakar Papua non-Austronesia.'
  },

  // ==========================================
  // PULAU PAPUA (6 PROVINSI PEMEKARAN)
  // ==========================================
  {
    id: 'pap',
    code: 'pap',
    name: 'Bahasa Melayu Papua',
    nativeName: 'Bahasa Papua',
    province: 'Papua (Jayapura)',
    island: 'Papua',
    speakerCount: '1.5 Juta+',
    flagEmoji: '🦜',
    accentColor: 'from-emerald-600 to-teal-700',
    description: 'Bahasa pergaulan umum di tanah Papua dengan ciri khas partikel "ka", "sa", "kamu/dong" yang bersahabat.'
  },
  {
    id: 'byk',
    code: 'byk',
    name: 'Bahasa Biak',
    nativeName: 'Basa Byak',
    province: 'Papua (Kepulauan Biak Numfor)',
    island: 'Papua',
    speakerCount: '120 Ribu+',
    flagEmoji: '⛵',
    accentColor: 'from-blue-600 to-indigo-700',
    description: 'Bahasa suku pelaut Biak di Teluk Cenderawasih yang kaya cerita rakyat Wor dan Manseren Koreri.'
  },
  {
    id: 'myb',
    code: 'myb',
    name: 'Bahasa Maybrat',
    nativeName: 'Bahasa Maybrat',
    province: 'Papua Barat (Manokwari & Pegaf)',
    island: 'Papua',
    speakerCount: '40 Ribu+',
    flagEmoji: '🌿',
    accentColor: 'from-teal-700 to-green-800',
    description: 'Bahasa suku Maybrat di kawasan Danau Ayamaru dan kepala burung Papua Barat.'
  },
  {
    id: 'moi',
    code: 'moi',
    name: 'Bahasa Moi',
    nativeName: 'Bahasa Moi Sorong',
    province: 'Papua Barat Daya (Sorong & Raja Ampat)',
    island: 'Papua',
    speakerCount: '30 Ribu+',
    flagEmoji: '🐠',
    accentColor: 'from-cyan-600 to-emerald-700',
    description: 'Bahasa suku asli Moi sebagai penjaga tanah malamoi di Sorong dan pintu gerbang Raja Ampat.'
  },
  {
    id: 'mee',
    code: 'mee',
    name: 'Bahasa Mee (Ekari)',
    nativeName: 'Bahasa Mee',
    province: 'Papua Tengah (Nabire & Paniai)',
    island: 'Papua',
    speakerCount: '300 Ribu+',
    flagEmoji: '🏔️',
    accentColor: 'from-slate-700 to-emerald-800',
    description: 'Bahasa suku Mee di kawasan Danau Paniai dan pegunungan Papua Tengah.'
  },
  {
    id: 'dan',
    code: 'dan',
    name: 'Bahasa Dani (Hubula)',
    nativeName: 'Bahasa Hubula',
    province: 'Papua Pegunungan (Lembah Baliem/Wamena)',
    island: 'Papua',
    speakerCount: '350 Ribu+',
    flagEmoji: '🛖',
    accentColor: 'from-amber-700 to-stone-800',
    description: 'Bahasa suku Dani di Lembah Baliem Wamena berhawa sejuk dengan tradisi bakar batu dan rumah Honai.'
  },
  {
    id: 'mrd',
    code: 'mrd',
    name: 'Bahasa Marind',
    nativeName: 'Bahasa Marind-Anim',
    province: 'Papua Selatan (Merauke)',
    island: 'Papua',
    speakerCount: '25 Ribu+',
    flagEmoji: '🦌',
    accentColor: 'from-yellow-700 to-amber-800',
    description: 'Bahasa suku Marind di Merauke, ujung paling timur Indonesia di tepian Sungai Bian dan savana rusa.'
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
