// Utility for offline & client-side regional translation fallback
import { WordEntry, Language } from '../types';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';

interface RegionalDictionaryEntry {
  ind: string;
  translations: Record<string, { translation: string; phonetic: string; example?: string; exampleTrans?: string; context?: string }>;
}

export const REGIONAL_LEXICON: RegionalDictionaryEntry[] = [
  {
    ind: 'selamat pagi',
    translations: {
      bug: { translation: 'Salama\' Ele', phonetic: 'sa-la-ma e-leh', context: 'Salam hangat suku Bugis di pagi hari saat matahari terbit.' },
      jav: { translation: 'Sugeng Enjang', phonetic: 'su-geng en-jang', context: 'Tingkatan Krama Inggil santun masyarakat Jawa.' },
      sun: { translation: 'Wilujeng Enjing', phonetic: 'wi-lu-jeng en-jing', context: 'Ungkapan salam santun Tatar Pasundan.' },
      ban: { translation: 'Rahajeng Semeng', phonetic: 'ra-ha-jeng se-meng', context: 'Salam pagi penuh rasa syukur dan doa di Pulau Dewata.' },
      mak: { translation: 'Salama\' Baji-Baji Bero-Bero', phonetic: 'sa-la-ma ba-ji ba-ji', context: 'Salam pagi kebaikan suku Makassar.' },
      min: { translation: 'Salamaik Pagi', phonetic: 'sa-la-maik pa-gi', context: 'Salam khas Ranah Minang.' },
      ace: { translation: 'Seulamat Beungoh', phonetic: 'seu-la-mat beu-ngoh', context: 'Salam pagi masyarakat Serambi Mekkah.' },
      btk: { translation: 'Horas Manogot', phonetic: 'ho-ras ma-no-got', context: 'Salam keakraban Batak Toba di pagi hari.' },
      bjn: { translation: 'Selamat Baisokan', phonetic: 'se-la-mat bai-so-kan', context: 'Salam pagi masyarakat Banjar.' },
      btw: { translation: 'Met Pagi / Pagi Bang', phonetic: 'met pa-gi', context: 'Salam ramah khas warga Betawi.' },
      plb: { translation: 'Selamat Pagi Dulur', phonetic: 'se-la-mat pa-gi du-lur', context: 'Salam akrab masyarakat Palembang tepian Musi.' },
      lmp: { translation: 'Tabik Pun Selamat Pagi', phonetic: 'ta-bik pun', context: 'Salam santun adat Lampung.' },
      mdo: { translation: 'Slamat Pagi Samua', phonetic: 'sla-mat pa-gi', context: 'Salam hangat Minahasa Manado.' },
      amb: { translation: 'Slamat Pagi Katong Samua', phonetic: 'sla-mat pa-gi', context: 'Salam persaudaraan Ambon Manise.' },
      pap: { translation: 'Selamat Pagi Kamurang', phonetic: 'se-la-mat pa-gi ka-mu-rang', context: 'Salam bersahabat tanah Papua.' },
      tor: { translation: 'Salama\' Melambi\'', phonetic: 'sa-la-ma me-lam-bi', context: 'Salam pagi sejuk pegunungan Tana Toraja.' },
      gor: { translation: 'Mopolohupa Dehu', phonetic: 'mo-po-lo-hu-pa', context: 'Salam pagi suku Gorontalo.' },
      kyn: { translation: 'Adil Ka Talino, Selamat Pagi', phonetic: 'a-dil ka ta-li-no', context: 'Salam persaudaraan Dayak.' },
    }
  },
  {
    ind: 'terima kasih',
    translations: {
      bug: { translation: 'Kurru Sumange\'', phonetic: 'kur-ru su-ma-nge', context: 'Mendoakan keteguhan jiwa dan kelimpahan berkah.' },
      jav: { translation: 'Matur Nuwun', phonetic: 'ma-tur nu-wun', context: 'Ungkapan terima kasih penuh hormat masyarakat Jawa.' },
      sun: { translation: 'Hatur Nuhun', phonetic: 'ha-tur nu-hun', context: 'Ungkapan rasa terima kasih dalam tradisi Sunda.' },
      ban: { translation: 'Matur Suksma', phonetic: 'ma-tur suks-ma', context: 'Rasa terima kasih yang mendalam dari lubuk jiwa.' },
      mak: { translation: 'Kurru Sumanga\' / Tarima Kasi', phonetic: 'kur-ru su-ma-nga', context: 'Ungkapan terima kasih penuh rasa syukur suku Makassar.' },
      min: { translation: 'Tarimo Kasiah', phonetic: 'ta-ri-mo ka-siah', context: 'Ungkapan terima kasih dalam bahasa Minangkabau.' },
      ace: { translation: 'Teurimong Geunaseh', phonetic: 'teu-ri-mong geu-na-seh', context: 'Ungkapan terima kasih bahasa Aceh.' },
      btk: { translation: 'Mauliate', phonetic: 'mau-li-a-te', context: 'Ungkapan terima kasih dan rasa syukur khas Batak.' },
      bjn: { translation: 'Tarima Kasih Banyak', phonetic: 'ta-ri-ma ka-sih', context: 'Ucapan terima kasih suku Banjar.' },
      btw: { translation: 'Makasih Banyak Ya Bang', phonetic: 'ma-ka-sih ban-yak', context: 'Rasa terima kasih santai khas Betawi.' },
      plb: { translation: 'Mokasih Banyak Dolor', phonetic: 'mo-ka-sih ban-yak', context: 'Ucapan terima kasih Palembang.' },
      lmp: { translation: 'Nalom / Terima Kasih', phonetic: 'na-lom', context: 'Ungkapan terima kasih suku Lampung.' },
      mdo: { translation: 'Makase Banyak', phonetic: 'ma-ka-se ban-yak', context: 'Ungkapan terima kasih bahasa Manado.' },
      amb: { translation: 'Dangke Banyak', phonetic: 'dang-ke ban-yak', context: 'Ungkapan terima kasih masyarakat Maluku.' },
      pap: { translation: 'Wa Wa Wa / Kasumasa', phonetic: 'wa wa wa', context: 'Ungkapan syukur dan terima kasih tanah Papua.' },
      tor: { translation: 'Kurre Sumanga\' Solasokku', phonetic: 'kur-re su-ma-nga', context: 'Ungkapan terima kasih adat Toraja.' },
      gor: { translation: 'Oluwo O\'o', phonetic: 'o-lu-wo o-o', context: 'Ungkapan terima kasih bahasa Gorontalo.' },
      kyn: { translation: 'Arus / Terima Kasih', phonetic: 'a-rus', context: 'Ungkapan syukur masyarakat Dayak Kanayatn.' },
      mgr: { translation: 'Tiba Teing', phonetic: 'ti-ba te-ing', context: 'Ungkapan terima kasih Manggarai Flores.' },
      dwn: { translation: 'Ulas Tuan', phonetic: 'u-las tu-an', context: 'Ungkapan terima kasih Timor Dawan.' }
    }
  },
  {
    ind: 'makan',
    translations: {
      bug: { translation: 'Manre', phonetic: 'man-reh', example: 'Maimeng manre ritu nasu manu.', exampleTrans: 'Mari kita makan masakan ayam.' },
      jav: { translation: 'Mangan / Dahar', phonetic: 'ma-ngan / da-har', example: 'Mangga sami dahar sesarengan.', exampleTrans: 'Mari makan bersama-sama.' },
      sun: { translation: 'Tuang / Neda', phonetic: 'tu-ang / ne-da', example: 'Hayu urang tuang sangu liwet.', exampleTrans: 'Ayo kita makan nasi liwet.' },
      ban: { translation: 'Ngajeng / Medaar', phonetic: 'nga-jeng / me-da-ar', example: 'Durusang ngajeng ajengan Bali.', exampleTrans: 'Silakan santap hidangan Bali.' },
      mak: { translation: 'Nganre', phonetic: 'ngan-reh', example: 'Ayo nganre coto Makassar.', exampleTrans: 'Ayo kita makan coto Makassar.' },
      min: { translation: 'Makan / Sambamu', phonetic: 'ma-kan', example: 'Marilah kito makan randang basamo.', exampleTrans: 'Mari kita makan rendang bersama.' },
      ace: { translation: 'Pajoh / Makheun', phonetic: 'pa-joh', example: 'Jak tapajoh bu siat.', exampleTrans: 'Mari kita makan nasi sebentar.' },
      btk: { translation: 'Mangan', phonetic: 'ma-ngan', example: 'Beta hita mangan indahan.', exampleTrans: 'Ayo kita makan nasi.' },
      bjn: { translation: 'Makan / Menyantap', phonetic: 'ma-kan', example: 'Ayu lakasi kito makan soto Banjar.', exampleTrans: 'Ayo cepat kita makan soto Banjar.' },
      btw: { translation: 'Makan / Ngotok', phonetic: 'ma-kan', example: 'Ayo pada makan kerak telor.', exampleTrans: 'Ayo semuanya makan kerak telor.' },
      plb: { translation: 'Makan / Ngirup', phonetic: 'ma-kan', example: 'Payo kito makan pempek.', exampleTrans: 'Ayo kita makan pempek.' },
      lmp: { translation: 'Mangan / Mengan', phonetic: 'ma-ngan', example: 'Ayo tian mengan seruit.', exampleTrans: 'Ayo kita makan sambal seruit.' },
      mdo: { translation: 'Makang', phonetic: 'ma-kang', example: 'Mari jo torang makang tinutuan.', exampleTrans: 'Mari kita makan bubur tinutuan.' },
      amb: { translation: 'Makang', phonetic: 'ma-kang', example: 'Katong makang papeda kuah kuning.', exampleTrans: 'Kita makan papeda kuah kuning.' },
      pap: { translation: 'Makan', phonetic: 'ma-kan', example: 'Kitorang makan papeda bungkus bakar.', exampleTrans: 'Kita makan papeda bungkus bakar.' },
      tor: { translation: 'Kuman / Mangkuman', phonetic: 'ku-man', example: 'Mai komi kuman pa’piong.', exampleTrans: 'Mari kemari makan pa\'piong.' },
      gor: { translation: 'Monga', phonetic: 'mo-nga', example: 'Watiya monga binthe biluhuta.', exampleTrans: 'Saya makan sup jagung binthe biluhuta.' },
      kyn: { translation: 'Makan / Nyangkuang', phonetic: 'ma-kan', example: 'Ayo diri makan sungkui.', exampleTrans: 'Ayo kita makan pulut sungkui.' },
      kut: { translation: 'Makan / Begantar', phonetic: 'ma-kan', example: 'Yok keroan makan gence ruan.', exampleTrans: 'Ayo makan ikan gence ruan.' }
    }
  },
  {
    ind: 'tidur',
    translations: {
      bug: { translation: 'Matinro', phonetic: 'ma-tin-ro' },
      jav: { translation: 'Turu / Sare', phonetic: 'tu-ru / sa-re' },
      sun: { translation: 'Kulem / Sare', phonetic: 'ku-lem / sa-re' },
      ban: { translation: 'Sirep / Pules', phonetic: 'si-rep / pu-les' },
      mak: { translation: 'Tinro', phonetic: 'tin-ro' },
      min: { translation: 'Lalok', phonetic: 'la-lok' },
      ace: { translation: 'Éh', phonetic: 'eh' },
      btk: { translation: 'Modom', phonetic: 'mo-dom' },
      bjn: { translation: 'Guring', phonetic: 'gu-ring' },
      btw: { translation: 'Tidur / Merem', phonetic: 'ti-dur' },
      plb: { translation: 'Tiduk', phonetic: 'ti-duk' },
      mdo: { translation: 'Tidor', phonetic: 'ti-dor' },
      amb: { translation: 'Tidor', phonetic: 'ti-dor' },
      pap: { translation: 'Tidur', phonetic: 'ti-dur' },
      tor: { translation: 'Mamma\'', phonetic: 'mam-ma' },
      gor: { translation: 'Tuluhe', phonetic: 'tu-lu-he' },
    }
  },
  {
    ind: 'rumah',
    translations: {
      bug: { translation: 'Bola', phonetic: 'bo-la', context: 'Rumah panggung tradisional kayu khas Bugis.' },
      jav: { translation: 'Omah / Dalem', phonetic: 'o-mah / da-lem', context: 'Rumah Joglo tradisional Jawa.' },
      sun: { translation: 'Bumi / Rorompok', phonetic: 'bu-mi / ro-rom-pok', context: 'Rumah panggung adat Sunda.' },
      ban: { translation: 'Umah / Puri', phonetic: 'u-mah / pu-ri', context: 'Kompleks perumahan adat berfilosofi Asta Kosala Kosali.' },
      mak: { translation: 'Balla', phonetic: 'bal-la', context: 'Rumah panggung adat suku Makassar.' },
      min: { translation: 'Rumah Gadang', phonetic: 'ru-mah ga-dang', context: 'Rumah adat bergonjong khas Minangkabau.' },
      ace: { translation: 'Rumoh Aceh', phonetic: 'ru-moh a-ceh', context: 'Rumah panggung kayu berukir khas Aceh.' },
      btk: { translation: 'Bagot Ni Ruma / Ruma Bolon', phonetic: 'ru-ma bo-lon', context: 'Rumah adat kayu bertanduk kerbau Batak.' },
      bjn: { translation: 'Rumah Bubungan Tinggi', phonetic: 'ru-mah bu-bu-ngan', context: 'Rumah adat panggung khas Banjar.' },
      btw: { translation: 'Rumah Kebaya', phonetic: 'ru-mah ke-ba-ya', context: 'Rumah adat tradisional masyarakat Betawi.' },
      plb: { translation: 'Rumah Limas', phonetic: 'ru-mah li-mas', context: 'Rumah tradisional berjenjang khas Palembang.' },
      tor: { translation: 'Banua / Tongkonan', phonetic: 'tong-ko-nan', context: 'Rumah adat beratap perahu pusaka leluhur Toraja.' },
      pap: { translation: 'Rumah Honai', phonetic: 'ho-nai', context: 'Rumah bulat tradisional beratap jerami di Lembah Baliem.' }
    }
  },
  {
    ind: 'apa kabar',
    translations: {
      bug: { translation: 'Aga kareba?', phonetic: 'a-ga ka-re-ba', context: 'Pertanyaan salam paling umum di Sulawesi Selatan (dijawab: "Kareba Madeceng").' },
      jav: { translation: 'Piye kabare? / Kados pundi pawartosipun?', phonetic: 'pi-ye ka-ba-re', context: 'Pertanyaan kabar akrab maupun krama inggil.' },
      sun: { translation: 'Kumaha damang?', phonetic: 'ku-ma-ha da-mang', context: 'Sapaan menanyakan kabar kesehatan khas Sunda.' },
      ban: { translation: 'Kenken kabare?', phonetic: 'ken-ken ka-ba-re', context: 'Sapaan ramah masyarakat Bali.' },
      mak: { translation: 'Apa kareba?', phonetic: 'a-pa ka-re-ba', context: 'Sapaan khas Makassar (dijawab: "Kareba Baji").' },
      min: { translation: 'A kaba?', phonetic: 'a ka-ba', context: 'Sapaan menanyakan kabar Minangkabau.' },
      ace: { translation: 'Pue haba?', phonetic: 'pue ha-ba', context: 'Sapaan menanyakan kabar di Aceh (dijawab: "Haba gèt").' },
      btk: { translation: 'Songon dia barita?', phonetic: 'so-ngon di-a ba-ri-ta', context: 'Pertanyaan kabar Batak Toba.' },
      bjn: { translation: 'Kaya apa habar?', phonetic: 'ka-ya a-pa ha-bar', context: 'Sapaan kabar suku Banjar.' },
      btw: { translation: 'Gimana kabarnye?', phonetic: 'gi-ma-na ka-bar-nye', context: 'Sapaan hangat khas Betawi.' },
      plb: { translation: 'Cakmano kabarnyo?', phonetic: 'cak-ma-no ka-bar-nyo', context: 'Sapaan kabar wong Palembang.' },
      mdo: { translation: 'Kyapa kabar?', phonetic: 'kya-pa ka-bar', context: 'Sapaan hangat Manado.' },
      amb: { translation: 'Bagaimana kabar katong?', phonetic: 'ba-gai-ma-na ka-bar', context: 'Sapaan persaudaraan Maluku.' },
      pap: { translation: 'Bagaimana kabar kamurang?', phonetic: 'ba-gai-ma-na ka-bar', context: 'Sapaan bersahabat di Papua.' },
      tor: { translation: 'Apara kareba?', phonetic: 'a-pa-ra ka-re-ba', context: 'Sapaan kabar di Toraja.' }
    }
  },
  {
    ind: 'saya',
    translations: {
      bug: { translation: 'Iyya / Iyya\'', phonetic: 'iy-ya' },
      jav: { translation: 'Kula / Aku', phonetic: 'ku-lo / a-ku' },
      sun: { translation: 'Abdi / Simkuring', phonetic: 'ab-di / sim-ku-ring' },
      ban: { translation: 'Tiang / Titiang', phonetic: 'ti-ang / ti-ti-ang' },
      mak: { translation: 'Nakké / Inakké', phonetic: 'nak-ke' },
      min: { translation: 'Ambo / Awak', phonetic: 'am-bo / a-wak' },
      ace: { translation: 'Ulôntuan / Lôn', phonetic: 'u-lon-tu-an' },
      btk: { translation: 'Ahu / Au', phonetic: 'a-hu' },
      bjn: { translation: 'Ulun / Aku', phonetic: 'u-lun / a-ku' },
      btw: { translation: 'Gue / Aye', phonetic: 'gue / a-ye' },
      plb: { translation: 'Aku / Kito', phonetic: 'a-ku' },
      mdo: { translation: 'Kita', phonetic: 'ki-ta' },
      amb: { translation: 'Beta', phonetic: 'be-ta' },
      pap: { translation: 'Sa / Saya', phonetic: 'sa' },
      tor: { translation: 'Aku / Misa', phonetic: 'a-ku' },
    }
  },
  {
    ind: 'kamu',
    translations: {
      bug: { translation: 'Idi\' / Iko', phonetic: 'i-di / i-ko' },
      jav: { translation: 'Panjenengan / Sampeyan / Kowe', phonetic: 'pan-je-neng-an' },
      sun: { translation: 'Anjeun / Salira', phonetic: 'an-jeun' },
      ban: { translation: 'Ragan ragane / Cai / Nyai', phonetic: 'ra-gan ra-ga-ne' },
      mak: { translation: 'Katté / Ikau', phonetic: 'kat-te' },
      min: { translation: 'Sanak / Waang', phonetic: 'sa-nak' },
      ace: { translation: 'Dron / Gata', phonetic: 'dron' },
      btk: { translation: 'Hamu / Ho', phonetic: 'ha-mu' },
      bjn: { translation: 'Pian / Ikam', phonetic: 'pi-an / i-kam' },
      btw: { translation: 'Lu / Ente', phonetic: 'lu / en-te' },
      plb: { translation: 'Kau / Dulur', phonetic: 'kau' },
      mdo: { translation: 'Ngana', phonetic: 'nga-na' },
      amb: { translation: 'Ose / Ale', phonetic: 'o-se / a-le' },
      pap: { translation: 'Ko / Kamu', phonetic: 'ko' },
      tor: { translation: 'Komi / Ikau', phonetic: 'ko-mi' }
    }
  }
];

export function translateOfflineRegional(
  input: string,
  sourceLang: Language,
  targetLang: Language
): WordEntry {
  const cleanInput = input.trim().toLowerCase();

  // 1. Check in static dictionary database first
  const dbMatch = DICTIONARY_DATABASE.find(entry => {
    const isTargetMatch = entry.targetLangId === targetLang.id;
    const isSourceMatch = entry.sourceLangId === sourceLang.id;
    return (
      (isTargetMatch && entry.word.toLowerCase() === cleanInput) ||
      (isSourceMatch && entry.translation.toLowerCase() === cleanInput)
    );
  });

  if (dbMatch) {
    return {
      id: `local-${Date.now()}`,
      sourceLangId: sourceLang.id,
      targetLangId: targetLang.id,
      word: input,
      translation: dbMatch.translation,
      phonetic: dbMatch.phonetic,
      category: dbMatch.category,
      exampleSentence: dbMatch.exampleSentence,
      exampleTranslation: dbMatch.exampleTranslation,
      culturalContext: dbMatch.culturalContext || `Kosakata khas bahasa daerah ${targetLang.name}.`,
      synonyms: dbMatch.synonyms || [],
      antonyms: dbMatch.antonyms || []
    };
  }

  // 2. Check in regional lexicon
  const lexiconEntry = REGIONAL_LEXICON.find(item => {
    if (item.ind.toLowerCase() === cleanInput) return true;
    for (const [, val] of Object.entries(item.translations)) {
      if (val.translation.toLowerCase().includes(cleanInput)) return true;
    }
    return false;
  });

  if (lexiconEntry && lexiconEntry.translations[targetLang.id]) {
    const targetData = lexiconEntry.translations[targetLang.id];
    return {
      id: `lex-${Date.now()}`,
      sourceLangId: sourceLang.id,
      targetLangId: targetLang.id,
      word: input,
      translation: targetData.translation,
      phonetic: targetData.phonetic || targetData.translation.toLowerCase(),
      category: 'Percakapan & Ungkapan',
      exampleSentence: targetData.example || `Contoh: "${targetData.translation}" sering diucapkan dalam ${targetLang.name}.`,
      exampleTranslation: targetData.exampleTrans || `Arti contoh: "${input}" dalam Bahasa Indonesia.`,
      culturalContext: targetData.context || `Wawasan etiket kesantunan penutur ${targetLang.name}.`,
      synonyms: [],
      antonyms: []
    };
  }

  // 3. Smart Linguistic Rule-based translation fallback
  let generatedTranslation = input;
  let samplePhonetic = input.toLowerCase();

  // Basic dialect vowel shift heuristics for Indonesian -> Regional
  if (targetLang.id === 'plb' || targetLang.id === 'jmb' || targetLang.id === 'bgk') {
    // Vowel -a to -o in Palembang/Jambi
    generatedTranslation = input.replace(/a\b/gi, 'o');
  } else if (targetLang.id === 'btw') {
    // Vowel -a to -e in Betawi
    generatedTranslation = input.replace(/a\b/gi, 'é');
  } else if (targetLang.id === 'sun') {
    generatedTranslation = `Basa ${targetLang.name}: ${input}`;
  } else if (targetLang.id === 'amb' || targetLang.id === 'mdo') {
    generatedTranslation = input.replace(/kan\b/gi, 'kang').replace(/saya/gi, targetLang.id === 'amb' ? 'beta' : 'kita');
  } else if (targetLang.id === 'pap') {
    generatedTranslation = input.replace(/saya/gi, 'sa').replace(/kamu/gi, 'ko').replace(/kita/gi, 'kitorang');
  }

  return {
    id: `smart-${Date.now()}`,
    sourceLangId: sourceLang.id,
    targetLangId: targetLang.id,
    word: input,
    translation: generatedTranslation !== input ? generatedTranslation : `${input} (${targetLang.nativeName || targetLang.name})`,
    phonetic: samplePhonetic,
    category: 'Kosakata & Frasa',
    exampleSentence: `Penggunaan ungkapan "${input}" dalam konteks percakapan ${targetLang.name}.`,
    exampleTranslation: `Terjemahan "${input}" dalam Bahasa Indonesia.`,
    culturalContext: `Digunakan dalam komunikasi ramah tamah masyarakat ${targetLang.province || targetLang.name}.`,
    synonyms: [],
    antonyms: []
  };
}
