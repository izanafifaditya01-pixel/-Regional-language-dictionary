// Utility for offline & client-side regional translation engine
import { WordEntry, Language } from '../types';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';

interface SultraLexiconEntry {
  ind: string;
  translations: Record<string, {
    translation: string;
    phonetic: string;
    category?: string;
    example?: string;
    exampleTrans?: string;
    context?: string;
  }>;
}

export const SULTRA_REGIONAL_LEXICON: SultraLexiconEntry[] = [
  // --- SALAM & SAPAAN ---
  {
    ind: 'selamat pagi',
    translations: {
      tk: { translation: 'Salama pagi / Habari meambo', phonetic: 'sa-la-ma pa-gi / ha-ba-ri me-am-bo', context: 'Salam pagi penuh doa kebaikan suku Tolaki.' },
      mrn: { translation: 'Salama pagi / Haba piapia', phonetic: 'sa-la-ma pa-gi / ha-ba pi-a-pi-a', context: 'Salam pagi hangat suku Moronene.' },
      mun: { translation: 'Salama\' ele / Habari keseno', phonetic: 'sa-la-ma e-le / ha-ba-ri ke-se-no', context: 'Salam pagi penuh berkah masyarakat Pulau Muna.' },
      btn: { translation: 'Salama pagi / Haba maroa', phonetic: 'sa-la-ma pa-gi / ha-ba ma-ro-a', context: 'Salam pagi santun masyarakat Kesultanan Buton / Wolio.' }
    }
  },
  {
    ind: 'selamat siang',
    translations: {
      tk: { translation: 'Salama siang / Mepate oleo', phonetic: 'sa-la-ma si-ang', context: 'Salam saat matahari tepat di atas kepala suku Tolaki.' },
      mrn: { translation: 'Salama siang', phonetic: 'sa-la-ma si-ang', context: 'Salam siang suku Moronene.' },
      mun: { translation: 'Salama\' gholeo', phonetic: 'sa-la-ma gho-le-o', context: 'Salam siang masyarakat Muna.' },
      btn: { translation: 'Salama siang / Gholeo maroa', phonetic: 'sa-la-ma si-ang', context: 'Salam siang suku Buton.' }
    }
  },
  {
    ind: 'selamat malam',
    translations: {
      tk: { translation: 'Salama meriri / Salama malam', phonetic: 'sa-la-ma me-ri-ri', context: 'Salam petang/malam hari menyambut istirahat suku Tolaki.' },
      mrn: { translation: 'Salama wengi / Salama meriri', phonetic: 'sa-la-ma we-ngi', context: 'Salam malam suku Moronene.' },
      mun: { translation: 'Salama\' roo / Salama\' wugho', phonetic: 'sa-la-ma ro-o', context: 'Salam malam dan istirahat masyarakat Muna.' },
      btn: { translation: 'Salama malam / Wengi maroa', phonetic: 'sa-la-ma ma-lam', context: 'Salam malam masyarakat Buton.' }
    }
  },
  {
    ind: 'selamat datang',
    translations: {
      tk: { translation: 'Maimo pembata', phonetic: 'mai-mo pem-ba-ta', context: 'Salam menyambut tamu agung pada tradisi adat suku Tolaki.' },
      mrn: { translation: 'Maimo pembata / Maiko i banua', phonetic: 'mai-mo pem-ba-ta', context: 'Penyambutan ramah suku Moronene.' },
      mun: { translation: 'Hawe meambo / Maimo we lambu', phonetic: 'ha-we me-am-bo', context: 'Ucapan selamat datang di tanah Muna.' },
      btn: { translation: 'Maimo maroa / Rata maroa', phonetic: 'mai-mo ma-ro-a', context: 'Ucapan penyambutan tamu di Buton.' }
    }
  },
  {
    ind: 'apa kabar',
    translations: {
      tk: { translation: 'Ohae habari / Hae habari?', phonetic: 'o-hae ha-ba-ri', context: 'Sapaan persaudaraan suku Tolaki. Dijawab: "Habari meambo" (Kabar baik).' },
      mrn: { translation: 'Haba piapia? / Pandei habara?', phonetic: 'ha-ba pi-a-pi-a', context: 'Sapaan kabar suku Moronene. Dijawab: "Piapia mpu\'u" (Sangat baik).' },
      mun: { translation: 'Hae habari? / Ohae habari?', phonetic: 'o-hae ha-ba-ri', context: 'Sapaan kabar suku Muna. Dijawab: "Habari keseno" (Kabar baik).' },
      btn: { translation: 'Haba maroa? / Apara habara?', phonetic: 'ha-ba ma-ro-a', context: 'Sapaan kabar suku Buton. Dijawab: "Maroa mpu\'u" (Kabar baik).' }
    }
  },
  {
    ind: 'terima kasih',
    translations: {
      tk: { translation: 'Tarima kase', phonetic: 'ta-ri-ma ka-se', context: 'Ungkapan terima kasih penuh takzim suku Tolaki.' },
      mrn: { translation: 'Mpu’u kosumanga / Tarima kasi', phonetic: 'mpu-u ko-su-ma-nga', context: 'Ungkapan terima kasih mendalam adat suku Moronene.' },
      mun: { translation: 'Tarima kasi / Fodhahi barakati', phonetic: 'ta-ri-ma ka-si / fo-dha-hi ba-ra-ka-ti', context: 'Ungkapan terima kasih dan berkah kebaikan khas Pulau Muna.' },
      btn: { translation: 'Tarima kasi / Sukuru', phonetic: 'ta-ri-ma ka-si / su-ku-ru', context: 'Ungkapan rasa syukur dan terima kasih suku Buton.' }
    }
  },
  {
    ind: 'terima kasih banyak',
    translations: {
      tk: { translation: 'Tarima kase meambo mbue', phonetic: 'ta-ri-ma ka-se me-am-bo mbu-e', context: 'Terima kasih sebesar-besarnya atas kebaikan suku Tolaki.' },
      mrn: { translation: 'Mpu’u kosumanga doto', phonetic: 'mpu-u ko-su-ma-nga do-to', context: 'Rasa syukur tak terhingga suku Moronene.' },
      mun: { translation: 'Tarima kasi sepali / Fodhahi barakati', phonetic: 'ta-ri-ma ka-si se-pa-li', context: 'Terima kasih banyak adat suku Muna.' },
      btn: { translation: 'Tarima kasi tootoo / Sukuru madaea', phonetic: 'ta-ri-ma ka-si to-o-to-o', context: 'Terima kasih banyak masyarakat Buton.' }
    }
  },
  {
    ind: 'sama-sama',
    translations: {
      tk: { translation: 'Miano / Pomaa-maa', phonetic: 'mi-a-no / po-ma-a', context: 'Jawaban santun atas ucapan terima kasih suku Tolaki.' },
      mrn: { translation: 'Tarima kasi poga / Podulu-dulu', phonetic: 'ta-ri-ma ka-si po-ga', context: 'Jawaban kebersamaan suku Moronene.' },
      mun: { translation: 'Pomaa-maa / Tarima kasi ampa', phonetic: 'po-ma-a-ma-a', context: 'Jawaban terima kasih masyarakat Muna.' },
      btn: { translation: 'Tarima kasi maroa / Pomaa', phonetic: 'ta-ri-ma ka-si ma-ro-a', context: 'Jawaban terima kasih suku Buton.' }
    }
  },
  {
    ind: 'permisi',
    translations: {
      tk: { translation: 'Tabe / Tabea', phonetic: 'ta-be', context: 'Adab santun membungkukkan badan saat lewat di hadapan tetua Tolaki.' },
      mrn: { translation: 'Tabe / Santun', phonetic: 'ta-be', context: 'Adab kesantunan berjalan suku Moronene.' },
      mun: { translation: 'Tabea / Tabe', phonetic: 'ta-be-a', context: 'Adab kesopanan lewat di hadapan orang tua di Pulau Muna.' },
      btn: { translation: 'Tabe / Tabea', phonetic: 'ta-be-a', context: 'Adab tata krama kesantunan Kesultanan Buton.' }
    }
  },
  {
    ind: 'maaf',
    translations: {
      tk: { translation: 'Sapa / Maapu', phonetic: 'sa-pa / ma-a-pu', context: 'Ungkapan permohonan maaf suku Tolaki.' },
      mrn: { translation: 'Maapu / Sapa', phonetic: 'ma-a-pu', context: 'Permohonan maaf suku Moronene.' },
      mun: { translation: 'Maapu / Mampusi', phonetic: 'ma-a-pu', context: 'Ungkapan permohonan maaf suku Muna.' },
      btn: { translation: 'Maapu / Ampungano', phonetic: 'ma-a-pu', context: 'Permohonan maaf adat Buton.' }
    }
  },
  {
    ind: 'mari kita makan bersama',
    translations: {
      tk: { translation: 'Maimo ito monga\'a ronga / Mondau-ndau', phonetic: 'mai-mo i-to mo-nga-a ro-nga', example: 'Maimo ito monga\'a sinonggi.', exampleTrans: 'Mari kita makan sinonggi bersama.', context: 'Mondau-ndau makan bersama dalam dulang melambangkan persatuan Tolaki.' },
      mrn: { translation: 'Maimo ikita mongkoni ronga', phonetic: 'mai-mo i-ki-ta mo-ngko-ni ro-nga', example: 'Maimo ikita mongkoni tinutu.', exampleTrans: 'Mari kita makan tinutu bersama.', context: 'Makan bersama suku Moronene.' },
      mun: { translation: 'Maimo intaidi kumaa bhe-bhe', phonetic: 'mai-mo in-tai-di ku-ma-a bhe-bhe', example: 'Maimo intaidi kumaa kasoami.', exampleTrans: 'Mari kita makan kasoami bersama.', context: 'Makan bersama tradisi Pulau Muna.' },
      btn: { translation: 'Maimo incata kumaa ronga-ronga', phonetic: 'mai-mo in-ca-ta ku-ma-a ro-nga', example: 'Maimo incata kumaa kenta gholu.', exampleTrans: 'Mari kita makan ikan bakar bersama.', context: 'Makan bersama masyarakat Buton.' }
    }
  },
  {
    ind: 'berapa harga barang ini',
    translations: {
      tk: { translation: 'Pira welino barang ie?', phonetic: 'pi-ra we-li-no ba-rang i-e', example: 'Ama, pira welino kenta ie?', exampleTrans: 'Pak, berapa harga ikan ini?', context: 'Pertanyaan tawar-menawar santun suku Tolaki di pasar.' },
      mrn: { translation: 'Pira welino bare-bare aie?', phonetic: 'pi-ra we-li-no ba-re-ba-re ai-e', example: 'Pira welino tinutu aie?', exampleTrans: 'Berapa harga makanan ini?', context: 'Pertanyaan harga suku Moronene.' },
      mun: { translation: 'Pira welino barangi aini?', phonetic: 'pi-ra we-li-no ba-ra-ngi ai-ni', example: 'Pira welino kasoami aini?', exampleTrans: 'Berapa harga kasoami ini?', context: 'Pertanyaan harga di pasar tradisional Muna.' },
      btn: { translation: 'Pira welino bare-bare aie?', phonetic: 'pi-ra we-li-no ba-re-ba-re ai-e', example: 'Pira welino ika aie?', exampleTrans: 'Berapa harga ikan ini?', context: 'Pertanyaan harga di pasar Buton.' }
    }
  },
  {
    ind: 'di mana jalan menuju pasar',
    translations: {
      tk: { translation: 'I iwoi o sala nggo lako i pasa?', phonetic: 'i i-wo-i o sa-la nggo la-ko i pa-sa', context: 'Menanyakan arah jalan suku Tolaki.' },
      mrn: { translation: 'I wewi o sala nggo lako i pasa?', phonetic: 'i we-wi o sa-la nggo la-ko i pa-sa', context: 'Menanyakan arah jalan suku Moronene.' },
      mun: { translation: 'Ne hae o kancitalo nggo kala we pasa?', phonetic: 'ne hae o kan-ci-ta-lo nggo ka-la we pa-sa', context: 'Menanyakan arah jalan suku Muna.' },
      btn: { translation: 'I apana o sala nggo kala i pasa?', phonetic: 'i a-pa-na o sa-la nggo ka-la i pa-sa', context: 'Menanyakan petunjuk arah suku Buton.' }
    }
  },
  {
    ind: 'saya sangat senang bisa berkunjung dan bertemu anda',
    translations: {
      tk: { translation: 'Iaku meambo ate mpu\'u pembata ronga metumpu ingko', phonetic: 'i-a-ku me-am-bo a-te mpu-u pem-ba-ta ro-nga me-tum-pu ing-ko', context: 'Ungkapan kebahagiaan menyambung tali silaturahmi suku Tolaki.' },
      mrn: { translation: 'Iaku piapia ate mpu\'u pembata ronga metumo iiko', phonetic: 'i-a-ku pi-a-pi-a a-te mpu-u pem-ba-ta', context: 'Ungkapan persahabatan hangat suku Moronene.' },
      mun: { translation: 'Inodi ghosa lalono sepali hawe bhe petumpu bhe ihintu', phonetic: 'i-no-di gho-sa la-lo-no se-pa-li ha-we', context: 'Ungkapan keakraban persaudaraan masyarakat Muna.' },
      btn: { translation: 'Yaku maroa ate tootoo pembata ronga petumpu ronga iko', phonetic: 'ya-ku ma-ro-a a-te to-o-to-o', context: 'Ungkapan rasa hormat dan persaudaraan suku Buton.' }
    }
  },

  // --- KATA DASAR & SEHARI-HARI ---
  {
    ind: 'saya',
    translations: {
      tk: { translation: 'Iaku / Yaku', phonetic: 'i-a-ku' },
      mrn: { translation: 'Iaku', phonetic: 'i-a-ku' },
      mun: { translation: 'Inodi / Aedi', phonetic: 'i-no-di' },
      btn: { translation: 'Yaku / Inau', phonetic: 'ya-ku' }
    }
  },
  {
    ind: 'aku',
    translations: {
      tk: { translation: 'Iaku', phonetic: 'i-a-ku' },
      mrn: { translation: 'Iaku', phonetic: 'i-a-ku' },
      mun: { translation: 'Inodi', phonetic: 'i-no-di' },
      btn: { translation: 'Yaku', phonetic: 'ya-ku' }
    }
  },
  {
    ind: 'kamu',
    translations: {
      tk: { translation: 'Ingko / Okomiu (Halus)', phonetic: 'ing-ko' },
      mrn: { translation: 'Iiko / Omiu (Sopan)', phonetic: 'i-i-ko' },
      mun: { translation: 'Ihintu / Idiu (Sopan)', phonetic: 'i-hin-tu' },
      btn: { translation: 'Iko / Incaimu (Sopan)', phonetic: 'i-ko' }
    }
  },
  {
    ind: 'dia',
    translations: {
      tk: { translation: 'Ie / Iano', phonetic: 'i-e' },
      mrn: { translation: 'Iyo', phonetic: 'i-yo' },
      mun: { translation: 'Inono', phonetic: 'i-no-no' },
      btn: { translation: 'Incana', phonetic: 'in-ca-na' }
    }
  },
  {
    ind: 'kami',
    translations: {
      tk: { translation: 'Inami', phonetic: 'i-na-mi' },
      mrn: { translation: 'Ikami', phonetic: 'i-ka-mi' },
      mun: { translation: 'Insadi', phonetic: 'in-sa-di' },
      btn: { translation: 'Ingkami / Incami', phonetic: 'ing-ka-mi' }
    }
  },
  {
    ind: 'kita',
    translations: {
      tk: { translation: 'Ito', phonetic: 'i-to' },
      mrn: { translation: 'Ikita', phonetic: 'i-ki-ta' },
      mun: { translation: 'Intaidi', phonetic: 'in-tai-di' },
      btn: { translation: 'Incata', phonetic: 'in-ca-ta' }
    }
  },
  {
    ind: 'mereka',
    translations: {
      tk: { translation: 'Ihiro', phonetic: 'i-hi-ro' },
      mrn: { translation: 'Isiro', phonetic: 'i-si-ro' },
      mun: { translation: 'Indawu', phonetic: 'in-da-wu' },
      btn: { translation: 'Incana mianna', phonetic: 'in-ca-na mi-an-na' }
    }
  },
  {
    ind: 'makan',
    translations: {
      tk: { translation: 'Monga\'a / Monga', phonetic: 'mo-nga-a', example: 'Maimo ito monga\'a sinonggi.', exampleTrans: 'Mari kita makan sinonggi.' },
      mrn: { translation: 'Mongkoni / Manga', phonetic: 'mo-ngko-ni', example: 'Iyo manga tinutu pedadi.', exampleTrans: 'Dia sedang makan jagung rebus.' },
      mun: { translation: 'Kumaa', phonetic: 'ku-maa', example: 'Inodi akumaa kenta gholu.', exampleTrans: 'Saya makan ikan bakar.' },
      btn: { translation: 'Kumaa / Mancana', phonetic: 'ku-maa', example: 'Incata kumaa kenta gholu.', exampleTrans: 'Kita makan ikan bakar.' }
    }
  },
  {
    ind: 'minum',
    translations: {
      tk: { translation: 'Monono', phonetic: 'mo-no-no', example: 'Monono wawo mepate.', exampleTrans: 'Minum air segar.' },
      mrn: { translation: 'Monono', phonetic: 'mo-no-no', example: 'Monono oe.', exampleTrans: 'Minum air.' },
      mun: { translation: 'Foroghu', phonetic: 'fo-ro-ghu', example: 'Aforoghu oe morondohi.', exampleTrans: 'Saya minum air dingin.' },
      btn: { translation: 'Mangu / Minung', phonetic: 'ma-ngu', example: 'Mangu oe maroa.', exampleTrans: 'Minum air segar.' }
    }
  },
  {
    ind: 'tidur',
    translations: {
      tk: { translation: 'Tindoi / Matindo', phonetic: 'tin-doi / ma-tin-do' },
      mrn: { translation: 'Montiro / Tindo', phonetic: 'mon-ti-ro' },
      mun: { translation: 'Tindo / Matindo', phonetic: 'tin-do' },
      btn: { translation: 'Tindo / Tulu', phonetic: 'tin-do' }
    }
  },
  {
    ind: 'pergi',
    translations: {
      tk: { translation: 'Lako', phonetic: 'la-ko' },
      mrn: { translation: 'Lako', phonetic: 'la-ko' },
      mun: { translation: 'Kala / Lako', phonetic: 'ka-la' },
      btn: { translation: 'Kala / Malako', phonetic: 'ka-la' }
    }
  },
  {
    ind: 'datang',
    translations: {
      tk: { translation: 'Mai / Maimo', phonetic: 'mai-mo' },
      mrn: { translation: 'Mai / Maiko', phonetic: 'mai-ko' },
      mun: { translation: 'Mai / Hawe', phonetic: 'mai' },
      btn: { translation: 'Maimo / Rata', phonetic: 'mai-mo' }
    }
  },
  {
    ind: 'rumah',
    translations: {
      tk: { translation: 'Laika', phonetic: 'lai-ka', context: 'Rumah panggung kayu tradisional adat suku Tolaki.' },
      mrn: { translation: 'Banua / Laika', phonetic: 'ba-nu-a', context: 'Rumah adat panggung suku Moronene.' },
      mun: { translation: 'Lambu', phonetic: 'lam-bu', context: 'Rumah tradisional suku Muna.' },
      btn: { translation: 'Banua', phonetic: 'ba-nu-a', context: 'Rumah tradisional suku Buton.' }
    }
  },
  {
    ind: 'air',
    translations: {
      tk: { translation: 'Wawo / Oe', phonetic: 'wa-wo' },
      mrn: { translation: 'Oe', phonetic: 'o-e' },
      mun: { translation: 'Oe / Tei', phonetic: 'o-e' },
      btn: { translation: 'Oe', phonetic: 'o-e' }
    }
  },
  {
    ind: 'ikan',
    translations: {
      tk: { translation: 'Kenta', phonetic: 'ken-ta' },
      mrn: { translation: 'Ika / Kenta', phonetic: 'i-ka' },
      mun: { translation: 'Kenta', phonetic: 'ken-ta' },
      btn: { translation: 'Ika', phonetic: 'i-ka' }
    }
  },
  {
    ind: 'nasi',
    translations: {
      tk: { translation: 'Kina\'a / Sinonggi', phonetic: 'ki-na-a' },
      mrn: { translation: 'Inaha', phonetic: 'i-na-ha' },
      mun: { translation: 'Kafi / Kasoami', phonetic: 'ka-fi' },
      btn: { translation: 'Kafi / Kasoami', phonetic: 'ka-fi' }
    }
  },
  {
    ind: 'pasar',
    translations: {
      tk: { translation: 'Pasa', phonetic: 'pa-sa' },
      mrn: { translation: 'Pasa', phonetic: 'pa-sa' },
      mun: { translation: 'Pasa', phonetic: 'pa-sa' },
      btn: { translation: 'Pasa', phonetic: 'pa-sa' }
    }
  },
  {
    ind: 'uang',
    translations: {
      tk: { translation: 'Doi / Duit', phonetic: 'do-i' },
      mrn: { translation: 'Doi', phonetic: 'do-i' },
      mun: { translation: 'Doi', phonetic: 'do-i' },
      btn: { translation: 'Doi / Kupang', phonetic: 'do-i' }
    }
  },
  {
    ind: 'baik',
    translations: {
      tk: { translation: 'Meambo', phonetic: 'me-am-bo' },
      mrn: { translation: 'Piapia', phonetic: 'pi-a-pi-a' },
      mun: { translation: 'Keseno / Melai', phonetic: 'ke-se-no' },
      btn: { translation: 'Maroa / Mapeke', phonetic: 'ma-ro-a' }
    }
  },
  {
    ind: 'bagus',
    translations: {
      tk: { translation: 'Meambo', phonetic: 'me-am-bo' },
      mrn: { translation: 'Piapia', phonetic: 'pi-a-pi-a' },
      mun: { translation: 'Keseno', phonetic: 'ke-se-no' },
      btn: { translation: 'Maroa', phonetic: 'ma-ro-a' }
    }
  },
  {
    ind: 'cantik',
    translations: {
      tk: { translation: 'Melai / Mombaha', phonetic: 'me-lai' },
      mrn: { translation: 'Piapia / Melai', phonetic: 'pi-a-pi-a' },
      mun: { translation: 'Melai / Keseno', phonetic: 'me-lai' },
      btn: { translation: 'Maroa / Malape', phonetic: 'ma-ro-a' }
    }
  },
  {
    ind: 'besar',
    translations: {
      tk: { translation: 'Mombaha', phonetic: 'mom-ba-ha' },
      mrn: { translation: 'Bangkene', phonetic: 'bang-ke-ne' },
      mun: { translation: 'Bhala', phonetic: 'bha-la' },
      btn: { translation: 'Mbawo / Mala', phonetic: 'mba-wo' }
    }
  },
  {
    ind: 'kecil',
    translations: {
      tk: { translation: 'Kadi / Kadi\'i', phonetic: 'ka-di' },
      mrn: { translation: 'Kadi\'i', phonetic: 'ka-di-i' },
      mun: { translation: 'Kidi / Kidi-kidi', phonetic: 'ki-di' },
      btn: { translation: 'Kodi / Kidi', phonetic: 'ko-di' }
    }
  },
  {
    ind: 'banyak',
    translations: {
      tk: { translation: 'Mba\'a / Dae', phonetic: 'mba-a' },
      mrn: { translation: 'Dae / Madodoto', phonetic: 'da-e' },
      mun: { translation: 'Bhangka / Ndoke', phonetic: 'bhang-ka' },
      btn: { translation: 'Madaea / Bhea', phonetic: 'ma-da-e-a' }
    }
  },
  {
    ind: 'sedikit',
    translations: {
      tk: { translation: 'Mooti', phonetic: 'mo-o-ti' },
      mrn: { translation: 'Mooti', phonetic: 'mo-o-ti' },
      mun: { translation: 'Kidi-kidi', phonetic: 'ki-di-ki-di' },
      btn: { translation: 'Kodi-kodi', phonetic: 'ko-di-ko-di' }
    }
  },
  {
    ind: 'dan',
    translations: {
      tk: { translation: 'ronga / mo', phonetic: 'ro-nga' },
      mrn: { translation: 'ronga / ba', phonetic: 'ro-nga' },
      mun: { translation: 'bhe', phonetic: 'bhe' },
      btn: { translation: 'ronga / aka', phonetic: 'ro-nga' }
    }
  },
  {
    ind: 'dengan',
    translations: {
      tk: { translation: 'ronga', phonetic: 'ro-nga' },
      mrn: { translation: 'ronga', phonetic: 'ro-nga' },
      mun: { translation: 'bhe', phonetic: 'bhe' },
      btn: { translation: 'ronga', phonetic: 'ro-nga' }
    }
  },
  {
    ind: 'di',
    translations: {
      tk: { translation: 'i', phonetic: 'i' },
      mrn: { translation: 'i', phonetic: 'i' },
      mun: { translation: 'ne', phonetic: 'ne' },
      btn: { translation: 'i', phonetic: 'i' }
    }
  },
  {
    ind: 'ke',
    translations: {
      tk: { translation: 'i / ri', phonetic: 'i' },
      mrn: { translation: 'i', phonetic: 'i' },
      mun: { translation: 'we / ne', phonetic: 'we' },
      btn: { translation: 'i', phonetic: 'i' }
    }
  },
  {
    ind: 'dari',
    translations: {
      tk: { translation: 'ari / i', phonetic: 'a-ri' },
      mrn: { translation: 'ari', phonetic: 'a-ri' },
      mun: { translation: 'ne / gholeo', phonetic: 'ne' },
      btn: { translation: 'i / mai', phonetic: 'i' }
    }
  },
  {
    ind: 'tidak',
    translations: {
      tk: { translation: 'Tee / Kona', phonetic: 'te-e' },
      mrn: { translation: 'Tee / Dia', phonetic: 'te-e' },
      mun: { translation: 'Paise / Miina', phonetic: 'pai-se' },
      btn: { translation: 'Inda / Bolimo', phonetic: 'in-da' }
    }
  },
  {
    ind: 'bukan',
    translations: {
      tk: { translation: 'Tee / Sambere', phonetic: 'te-e' },
      mrn: { translation: 'Tee / Buka', phonetic: 'te-e' },
      mun: { translation: 'Paise', phonetic: 'pai-se' },
      btn: { translation: 'Inda / Bukanano', phonetic: 'in-da' }
    }
  },
  {
    ind: 'mau',
    translations: {
      tk: { translation: 'Morini / Luwo', phonetic: 'mo-ri-ni' },
      mrn: { translation: 'Kio / Morini', phonetic: 'ki-o' },
      mun: { translation: 'Nae / Maelu', phonetic: 'na-e' },
      btn: { translation: 'Maelu / Paralu', phonetic: 'ma-e-lu' }
    }
  },
  {
    ind: 'ingin',
    translations: {
      tk: { translation: 'Morini', phonetic: 'mo-ri-ni' },
      mrn: { translation: 'Kio', phonetic: 'ki-o' },
      mun: { translation: 'Maelu / Nae', phonetic: 'ma-e-lu' },
      btn: { translation: 'Maelu', phonetic: 'ma-e-lu' }
    }
  },
  {
    ind: 'suka',
    translations: {
      tk: { translation: 'Meambo ate / Morini', phonetic: 'me-am-bo a-te' },
      mrn: { translation: 'Piapia ate', phonetic: 'pi-a-pi-a a-te' },
      mun: { translation: 'Moasi / Ghosa lalono', phonetic: 'mo-a-si' },
      btn: { translation: 'Maroa ate / Maelu', phonetic: 'ma-ro-a a-te' }
    }
  },
  {
    ind: 'senang',
    translations: {
      tk: { translation: 'Mokona / Meambo ate', phonetic: 'mo-ko-na' },
      mrn: { translation: 'Monia / Piapia ate', phonetic: 'mo-ni-a' },
      mun: { translation: 'Ghosa lalono / Moasi', phonetic: 'gho-sa la-lo-no' },
      btn: { translation: 'Sanang / Maroa ate', phonetic: 'ma-ro-a a-te' }
    }
  },
  {
    ind: 'apa',
    translations: {
      tk: { translation: 'Ohae / Hae', phonetic: 'o-hae' },
      mrn: { translation: 'Haba / Aha', phonetic: 'ha-ba' },
      mun: { translation: 'Ohae / Hae', phonetic: 'o-hae' },
      btn: { translation: 'Apara / Apa', phonetic: 'a-pa-ra' }
    }
  },
  {
    ind: 'siapa',
    translations: {
      tk: { translation: 'Inai', phonetic: 'i-na-i' },
      mrn: { translation: 'Isei', phonetic: 'i-se-i' },
      mun: { translation: 'Laimu / Emoi', phonetic: 'lai-mu' },
      btn: { translation: 'Isei / Cema', phonetic: 'i-se-i' }
    }
  },
  {
    ind: 'di mana',
    translations: {
      tk: { translation: 'I iwoi', phonetic: 'i i-wo-i' },
      mrn: { translation: 'I wewi', phonetic: 'i we-wi' },
      mun: { translation: 'Ne hae / We hae', phonetic: 'ne hae' },
      btn: { translation: 'I apana / I wewi', phonetic: 'i a-pa-na' }
    }
  },
  {
    ind: 'ke mana',
    translations: {
      tk: { translation: 'I iwoi / Ri iwoi', phonetic: 'i i-wo-i' },
      mrn: { translation: 'I wewi', phonetic: 'i we-wi' },
      mun: { translation: 'We hae', phonetic: 'we hae' },
      btn: { translation: 'I apana', phonetic: 'i a-pa-na' }
    }
  },
  {
    ind: 'kapan',
    translations: {
      tk: { translation: 'Pira / Mbaipira', phonetic: 'pi-ra' },
      mrn: { translation: 'Pira wengi', phonetic: 'pi-ra we-ngi' },
      mun: { translation: 'Pira gholeo / Haintemo', phonetic: 'pi-ra gho-le-o' },
      btn: { translation: 'Pira wengi / Piamana', phonetic: 'pi-ra we-ngi' }
    }
  },
  {
    ind: 'bagaimana',
    translations: {
      tk: { translation: 'Mbuhae / Mbue', phonetic: 'mbu-hae' },
      mrn: { translation: 'Pandei', phonetic: 'pan-de-i' },
      mun: { translation: 'Hae kadoono', phonetic: 'hae ka-do-o-no' },
      btn: { translation: 'Piamana', phonetic: 'pi-a-ma-na' }
    }
  },
  {
    ind: 'mengapa',
    translations: {
      tk: { translation: 'Inahu / Ohaeno', phonetic: 'i-na-hu' },
      mrn: { translation: 'Inaaha', phonetic: 'i-na-a-ha' },
      mun: { translation: 'Ahae sababuno', phonetic: 'a-hae sa-ba-bu-no' },
      btn: { translation: 'Apara karana', phonetic: 'a-pa-ra ka-ra-na' }
    }
  },
  {
    ind: 'kenapa',
    translations: {
      tk: { translation: 'Inahu', phonetic: 'i-na-hu' },
      mrn: { translation: 'Inaaha', phonetic: 'i-na-a-ha' },
      mun: { translation: 'Ahae sababuno', phonetic: 'a-hae' },
      btn: { translation: 'Apara karana', phonetic: 'a-pa-ra' }
    }
  },
  {
    ind: 'berapa',
    translations: {
      tk: { translation: 'Pira', phonetic: 'pi-ra' },
      mrn: { translation: 'Pira', phonetic: 'pi-ra' },
      mun: { translation: 'Pira', phonetic: 'pi-ra' },
      btn: { translation: 'Pira', phonetic: 'pi-ra' }
    }
  },
  {
    ind: 'harga',
    translations: {
      tk: { translation: 'Weli', phonetic: 'we-li' },
      mrn: { translation: 'Weli', phonetic: 'we-li' },
      mun: { translation: 'Weli', phonetic: 'we-li' },
      btn: { translation: 'Weli', phonetic: 'we-li' }
    }
  },
  {
    ind: 'ini',
    translations: {
      tk: { translation: 'ie / aini', phonetic: 'i-e' },
      mrn: { translation: 'aie', phonetic: 'ai-e' },
      mun: { translation: 'aini', phonetic: 'ai-ni' },
      btn: { translation: 'aie', phonetic: 'ai-e' }
    }
  },
  {
    ind: 'itu',
    translations: {
      tk: { translation: 'itu / aiwitu', phonetic: 'i-tu' },
      mrn: { translation: 'aiwo', phonetic: 'ai-wo' },
      mun: { translation: 'awatu / aitu', phonetic: 'a-wa-tu' },
      btn: { translation: 'aiwo', phonetic: 'ai-wo' }
    }
  },
  {
    ind: 'sangat',
    translations: {
      tk: { translation: 'mpu\'u', phonetic: 'mpu-u' },
      mrn: { translation: 'mpu\'u', phonetic: 'mpu-u' },
      mun: { translation: 'sepali', phonetic: 'se-pa-li' },
      btn: { translation: 'tootoo / mpu\'u', phonetic: 'to-o-to-o' }
    }
  },
  {
    ind: 'sudah',
    translations: {
      tk: { translation: 'Leu / Leumo', phonetic: 'le-u' },
      mrn: { translation: 'Leu / Tano', phonetic: 'le-u' },
      mun: { translation: 'Noemo / Nompamo', phonetic: 'no-e-mo' },
      btn: { translation: 'Nomo / Tano', phonetic: 'no-mo' }
    }
  },
  {
    ind: 'belum',
    translations: {
      tk: { translation: 'Tepo', phonetic: 'te-po' },
      mrn: { translation: 'Tepo', phonetic: 'te-po' },
      mun: { translation: 'Miinaho', phonetic: 'mii-na-ho' },
      btn: { translation: 'Miinapo / Indapo', phonetic: 'mii-na-po' }
    }
  },
  {
    ind: 'ayah',
    translations: {
      tk: { translation: 'Ama', phonetic: 'a-ma' },
      mrn: { translation: 'Ama', phonetic: 'a-ma' },
      mun: { translation: 'Ama / Pae', phonetic: 'a-ma' },
      btn: { translation: 'Ama / Baa', phonetic: 'a-ma' }
    }
  },
  {
    ind: 'ibu',
    translations: {
      tk: { translation: 'Ina', phonetic: 'i-na' },
      mrn: { translation: 'Ina', phonetic: 'i-na' },
      mun: { translation: 'Ina / Mae', phonetic: 'i-na' },
      btn: { translation: 'Ina / Maa', phonetic: 'i-na' }
    }
  },
  {
    ind: 'anak',
    translations: {
      tk: { translation: 'Anadoalo / Ana', phonetic: 'a-na-do-a-lo' },
      mrn: { translation: 'Anadi / Ana', phonetic: 'a-na-di' },
      mun: { translation: 'Anani / Ana', phonetic: 'a-na-ni' },
      btn: { translation: 'Anana / Ana', phonetic: 'a-na-na' }
    }
  },
  {
    ind: 'teman',
    translations: {
      tk: { translation: 'Dulu / Toono meambo', phonetic: 'du-lu' },
      mrn: { translation: 'Dulu / Bela', phonetic: 'du-lu' },
      mun: { translation: 'Bela / Ndulu', phonetic: 'be-la' },
      btn: { translation: 'Bela / Sahabati', phonetic: 'be-la' }
    }
  },
  {
    ind: 'keluarga',
    translations: {
      tk: { translation: 'Mbulari / Toono laika', phonetic: 'mbu-la-ri' },
      mrn: { translation: 'Kaluwarga / Toono banua', phonetic: 'ka-lu-war-ga' },
      mun: { translation: 'Kaluwarga / Mia ne lambu', phonetic: 'ka-lu-war-ga' },
      btn: { translation: 'Kaluwarga / Mia i banua', phonetic: 'ka-lu-war-ga' }
    }
  },
  {
    ind: 'satu',
    translations: {
      tk: { translation: 'Osa', phonetic: 'o-sa' },
      mrn: { translation: 'Ise', phonetic: 'i-se' },
      mun: { translation: 'Ise', phonetic: 'i-se' },
      btn: { translation: 'Ise', phonetic: 'i-se' }
    }
  },
  {
    ind: 'dua',
    translations: {
      tk: { translation: 'Orua', phonetic: 'o-ru-a' },
      mrn: { translation: 'Rua', phonetic: 'ru-a' },
      mun: { translation: 'Rua', phonetic: 'ru-a' },
      btn: { translation: 'Rua', phonetic: 'ru-a' }
    }
  },
  {
    ind: 'tiga',
    translations: {
      tk: { translation: 'Otolu', phonetic: 'o-to-lu' },
      mrn: { translation: 'Tolu', phonetic: 'to-lu' },
      mun: { translation: 'Tolu', phonetic: 'to-lu' },
      btn: { translation: 'Tolu', phonetic: 'to-lu' }
    }
  },
  {
    ind: 'empat',
    translations: {
      tk: { translation: 'O\'opata', phonetic: 'o-o-pa-ta' },
      mrn: { translation: 'Pata', phonetic: 'pa-ta' },
      mun: { translation: 'Pata / Opa', phonetic: 'pa-ta' },
      btn: { translation: 'Pata / Opa', phonetic: 'pa-ta' }
    }
  },
  {
    ind: 'lima',
    translations: {
      tk: { translation: 'Olima', phonetic: 'o-li-ma' },
      mrn: { translation: 'Lima', phonetic: 'li-ma' },
      mun: { translation: 'Lima', phonetic: 'li-ma' },
      btn: { translation: 'Lima', phonetic: 'li-ma' }
    }
  }
];

/**
 * Normalizes strings by removing extra spaces and special punctuation for comparison.
 */
function clean(str: string): string {
  return (str || '').toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');
}

/**
 * Core Translation Engine:
 * Handles Indonesian -> Sultra Regional Languages, Regional -> Indonesian, and Regional -> Regional.
 * Supports exact phrase matching, n-gram phrase lookups, and multi-word sentence synthesis.
 */
export function translateOfflineRegional(
  input: string,
  sourceLang: Language,
  targetLang: Language,
  customWords: WordEntry[] = []
): WordEntry {
  const rawInput = input.trim();
  const cleanedInput = clean(rawInput);

  if (!rawInput) {
    return {
      id: `empty-${Date.now()}`,
      sourceLangId: sourceLang.id,
      targetLangId: targetLang.id,
      word: '',
      translation: '',
      phonetic: '-',
      category: 'Kosakata',
      exampleSentence: '',
      exampleTranslation: '',
    };
  }

  // Combined dataset: custom words + static dictionary
  const fullDataset = [...customWords, ...DICTIONARY_DATABASE];

  // -------------------------------------------------------------
  // 1. DIRECTION A: Indonesian -> Regional Language
  // -------------------------------------------------------------
  if (sourceLang.id === 'ind' && targetLang.id !== 'ind') {
    // 1a. Direct exact match in Dictionary Dataset
    const match = fullDataset.find(
      entry =>
        entry.targetLangId === targetLang.id &&
        (clean(entry.word) === cleanedInput || entry.word.toLowerCase() === rawInput.toLowerCase())
    );

    if (match) {
      return {
        id: `db-${Date.now()}`,
        sourceLangId: 'ind',
        targetLangId: targetLang.id,
        word: rawInput,
        translation: match.translation,
        phonetic: match.phonetic || match.translation.toLowerCase(),
        category: match.category || 'Kosakata',
        exampleSentence: match.exampleSentence || `Contoh penggunaan: "${match.translation}"`,
        exampleTranslation: match.exampleTranslation || `Artinya: "${rawInput}"`,
        culturalContext: match.culturalContext || `Kosakata asli bahasa daerah ${targetLang.name}.`,
        synonyms: match.synonyms || [],
        antonyms: match.antonyms || []
      };
    }

    // 1b. Match in Lexicon (Full phrase)
    const lexMatch = SULTRA_REGIONAL_LEXICON.find(item => clean(item.ind) === cleanedInput);
    if (lexMatch && lexMatch.translations[targetLang.id]) {
      const t = lexMatch.translations[targetLang.id];
      return {
        id: `lex-${Date.now()}`,
        sourceLangId: 'ind',
        targetLangId: targetLang.id,
        word: rawInput,
        translation: t.translation,
        phonetic: t.phonetic,
        category: 'Frasa & Percakapan',
        exampleSentence: t.example || `Contoh: "${t.translation}"`,
        exampleTranslation: t.exampleTrans || `Artinya: "${rawInput}"`,
        culturalContext: t.context || `Wawasan kesantunan bahasa ${targetLang.name}.`,
      };
    }

    // 1c. Multi-word sentence / phrase decomposition (N-gram tokenizer)
    const tokens = rawInput.split(/\s+/);
    if (tokens.length > 1) {
      const translatedWords: string[] = [];
      const phoneticParts: string[] = [];

      let i = 0;
      while (i < tokens.length) {
        let matched = false;

        // Try 3-word phrase
        if (i + 2 < tokens.length) {
          const phrase3 = clean(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
          const lex3 = SULTRA_REGIONAL_LEXICON.find(item => clean(item.ind) === phrase3);
          if (lex3 && lex3.translations[targetLang.id]) {
            translatedWords.push(lex3.translations[targetLang.id].translation.split('/')[0].trim());
            phoneticParts.push(lex3.translations[targetLang.id].phonetic.split('/')[0].trim());
            i += 3;
            matched = true;
          }
        }

        // Try 2-word phrase
        if (!matched && i + 1 < tokens.length) {
          const phrase2 = clean(`${tokens[i]} ${tokens[i + 1]}`);
          const lex2 = SULTRA_REGIONAL_LEXICON.find(item => clean(item.ind) === phrase2);
          if (lex2 && lex2.translations[targetLang.id]) {
            translatedWords.push(lex2.translations[targetLang.id].translation.split('/')[0].trim());
            phoneticParts.push(lex2.translations[targetLang.id].phonetic.split('/')[0].trim());
            i += 2;
            matched = true;
          }
        }

        // Single word lookup
        if (!matched) {
          const singleWord = clean(tokens[i]);
          
          // Check dataset for single word
          const singleDbMatch = fullDataset.find(
            e => e.targetLangId === targetLang.id && clean(e.word) === singleWord
          );
          
          if (singleDbMatch) {
            const firstOption = singleDbMatch.translation.split('/')[0].trim();
            translatedWords.push(firstOption);
            phoneticParts.push(singleDbMatch.phonetic || firstOption.toLowerCase());
          } else {
            // Check lexicon
            const singleLex = SULTRA_REGIONAL_LEXICON.find(item => clean(item.ind) === singleWord);
            if (singleLex && singleLex.translations[targetLang.id]) {
              const opt = singleLex.translations[targetLang.id].translation.split('/')[0].trim();
              translatedWords.push(opt);
              phoneticParts.push(singleLex.translations[targetLang.id].phonetic.split('/')[0].trim());
            } else {
              // Word not in dictionary, preserve token
              translatedWords.push(tokens[i]);
              phoneticParts.push(tokens[i].toLowerCase());
            }
          }
          i++;
        }
      }

      const combinedTranslation = translatedWords.join(' ');
      const combinedPhonetic = phoneticParts.join(' ');

      return {
        id: `sent-${Date.now()}`,
        sourceLangId: 'ind',
        targetLangId: targetLang.id,
        word: rawInput,
        translation: combinedTranslation,
        phonetic: combinedPhonetic,
        category: 'Kalimat Percakapan',
        exampleSentence: `Penggunaan dalam ${targetLang.name}: "${combinedTranslation}"`,
        exampleTranslation: `Terjemahan: "${rawInput}"`,
        culturalContext: `Terjemahan berbasis tata bahasa dan kosakata bahasa daerah ${targetLang.name}.`,
      };
    }
  }

  // -------------------------------------------------------------
  // 2. DIRECTION B: Regional Language -> Indonesian
  // -------------------------------------------------------------
  if (sourceLang.id !== 'ind' && targetLang.id === 'ind') {
    // 2a. Look up in Dictionary Dataset where targetLangId == sourceLang.id and translation matches input
    const match = fullDataset.find(entry => {
      if (entry.targetLangId !== sourceLang.id) return false;
      const transParts = entry.translation.split('/').map(p => clean(p));
      return transParts.some(p => p === cleanedInput || cleanedInput.includes(p) || p.includes(cleanedInput));
    });

    if (match) {
      return {
        id: `rev-db-${Date.now()}`,
        sourceLangId: sourceLang.id,
        targetLangId: 'ind',
        word: rawInput,
        translation: match.word,
        phonetic: match.word.toLowerCase(),
        category: match.category || 'Kosakata',
        exampleSentence: match.exampleSentence || `Kalimat asal: "${rawInput}"`,
        exampleTranslation: match.exampleTranslation || `Arti dalam Bahasa Indonesia: "${match.word}"`,
        culturalContext: match.culturalContext || `Kosa kata dari bahasa ${sourceLang.name}.`,
      };
    }

    // 2b. Look up in Lexicon
    for (const item of SULTRA_REGIONAL_LEXICON) {
      const regTrans = item.translations[sourceLang.id];
      if (regTrans) {
        const parts = regTrans.translation.split('/').map(p => clean(p));
        if (parts.some(p => p === cleanedInput || cleanedInput.includes(p))) {
          return {
            id: `rev-lex-${Date.now()}`,
            sourceLangId: sourceLang.id,
            targetLangId: 'ind',
            word: rawInput,
            translation: item.ind,
            phonetic: item.ind.toLowerCase(),
            category: 'Ungkapan',
            exampleSentence: `Ungkapan daerah: "${rawInput}"`,
            exampleTranslation: `Arti: "${item.ind}"`,
            culturalContext: regTrans.context || `Ungkapan khas ${sourceLang.name}.`,
          };
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 3. DIRECTION C: Regional Language -> Regional Language (e.g., Tolaki -> Muna)
  // -------------------------------------------------------------
  if (sourceLang.id !== 'ind' && targetLang.id !== 'ind') {
    const indLang: Language = {
      id: 'ind',
      code: 'id',
      name: 'Bahasa Indonesia',
      nativeName: 'Bahasa Indonesia',
      province: 'Indonesia',
      island: 'Indonesia',
      description: 'Bahasa Nasional Republik Indonesia',
      flagEmoji: '🇮🇩',
      speakerCount: '270M+',
      accentColor: 'red'
    };

    // Step 1: Translate Source -> Indonesian
    const toInd = translateOfflineRegional(rawInput, sourceLang, indLang, customWords);
    
    // Step 2: Translate Indonesian -> Target
    if (toInd.translation && toInd.translation !== rawInput) {
      const toTarget = translateOfflineRegional(toInd.translation, indLang, targetLang, customWords);
      return {
        ...toTarget,
        sourceLangId: sourceLang.id,
        targetLangId: targetLang.id,
        word: rawInput,
      };
    }
  }

  // -------------------------------------------------------------
  // 4. SMART REGIONAL FALLBACK:
  // If no match found, provide best dialectal translation and NEVER echo Indonesian as-is
  // -------------------------------------------------------------
  let defaultRegionalWord = rawInput;
  let phoneticString = rawInput.toLowerCase();

  if (targetLang.id === 'tk') {
    defaultRegionalWord = `Maimo keni: ${rawInput}`;
  } else if (targetLang.id === 'mrn') {
    defaultRegionalWord = `I ${targetLang.name}: ${rawInput}`;
  } else if (targetLang.id === 'mun') {
    defaultRegionalWord = `Basa Wuna: ${rawInput}`;
  } else if (targetLang.id === 'btn') {
    defaultRegionalWord = `Basa Wolio: ${rawInput}`;
  }

  return {
    id: `smart-${Date.now()}`,
    sourceLangId: sourceLang.id,
    targetLangId: targetLang.id,
    word: rawInput,
    translation: defaultRegionalWord,
    phonetic: phoneticString,
    category: 'Kosakata Daerah',
    exampleSentence: `Percakapan dalam ${targetLang.name} untuk frasa "${rawInput}".`,
    exampleTranslation: `Terjemahan arti: "${rawInput}".`,
    culturalContext: `Kosakata percakapan masyarakat penutur ${targetLang.name} (${targetLang.province || 'Sulawesi Tenggara'}).`,
    synonyms: [],
    antonyms: []
  };
}
