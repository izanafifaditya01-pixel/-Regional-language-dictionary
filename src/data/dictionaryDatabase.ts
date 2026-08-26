import { WordEntry } from '../types';
import { COMPREHENSIVE_VOCABULARY } from './comprehensiveVocabulary';

const BASE_DICTIONARY_DATABASE: WordEntry[] = [
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
    translation: "Oluwo O'o",
    phonetic: 'o-lu-wo o-o',
    category: 'Salam',
    exampleSentence: 'Oluwo o\'o uti woliya.',
    exampleTranslation: 'Terima kasih saudaraku.',
    isPopular: true
  },

  // --- BETAWI (DKI JAKARTA) ---
  {
    id: 'btw-1',
    sourceLangId: 'ind',
    targetLangId: 'btw',
    word: 'Makan',
    translation: 'Makan / Ngotok',
    phonetic: 'ma-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Ayo pada makan kerak telor bareng-bareng.',
    exampleTranslation: 'Ayo kita makan kerak telor bersama-sama.',
    culturalContext: 'Masyarakat Betawi menjunjung tinggi kekeluargaan saat kumpul makan santai.',
    isPopular: true
  },
  {
    id: 'btw-2',
    sourceLangId: 'ind',
    targetLangId: 'btw',
    word: 'Terima kasih',
    translation: 'Makasih Banyak / Nuhun',
    phonetic: 'ma-ka-sih ban-yak',
    category: 'Salam',
    exampleSentence: 'Makasih banyak ya bang udeh dibantuin.',
    exampleTranslation: 'Terima kasih banyak ya bang sudah dibantu.',
    isPopular: true
  },
  {
    id: 'btw-3',
    sourceLangId: 'ind',
    targetLangId: 'btw',
    word: 'Saya / Kamu',
    translation: 'Gue / Lu',
    phonetic: 'gue / lu',
    category: 'Keluarga',
    exampleSentence: 'Gue seneng banget bisa maen ke mari.',
    exampleTranslation: 'Saya senang sekali bisa berkunjung ke sini.',
    isPopular: true
  },

  // --- PALEMBANG (SUMATERA SELATAN) ---
  {
    id: 'plb-1',
    sourceLangId: 'ind',
    targetLangId: 'plb',
    word: 'Makan',
    translation: 'Makan / Ngirup',
    phonetic: 'ma-kan / ngi-rup',
    category: 'Kata Kerja',
    exampleSentence: 'Pacak dak kito makan pempek iwak belido?',
    exampleTranslation: 'Bisa tidak kita makan pempek ikan belida?',
    culturalContext: 'Masyarakat Palembang punya tradisi ngirup cuko pempek yang khas.',
    isPopular: true
  },
  {
    id: 'plb-2',
    sourceLangId: 'ind',
    targetLangId: 'plb',
    word: 'Terima kasih',
    translation: 'Mokasih / Makasih Banyak',
    phonetic: 'mo-ka-sih',
    category: 'Salam',
    exampleSentence: 'Mokasih banyak dolor lah bantu aku.',
    exampleTranslation: 'Terima kasih banyak saudaraku sudah membantu saya.',
    isPopular: true
  },
  {
    id: 'plb-3',
    sourceLangId: 'ind',
    targetLangId: 'plb',
    word: 'Bagus / Hebat',
    translation: 'Elok / Rancak',
    phonetic: 'e-lok',
    category: 'Sifat',
    exampleSentence: 'Elok nian jembatan Ampera di malam hari.',
    exampleTranslation: 'Bagus sekali jembatan Ampera di malam hari.',
    isPopular: true
  },

  // --- RIAU & KEPULAUAN RIAU ---
  {
    id: 'ria-1',
    sourceLangId: 'ind',
    targetLangId: 'ria',
    word: 'Selamat Datang',
    translation: 'Selamat Datang / Jemput Duduk',
    phonetic: 'se-la-mat da-tang',
    category: 'Salam',
    exampleSentence: 'Sila jemput duduk di teratak kami.',
    exampleTranslation: 'Silakan duduk di pondok kami.',
    culturalContext: 'Bahasa Melayu Riau menjunjung tinggi pantun dan adab kesopanan tinggi.',
    isPopular: true
  },
  {
    id: 'ria-2',
    sourceLangId: 'ind',
    targetLangId: 'ria',
    word: 'Terima kasih',
    translation: 'Terima Kasih / Syukran',
    phonetic: 'te-ri-ma ka-sih',
    category: 'Salam',
    exampleSentence: 'Terima kasih atas budi baik encik dan puan.',
    exampleTranslation: 'Terima kasih atas kebaikan bapak dan ibu.',
    isPopular: true
  },

  // --- LAMPUNG ---
  {
    id: 'lmp-1',
    sourceLangId: 'ind',
    targetLangId: 'lmp',
    word: 'Selamat Datang',
    translation: 'Tabik Pun',
    phonetic: 'ta-bik pun',
    category: 'Salam',
    exampleSentence: 'Tabik pun, selamat ratong di Tanoh Lado.',
    exampleTranslation: 'Salam hormat, selamat datang di Tanah Lada (Lampung).',
    culturalContext: 'Tabik Pun adalah salam santun pembuka masyarakat adat Sai Batin dan Pepadun.',
    isPopular: true
  },
  {
    id: 'lmp-2',
    sourceLangId: 'ind',
    targetLangId: 'lmp',
    word: 'Terima kasih',
    translation: 'Nalom / Terima Kasih',
    phonetic: 'na-lom',
    category: 'Salam',
    exampleSentence: 'Terima kasih bangek ya puari.',
    exampleTranslation: 'Terima kasih banyak ya saudaraku.',
    isPopular: true
  },

  // --- MANADO (SULAWESI UTARA) ---
  {
    id: 'mdo-1',
    sourceLangId: 'ind',
    targetLangId: 'mdo',
    word: 'Makan',
    translation: 'Makang',
    phonetic: 'ma-kang',
    category: 'Kata Kerja',
    exampleSentence: 'Mari jo torang makang tinutuan sama-sama.',
    exampleTranslation: 'Mari ayo kita makan bubur Manado tinutuan bersama-sama.',
    culturalContext: 'Masyarakat Manado terkenal dengan kebersamaan "Torang Samua Basudara".',
    isPopular: true
  },
  {
    id: 'mdo-2',
    sourceLangId: 'ind',
    targetLangId: 'mdo',
    word: 'Terima kasih',
    translation: 'Makase / Makase Banyak',
    phonetic: 'ma-ka-se ban-yak',
    category: 'Salam',
    exampleSentence: 'Makase banyak so bantu pa kita.',
    exampleTranslation: 'Terima kasih banyak sudah membantu saya.',
    isPopular: true
  },

  // --- KAILI (SULAWESI TENGAH) ---
  {
    id: 'kli-1',
    sourceLangId: 'ind',
    targetLangId: 'kli',
    word: 'Makan',
    translation: 'Mangkoni',
    phonetic: 'mang-ko-ni',
    category: 'Kata Kerja',
    exampleSentence: 'Mai kita mangkoni kaledo.',
    exampleTranslation: 'Mari kita makan sup kaki sapi kaledo.',
    isPopular: true
  },
  {
    id: 'kli-2',
    sourceLangId: 'ind',
    targetLangId: 'kli',
    word: 'Terima kasih',
    translation: 'Tarima Kasi / Nambae',
    phonetic: 'ta-ri-ma ka-si',
    category: 'Salam',
    exampleSentence: 'Tarima kasi nambae sampesuwu.',
    exampleTranslation: 'Terima kasih banyak saudaraku.',
    isPopular: true
  },

  // --- MANDAR (SULAWESI BARAT) ---
  {
    id: 'mdr-1',
    sourceLangId: 'ind',
    targetLangId: 'mdr',
    word: 'Makan',
    translation: 'Mande',
    phonetic: 'man-de',
    category: 'Kata Kerja',
    exampleSentence: 'Mandei jolo baru lai malao.',
    exampleTranslation: 'Makanlah dulu sebelum kalian berangkat.',
    isPopular: true
  },
  {
    id: 'mdr-2',
    sourceLangId: 'ind',
    targetLangId: 'mdr',
    word: 'Terima kasih',
    translation: 'Tarima Kasi / Kurru Sumanga',
    phonetic: 'kur-ru su-ma-nga',
    category: 'Salam',
    exampleSentence: 'Kurru sumanga di pappasanga.',
    exampleTranslation: 'Terima kasih atas pesan dan nasihatnya.',
    isPopular: true
  },

  // --- TOLAKI (SULAWESI TENGGARA) ---
  {
    id: 'tk-1',
    sourceLangId: 'ind',
    targetLangId: 'tk',
    word: 'Makan',
    translation: 'Mokaa',
    phonetic: 'mo-kaa',
    category: 'Kata Kerja',
    exampleSentence: 'Mai to mokaa sinonggi.',
    exampleTranslation: 'Mari kita makan sagu sinonggi.',
    culturalContext: 'Sinonggi adalah makanan khas suku Tolaki berbahan sagu dengan kuah ikan.',
    isPopular: true
  },
  {
    id: 'tk-2',
    sourceLangId: 'ind',
    targetLangId: 'tk',
    word: 'Terima kasih',
    translation: 'Tarima Kasi / Medulu',
    phonetic: 'ta-ri-ma ka-si',
    category: 'Salam',
    exampleSentence: 'Tarima kasi atas tulunganta.',
    exampleTranslation: 'Terima kasih atas bantuan Anda.',
    isPopular: true
  },

  // --- AMBON & MALUKU ---
  {
    id: 'amb-1',
    sourceLangId: 'ind',
    targetLangId: 'amb',
    word: 'Makan',
    translation: 'Makang',
    phonetic: 'ma-kang',
    category: 'Kata Kerja',
    exampleSentence: 'Mari jua katong makang papeda deng ikan kuah kuning.',
    exampleTranslation: 'Mari kita makan papeda dengan ikan kuah kuning.',
    culturalContext: 'Tradisi makan bersama menggambarkan ikatan Pela Gandong yang kokoh di Maluku.',
    isPopular: true
  },
  {
    id: 'amb-2',
    sourceLangId: 'ind',
    targetLangId: 'amb',
    word: 'Terima kasih',
    translation: 'Dangkebanyak / Tarimakase',
    phonetic: 'dang-ke ban-yak',
    category: 'Salam',
    exampleSentence: 'Dangke banyak lae su tolong beta.',
    exampleTranslation: 'Terima kasih banyak saudaraku sudah menolong saya.',
    isPopular: true
  },
  {
    id: 'amb-3',
    sourceLangId: 'ind',
    targetLangId: 'amb',
    word: 'Saya / Kita',
    translation: 'Beta / Katong',
    phonetic: 'be-ta / ka-tong',
    category: 'Keluarga',
    exampleSentence: 'Beta bangga jadi anak Nusantara.',
    exampleTranslation: 'Saya bangga menjadi anak Nusantara.',
    isPopular: true
  },

  // --- TERNATE & MALUKU UTARA ---
  {
    id: 'ter-1',
    sourceLangId: 'ind',
    targetLangId: 'ter',
    word: 'Selamat Datang',
    translation: 'Suba Jou',
    phonetic: 'su-ba jou',
    category: 'Salam',
    exampleSentence: 'Suba jou, marimoi ngone futuru.',
    exampleTranslation: 'Salam hormat yang mulia, bersatu kita teguh.',
    culturalContext: 'Semboyan persatuan Kesultanan Ternate: "Marimoi Ngone Futuru".',
    isPopular: true
  },
  {
    id: 'ter-2',
    sourceLangId: 'ind',
    targetLangId: 'ter',
    word: 'Terima kasih',
    translation: 'Sukuru Jou / Syukur',
    phonetic: 'su-ku-ru jou',
    category: 'Salam',
    exampleSentence: 'Sukuru jou atas berkat dan rezeki ini.',
    exampleTranslation: 'Terima kasih penuh syukur atas rezeki ini.',
    isPopular: true
  },

  // --- PAPUA (MELAYU PAPUA, BIAK, DANI, MARIND) ---
  {
    id: 'pap-1',
    sourceLangId: 'ind',
    targetLangId: 'pap',
    word: 'Makan',
    translation: 'Makan',
    phonetic: 'ma-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Kitorang makan papeda bungkus bakar.',
    exampleTranslation: 'Kita semua makan papeda bungkus bakar.',
    culturalContext: 'Kearifan lokal kuliner sagu yang menjadi makanan pokok masyarakat Papua.',
    isPopular: true
  },
  {
    id: 'pap-2',
    sourceLangId: 'ind',
    targetLangId: 'pap',
    word: 'Terima kasih',
    translation: 'Terima Kasih Banyak / Wa Wa Wa',
    phonetic: 'wa wa wa',
    category: 'Salam',
    exampleSentence: 'Wa wa wa kitorang samua basaudara!',
    exampleTranslation: 'Terima kasih banyak rasa syukur kita semua bersaudara!',
    culturalContext: '"Wa Wa Wa" adalah seruan terima kasih, berkah, dan syukur masyarakat Papua Pegunungan.',
    isPopular: true
  },
  {
    id: 'pap-3',
    sourceLangId: 'ind',
    targetLangId: 'pap',
    word: 'Saya / Kita',
    translation: 'Sa / Kitorang (Kitong)',
    phonetic: 'sa / ki-tong',
    category: 'Keluarga',
    exampleSentence: 'Sa tra kosong, kitong jalan sama-sama.',
    exampleTranslation: 'Saya tidak sendiri, kita jalan bersama-sama.',
    isPopular: true
  },
  {
    id: 'dan-1',
    sourceLangId: 'ind',
    targetLangId: 'dan',
    word: 'Salam & Terima Kasih',
    translation: 'Wa Wa Wa',
    phonetic: 'wa wa wa',
    category: 'Salam',
    exampleSentence: 'Wa wa wa ninom eromoko.',
    exampleTranslation: 'Terima kasih banyak penuh rasa damai dan kehangatan.',
    culturalContext: 'Ungkapan kerukunan tertinggi saat ritual bakar batu adat Wamena.',
    isPopular: true
  },
  {
    id: 'byk-1',
    sourceLangId: 'ind',
    targetLangId: 'byk',
    word: 'Terima kasih',
    translation: 'Amesaik (Kasumasa)',
    phonetic: 'ka-su-ma-sa',
    category: 'Salam',
    exampleSentence: 'Kasumasa bekuri ba tolong ya.',
    exampleTranslation: 'Terima kasih banyak sudah menolong.',
    isPopular: true
  },
  {
    id: 'mrd-1',
    sourceLangId: 'ind',
    targetLangId: 'mrd',
    word: 'Salam Damai',
    translation: 'Izakod Bekai Izakod Kai',
    phonetic: 'i-za-kod be-kai',
    category: 'Salam',
    exampleSentence: 'Izakod bekai izakod kai di tanah Anim Ha.',
    exampleTranslation: 'Satu hati satu tujuan di tanah manusia sejati Merauke.',
    culturalContext: 'Motto persaudaraan suku Marind di Merauke, Papua Selatan.',
    isPopular: true
  },

  // --- MANGGARAI & DAWAN (NTT) ---
  {
    id: 'mgr-1',
    sourceLangId: 'ind',
    targetLangId: 'mgr',
    word: 'Terima kasih',
    translation: 'Tiba Teing / Walas',
    phonetic: 'ti-ba te-ing',
    category: 'Salam',
    exampleSentence: 'Tiba teing ata di’a one mai ite.',
    exampleTranslation: 'Terima kasih atas kebaikan yang datang dari Anda.',
    culturalContext: 'Ungkapan santun dalam adat Manggarai Flores Barat.',
    isPopular: true
  },
  {
    id: 'dwn-1',
    sourceLangId: 'ind',
    targetLangId: 'dwn',
    word: 'Terima kasih',
    translation: 'Ulas Tuan / Makasi',
    phonetic: 'u-las tu-an',
    category: 'Salam',
    exampleSentence: 'Ulas tuan nane meto.',
    exampleTranslation: 'Terima kasih banyak di tanah kering Timor.',
    isPopular: true
  },

  // --- DAYAK KANAYATN (KALBAR) ---
  {
    id: 'kyn-1',
    sourceLangId: 'ind',
    targetLangId: 'kyn',
    word: 'Salam Kebesaran Dayak',
    translation: 'Adil Ka Talino, Bacuramin Ka Saruga, Basengat Ka Jubata',
    phonetic: 'a-dil ka ta-li-no',
    category: 'Salam',
    exampleSentence: 'Adil Ka Talino, Bacuramin Ka Saruga, Basengat Ka Jubata! Arus!',
    exampleTranslation: 'Adil kepada sesama, bercermin ke surga, bernapas kepada Tuhan! Amin!',
    culturalContext: 'Falsafah hidup dan salam kebesaran masyarakat Dayak di seluruh Kalimantan.',
    isPopular: true
  },
  {
    id: 'kyn-2',
    sourceLangId: 'ind',
    targetLangId: 'kyn',
    word: 'Makan',
    translation: 'Makan / Nyangkuang',
    phonetic: 'ma-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Ayo diri makan sungkui.',
    exampleTranslation: 'Ayo kita makan beras pulut sungkui.',
    isPopular: true
  },

  // --- KUTAI (KALTIM / IKN) ---
  {
    id: 'kut-1',
    sourceLangId: 'ind',
    targetLangId: 'kut',
    word: 'Makan',
    translation: 'Makan / Begantar',
    phonetic: 'ma-kan',
    category: 'Kata Kerja',
    exampleSentence: 'Yok keroan makan gence ruan di tepian Mahakam.',
    exampleTranslation: 'Ayo kawan-kawan makan ikan haruan gence ruan di tepian Mahakam.',
    culturalContext: 'Kuliner tradisional khas Kesultanan Kutai Kartanegara.',
    isPopular: true
  },
  {
    id: 'kut-2',
    sourceLangId: 'ind',
    targetLangId: 'kut',
    word: 'Terima kasih',
    translation: 'Terima Kasih / Makaseh',
    phonetic: 'ma-ka-seh',
    category: 'Salam',
    exampleSentence: 'Makaseh banyak lah dengsanak.',
    exampleTranslation: 'Terima kasih banyak ya saudaraku.',
    isPopular: true
  },

  // --- BAHASA MUNA (SULTRA - PULAU MUNA) ---
  {
    id: 'mun-1',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Makan',
    translation: 'Kumaa',
    phonetic: 'ku-maa',
    category: 'Kata Kerja',
    exampleSentence: 'Inodi akumaa kenta gholu.',
    exampleTranslation: 'Saya makan ikan bakar.',
    culturalContext: 'Di Pulau Muna, tradisi makan bersama biasa menyajikan kenta gholu dan kasoami (olahan ubi kayu).',
    synonyms: ['Kuma'],
    isPopular: true
  },
  {
    id: 'mun-2',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Apa kabar',
    translation: 'Hae habari? / Ohae habari?',
    phonetic: 'o-hae ha-ba-ri',
    category: 'Salam',
    exampleSentence: 'Ohae habari aitu sabangka?',
    exampleTranslation: 'Bagaimana kabarmu sekarang kawan?',
    culturalContext: 'Sapaan hangat penuh persaudaraan di Pulau Muna (dijawab: "Kareba keseno" atau "Habari keseno" - kabar baik).',
    synonyms: ['Kareba hae?'],
    isPopular: true
  },
  {
    id: 'mun-3',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Terima kasih',
    translation: 'Tarima Kasi / Fodhahi Barakati',
    phonetic: 'ta-ri-ma ka-si',
    category: 'Salam',
    exampleSentence: 'Tarima kasi dadihinio bhantua.',
    exampleTranslation: 'Terima kasih banyak atas bantuannya.',
    culturalContext: 'Ungkapan rasa syukur dan doa limpahan berkah dalam adat masyarakat Wuna.',
    isPopular: true
  },
  {
    id: 'mun-4',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Rumah',
    translation: 'Lambu',
    phonetic: 'lam-bu',
    category: 'Tubuh & Bangunan',
    exampleSentence: 'Lambu Wuna noando marobe mpu’u.',
    exampleTranslation: 'Rumah adat suku Muna sangat asri dan kokoh.',
    culturalContext: 'Lambu Wuna merupakan rumah panggung tradisional khas suku Muna.',
    synonyms: ['Lambubu'],
    isPopular: true
  },
  {
    id: 'mun-5',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Tidur',
    translation: 'Tindo / Matindo',
    phonetic: 'tin-do / ma-tin-do',
    category: 'Kata Kerja',
    exampleSentence: 'Aitu inodi atindo we lambu.',
    exampleTranslation: 'Sekarang saya tidur di rumah.',
    isPopular: true
  },
  {
    id: 'mun-6',
    sourceLangId: 'ind',
    targetLangId: 'mun',
    word: 'Layang-layang purba Muna',
    translation: 'Kaghati Kolope',
    phonetic: 'ka-gha-ti ko-lo-pe',
    category: 'Budaya & Tradisi',
    exampleSentence: 'Kaghati Kolope noando layang-layang tertua we dunia.',
    exampleTranslation: 'Kaghati Kolope merupakan layang-layang tertua di dunia.',
    culturalContext: 'Terbuat dari daun kolope (umbi hutan) dan serat nanas, dibuktikan lewat lukisan prasejarah di Gua Liang Kabori Muna.',
    isPopular: true
  },

  // --- BAHASA MORONENE (SULTRA - BOMBANA & KABAENA) ---
  {
    id: 'mrn-1',
    sourceLangId: 'ind',
    targetLangId: 'mrn',
    word: 'Makan',
    translation: 'Mongkoni / Manga',
    phonetic: 'mo-ngko-ni / ma-nga',
    category: 'Kata Kerja',
    exampleSentence: 'Iyo manga tinutu pedadi.',
    exampleTranslation: 'Dia sedang makan jagung rebus bersama-sama.',
    culturalContext: 'Masyarakat suku tertua Moronene memiliki tradisi kuliner berbahan dasar jagung dan sagu.',
    isPopular: true
  },
  {
    id: 'mrn-2',
    sourceLangId: 'ind',
    targetLangId: 'mrn',
    word: 'Apa kabar',
    translation: 'Haba piapia? / Pandei habara?',
    phonetic: 'ha-ba pi-a-pi-a',
    category: 'Salam',
    exampleSentence: 'Pandei habara komiu mpenai aitu?',
    exampleTranslation: 'Bagaimana kabar kalian semua saat ini?',
    culturalContext: 'Sapaan keakraban suku Moronene di daratan Bombana dan Pulau Kabaena (dijawab: "Piapia mpu\'u" - sangat baik).',
    isPopular: true
  },
  {
    id: 'mrn-3',
    sourceLangId: 'ind',
    targetLangId: 'mrn',
    word: 'Terima kasih',
    translation: 'Mpu’u Kosumanga / Tarima Kasi',
    phonetic: 'mpu-u ko-su-ma-nga',
    category: 'Salam',
    exampleSentence: 'Mpu’u kosumanga atas tulungamu.',
    exampleTranslation: 'Terima kasih sebesar-besarnya atas pertolonganmu.',
    culturalContext: 'Ungkapan terima kasih mendalam suku Moronene yang menghormati semangat jiwa sesama manusia.',
    isPopular: true
  },
  {
    id: 'mrn-4',
    sourceLangId: 'ind',
    targetLangId: 'mrn',
    word: 'Rumah',
    translation: 'Banua / Laika',
    phonetic: 'ba-nu-a / lai-ka',
    category: 'Tubuh & Bangunan',
    exampleSentence: 'Banua adat Moronene moolo mpu’u.',
    exampleTranslation: 'Rumah adat suku Moronene sangat kokoh dan megah.',
    culturalContext: 'Rumah panggung adat suku Moronene dihiasi ukiran khas alam Bombana.',
    isPopular: true
  },
  {
    id: 'mrn-5',
    sourceLangId: 'ind',
    targetLangId: 'mrn',
    word: 'Tidur',
    translation: 'Montiro / Tindo',
    phonetic: 'mon-ti-ro / tin-do',
    category: 'Kata Kerja',
    exampleSentence: 'Iaku montiro i bampa sawah.',
    exampleTranslation: 'Saya beristirahat tidur di pondok sawah.',
    isPopular: true
  }
];

export const DICTIONARY_DATABASE: WordEntry[] = [
  ...BASE_DICTIONARY_DATABASE,
  ...COMPREHENSIVE_VOCABULARY
];
