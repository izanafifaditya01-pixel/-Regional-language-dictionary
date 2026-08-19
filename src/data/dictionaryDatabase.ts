import { WordEntry } from '../types';

export const DICTIONARY_DATABASE: WordEntry[] = [
  // --- BUGIS ---
  {
    id: 'bug-1',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Makan',
    translation: 'Manre',
    phonetic: 'man-reh',
    category: 'Kata Kerja',
    exampleSentence: 'Iyya manre ritu nasu manu.',
    exampleTranslation: 'Saya sedang makan masakan ayam.',
    culturalContext: 'Di Tanah Luwu dan Bone, mengajak makan ("Maimeng manre") adalah bentuk keramahan tinggi terhadap tamu.',
    synonyms: ['Nangro'],
    antonyms: ['Tengmanre'],
    isPopular: true,
    isWordOfTheDay: true
  },
  {
    id: 'bug-2',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Tidur',
    translation: 'Matinro',
    phonetic: 'ma-tin-ro',
    category: 'Kata Kerja',
    exampleSentence: 'Matinro ni ambokkue ri bola.',
    exampleTranslation: 'Ayah saya sudah tidur di rumah.',
    culturalContext: 'Waktu tidur siang di pedesaan Bugis biasa dilakukan setelah istirahat bertani.',
    synonyms: ['Makkeda matinro'],
    isPopular: true
  },
  {
    id: 'bug-3',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Rumah',
    translation: 'Bola',
    phonetic: 'bo-la',
    category: 'Tubuh & Bangunan',
    exampleSentence: 'Madingin ritu bola panggung suku Bugis.',
    exampleTranslation: 'Rumah panggung suku Bugis sangat sejuk.',
    culturalContext: 'Bola panggung Bugis dibangun berstruktur tiang kayu tanpa paku besi, tahan gempa.',
    synonyms: ['Saoraja (Rumah Adat Raja)'],
    isPopular: true
  },
  {
    id: 'bug-4',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Terima kasih',
    translation: 'Kurru Sumange',
    phonetic: 'kur-ru su-ma-ngeh',
    category: 'Salam',
    exampleSentence: 'Kurru sumange atas bantuan ta.',
    exampleTranslation: 'Terima kasih banyak atas bantuan Anda.',
    culturalContext: 'Makna harfiahnya adalah mendoakan keberkahan dan keteguhan semangat hidup bagi penerima.',
    synonyms: ['Tarima kasi'],
    isPopular: true
  },
  {
    id: 'bug-5',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Ayah',
    translation: 'Ambo',
    phonetic: 'am-bo',
    category: 'Keluarga',
    exampleSentence: 'Ambo lako ri tasi maenre bale.',
    exampleTranslation: 'Ayah pergi ke laut menangkap ikan.',
    culturalContext: 'Sebutan hormat untuk sosok kepala keluarga pembimbing.',
    synonyms: ['Ambo\''],
    antonyms: ['Indo']
  },
  {
    id: 'bug-6',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Ibu',
    translation: 'Indo',
    phonetic: 'in-do',
    category: 'Keluarga',
    exampleSentence: 'Indo masunggu nasu barobbo.',
    exampleTranslation: 'Ibu memasak bubur barobbo yang lezat.',
    culturalContext: 'Indo melambangkan kasih sayang dan kelembutan dalam keluarga Bugis.',
    synonyms: ['Indo\''],
    antonyms: ['Ambo']
  },
  {
    id: 'bug-7',
    sourceLangId: 'ind',
    targetLangId: 'bug',
    word: 'Satu',
    translation: 'Ceddik',
    phonetic: 'ced-dik',
    category: 'Angka',
    exampleSentence: 'Ceddik bale engka ri piring.',
    exampleTranslation: 'Ada satu ekor ikan di atas piring.',
    isPopular: false
  },

  // --- MAKASSAR ---
  {
    id: 'mak-1',
    sourceLangId: 'ind',
    targetLangId: 'mak',
    word: 'Makan',
    translation: 'Anre',
    phonetic: 'an-reh',
    category: 'Kata Kerja',
    exampleSentence: 'Kutaeng nga anre coto Mangkasara.',
    exampleTranslation: 'Saya ingin makan coto Makassar.',
    culturalContext: 'Anre adalah kosakata inti dalam bahasa Makassar, digunakan harian dalam berinteraksi.',
    synonyms: ['Ngapang'],
    isPopular: true
  },
  {
    id: 'mak-2',
    sourceLangId: 'ind',
    targetLangId: 'mak',
    word: 'Minum',
    translation: 'Inung',
    phonetic: 'i-nung',
    category: 'Kata Kerja',
    exampleSentence: 'Inung je\'ne erang sa\'ra.',
    exampleTranslation: 'Minumlah air jernih dingin ini.',
    isPopular: true
  },
  {
    id: 'mak-3',
    sourceLangId: 'ind',
    targetLangId: 'mak',
    word: 'Terima kasih',
    translation: 'Tarima Kasi',
    phonetic: 'ta-ri-ma ka-si',
    category: 'Salam',
    exampleSentence: 'Tarima kasi sari\'battangku.',
    exampleTranslation: 'Terima kasih saudaraku.',
    culturalContext: 'Sari\'battang berarti saudara sejiwa sepersaudaraan.',
    isPopular: true
  },
  {
    id: 'mak-4',
    sourceLangId: 'ind',
    targetLangId: 'mak',
    word: 'Cantik / Indah',
    translation: 'Baji\' / Ga’ga',
    phonetic: 'ba-ji / ga-ga',
    category: 'Warna',
    exampleSentence: 'Ga\'ga sekali lipa sabbe Makassar.',
    exampleTranslation: 'Sangat indah sarung sutra Makassar ini.',
    synonyms: ['Gowa ga\'ga']
  },

  // --- JAWA ---
  {
    id: 'jav-1',
    sourceLangId: 'ind',
    targetLangId: 'jav',
    word: 'Makan',
    translation: 'Dahar / Mangan',
    phonetic: 'da-har / ma-ngan',
    category: 'Kata Kerja',
    exampleSentence: 'Monggo dahar rumiyin ing pawon.',
    exampleTranslation: 'Silakan makan terlebih dahulu di dapur.',
    culturalContext: 'Gunakan "Dahar" untuk bahasa krama halus (menghormati orang tua) dan "Mangan" untuk tingkatan ngoko.',
    synonyms: ['Ndedel', 'Kembul'],
    isPopular: true
  },
  {
    id: 'jav-2',
    sourceLangId: 'ind',
    targetLangId: 'jav',
    word: 'Selamat Pagi',
    translation: 'Sugeng Enjang',
    phonetic: 'su-geng en-jang',
    category: 'Salam',
    exampleSentence: 'Sugeng enjang Bapak, pripun kabaripun?',
    exampleTranslation: 'Selamat pagi Bapak, bagaimana kabarnya?',
    culturalContext: 'Salam krama inggil yang santun digunakan kepada guru, sesepuh, dan kolega.',
    synonyms: ['Sugeng injing'],
    isPopular: true
  },
  {
    id: 'jav-3',
    sourceLangId: 'ind',
    targetLangId: 'jav',
    word: 'Terima kasih',
    translation: 'Matur Nuwun',
    phonetic: 'ma-tur nu-wun',
    category: 'Salam',
    exampleSentence: 'Matur nuwun sanget atas bantuanipun.',
    exampleTranslation: 'Terima kasih banyak atas bantuannya.',
    culturalContext: 'Diiringi dengan gesture menangkupkan tangan di dada sebagai tanda hormat.',
    synonyms: ['Nuwun'],
    isPopular: true
  },
  {
    id: 'jav-4',
    sourceLangId: 'ind',
    targetLangId: 'jav',
    word: 'Rumah',
    translation: 'Omah / Griya / Dalem',
    phonetic: 'o-mah / gri-yo / da-lem',
    category: 'Tubuh & Bangunan',
    exampleSentence: 'Pripun menawa tindak ing griya kula?',
    exampleTranslation: 'Bagaimana kalau mampir ke rumah saya?',
    culturalContext: 'Omah (Ngoko), Griya (Krama), Dalem (Krama Inggil santun).',
    isPopular: true
  },
  {
    id: 'jav-5',
    sourceLangId: 'ind',
    targetLangId: 'jav',
    word: 'Cantik',
    translation: 'Ayu',
    phonetic: 'a-yu',
    category: 'Warna',
    exampleSentence: 'Mbak kuwi katon ayu nganggo kebaya.',
    exampleTranslation: 'Mbak itu terlihat cantik memakai kebaya.',
    synonyms: ['Endah'],
    antonyms: ['Olo']
  },

  // --- SUNDA ---
  {
    id: 'sun-1',
    sourceLangId: 'ind',
    targetLangId: 'sun',
    word: 'Makan',
    translation: 'Tuang / Dahar',
    phonetic: 'tu-ang / da-har',
    category: 'Kata Kerja',
    exampleSentence: 'Mangga tuang heula di saung.',
    exampleTranslation: 'Silakan makan dulu di saung.',
    culturalContext: '"Tuang" untuk halus (sopan), "Dahar" untuk teman sebaya (loma).',
    synonyms: ['Neda'],
    isPopular: true
  },
  {
    id: 'sun-2',
    sourceLangId: 'ind',
    targetLangId: 'sun',
    word: 'Terima kasih',
    translation: 'Hatur Nuhun',
    phonetic: 'ha-tur nu-hun',
    category: 'Salam',
    exampleSentence: 'Hatur nuhun pisan parantos dibantos.',
    exampleTranslation: 'Terima kasih banyak sudah dibantu.',
    culturalContext: 'Hatur nuhun pisan mengekspresikan rasa syukur mendalam.',
    isPopular: true
  },
  {
    id: 'sun-3',
    sourceLangId: 'ind',
    targetLangId: 'sun',
    word: 'Selamat Datang',
    translation: 'Wilujeng Sumping',
    phonetic: 'wi-lu-jeng sum-ping',
    category: 'Salam',
    exampleSentence: 'Wilujeng sumping di Tatar Pasundan.',
    exampleTranslation: 'Selamat datang di tanah Sunda Pasundan.',
    isPopular: true
  },
  {
    id: 'sun-4',
    sourceLangId: 'ind',
    targetLangId: 'sun',
    word: 'Air',
    translation: 'Cai',
    phonetic: 'cha-i',
    category: 'Alam',
    exampleSentence: 'Nginum cai tiis dina gelas awi.',
    exampleTranslation: 'Minum air dingin di gelas bambu.',
    synonyms: ['Cai herang']
  },

  // --- BALI ---
  {
    id: 'ban-1',
    sourceLangId: 'ind',
    targetLangId: 'ban',
    word: 'Makan',
    translation: 'Neda / Madaar',
    phonetic: 'ne-da / ma-da-ar',
    category: 'Kata Kerja',
    exampleSentence: 'Durusang neda nasi campur Bali.',
    exampleTranslation: 'Silakan makan nasi campur Bali.',
    culturalContext: 'Sama seperti Jawa dan Sunda, Bali menggunakan bahasa halus (Alus) dan biasa (Biasa).',
    isPopular: true
  },
  {
    id: 'ban-2',
    sourceLangId: 'ind',
    targetLangId: 'ban',
    word: 'Selamat Pagi',
    translation: 'Om Swastyastu / Sugeng Semeng',
    phonetic: 'om swas-tyas-tu',
    category: 'Salam',
    exampleSentence: 'Om Swastyastu, punapi gatra?',
    exampleTranslation: 'Selamat pagi, bagaimana kabarnya?',
    culturalContext: 'Salam suci umat Hindu Bali dengan sikap panganjali (tangan mengatup di dada).',
    isPopular: true
  },
  {
    id: 'ban-3',
    sourceLangId: 'ind',
    targetLangId: 'ban',
    word: 'Terima kasih',
    translation: 'Suksma',
    phonetic: 'suks-ma',
    category: 'Salam',
    exampleSentence: 'Matur suksma atas kebaikan sampun kaicang.',
    exampleTranslation: 'Terima kasih banyak atas kebaikan yang diberikan.',
    isPopular: true
  },

  // --- MINANGKABAU ---
  {
    id: 'min-1',
    sourceLangId: 'ind',
    targetLangId: 'min',
    word: 'Makan',
    translation: 'Makan / Manggaleh',
    phonetic: 'ma-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Mari kito makan rendang randang Datuak.',
    exampleTranslation: 'Mari kita makan rendang masakan Datuak.',
    isPopular: true
  },
  {
    id: 'min-2',
    sourceLangId: 'ind',
    targetLangId: 'min',
    word: 'Terima kasih',
    translation: 'Tarimo Kasih',
    phonetic: 'ta-ri-mo ka-sih',
    category: 'Salam',
    exampleSentence: 'Tarimo kasih banyak uda jo uni.',
    exampleTranslation: 'Terima kasih banyak kakak laki-laki dan kakak perempuan.',
    isPopular: true
  },
  {
    id: 'min-3',
    sourceLangId: 'ind',
    targetLangId: 'min',
    word: 'Rumah',
    translation: 'Rumah Gadang',
    phonetic: 'ru-mah ga-dang',
    category: 'Tubuh & Bangunan',
    exampleSentence: 'Rumah gadang batanduk gonjong rancak bana.',
    exampleTranslation: 'Rumah adat Minang beratap gonjong sangat indah.',
    isPopular: true
  },

  // --- ACEH ---
  {
    id: 'ace-1',
    sourceLangId: 'ind',
    targetLangId: 'ace',
    word: 'Makan',
    translation: 'Pajoh',
    phonetic: 'pa-joh',
    category: 'Kata Kerja',
    exampleSentence: 'Geutanyoe pajoh bu sie itek.',
    exampleTranslation: 'Kita makan nasi dengan lauk gulai bebek.',
    isPopular: true
  },
  {
    id: 'ace-2',
    sourceLangId: 'ind',
    targetLangId: 'ace',
    word: 'Terima kasih',
    translation: 'Teureumong Gaseh',
    phonetic: 'teu-reu-mong ga-seh',
    category: 'Salam',
    exampleSentence: 'Teureumong gaseh lhee ateueh tulong Syedara.',
    exampleTranslation: 'Terima kasih banyak atas pertolongan Saudara.',
    isPopular: true
  },

  // --- BATAK TOBA ---
  {
    id: 'btk-1',
    sourceLangId: 'ind',
    targetLangId: 'btk',
    word: 'Makan',
    translation: 'Mangan',
    phonetic: 'ma-ngan',
    category: 'Kata Kerja',
    exampleSentence: 'Beta hita mangan dekke na niarsik.',
    exampleTranslation: 'Ayo kita makan ikan mas arsik.',
    isPopular: true
  },
  {
    id: 'btk-2',
    sourceLangId: 'ind',
    targetLangId: 'btk',
    word: 'Terima kasih / Horas',
    translation: 'Mauliate / Horas',
    phonetic: 'mau-li-a-te / ho-ras',
    category: 'Salam',
    exampleSentence: 'Mauliate godang amang doli.',
    exampleTranslation: 'Terima kasih banyak bapak tercinta.',
    culturalContext: 'Horas adalah seruan kehangatan, kebahagiaan, kesehatan, dan rasa bersyukur.',
    isPopular: true
  },

  // --- BANJAR ---
  {
    id: 'bjn-1',
    sourceLangId: 'ind',
    targetLangId: 'bjn',
    word: 'Makan',
    translation: 'Makam / Makan',
    phonetic: 'ma-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Kawa lah nyawa makan soto Banjar?',
    exampleTranslation: 'Bisa kah kamu makan soto Banjar?',
    isPopular: true
  },
  {
    id: 'bjn-2',
    sourceLangId: 'ind',
    targetLangId: 'bjn',
    word: 'Terima kasih',
    translation: 'Tarima Kasih',
    phonetic: 'ta-ri-ma ka-sih',
    category: 'Salam',
    exampleSentence: 'Tarima kasih banyak pun sanak.',
    exampleTranslation: 'Terima kasih banyak ya saudaraku.',
    isPopular: true
  },

  // --- DAYAK NGAJU ---
  {
    id: 'dyn-1',
    sourceLangId: 'ind',
    targetLangId: 'dyn',
    word: 'Makan',
    translation: 'Kuman',
    phonetic: 'ku-man',
    category: 'Kata Kerja',
    exampleSentence: 'Ikei kuman kando tanak mahasur.',
    exampleTranslation: 'Kami makan lauk pauk hasil kebun.',
    isPopular: true
  },
  {
    id: 'dyn-2',
    sourceLangId: 'ind',
    targetLangId: 'dyn',
    word: 'Terima kasih',
    translation: 'Terasang Kasih / Tarima Kasih',
    phonetic: 'te-ra-sang ka-sih',
    category: 'Salam',
    exampleSentence: 'Terasang kasih pahari sasama.',
    exampleTranslation: 'Terima kasih wahai saudara sesama.',
    isPopular: true
  },

  // --- MADURA ---
  {
    id: 'mad-1',
    sourceLangId: 'ind',
    targetLangId: 'mad',
    word: 'Makan',
    translation: 'Kakan / Neda',
    phonetic: 'ka-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Neda sate Madura e alon-alon.',
    exampleTranslation: 'Makan sate Madura di alun-alun.',
    isPopular: true
  },
  {
    id: 'mad-2',
    sourceLangId: 'ind',
    targetLangId: 'mad',
    word: 'Terima kasih',
    translation: 'Mator Sakalangkong',
    phonetic: 'ma-tor sa-ka-lang-kong',
    category: 'Salam',
    exampleSentence: 'Mator sakalangkong banya\' atas bantunganna.',
    exampleTranslation: 'Terima kasih sangat banyak atas bantuannya.',
    isPopular: true
  },

  // --- TORAJA ---
  {
    id: 'tor-1',
    sourceLangId: 'ind',
    targetLangId: 'tor',
    word: 'Makan',
    translation: 'Kuman / Mangkuman',
    phonetic: 'ku-man',
    category: 'Kata Kerja',
    exampleSentence: 'Mai komi kuman pa’piong.',
    exampleTranslation: 'Mari kemari makan pa\'piong (masakan bambu khas Toraja).',
    isPopular: true
  },
  {
    id: 'tor-2',
    sourceLangId: 'ind',
    targetLangId: 'tor',
    word: 'Terima kasih',
    translation: 'Kurre Sumanga’',
    phonetic: 'kur-re su-ma-nga',
    category: 'Salam',
    exampleSentence: 'Kurre sumanga’ solasokku.',
    exampleTranslation: 'Terima kasih wahai kawan sahabatku.',
    culturalContext: 'Sama seperti bahasa Bugis, ucapan mendoakan semangat dan jiwa berlimpah keberkahan.',
    isPopular: true
  },

  // --- GORONTALO ---
  {
    id: 'gor-1',
    sourceLangId: 'ind',
    targetLangId: 'gor',
    word: 'Makan',
    translation: 'Monga',
    phonetic: 'mo-nga',
    category: 'Kata Kerja',
    exampleSentence: 'Watiya monga binthe biluhuta.',
    exampleTranslation: 'Saya makan sup jagung binthe biluhuta.',
    isPopular: true
  },
  {
    id: 'gor-2',
    sourceLangId: 'ind',
    targetLangId: 'gor',
    word: 'Terima kasih',
    translation: "Oluwo O'o / Tarima Kasi",
    phonetic: 'o-lu-wo o-o',
    category: 'Salam',
    exampleSentence: 'Oluwo o\'o uti woliya.',
    exampleTranslation: 'Terima kasih saudaraku.',
    isPopular: true
  }
];
