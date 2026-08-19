import { QuizQuestion } from '../types';

export const QUIZ_DATABASE: QuizQuestion[] = [
  // EASY
  {
    id: 'quiz-1',
    type: 'mcq',
    difficulty: 'easy',
    languageId: 'bug',
    question: 'Apa arti kata "Manre" dalam Bahasa Bugis?',
    word: 'Manre',
    translation: 'Makan',
    options: ['Tidur', 'Makan', 'Jalan', 'Rumah'],
    explanation: 'Dalam Bahasa Bugis, "Manre" berarti Makan. Contoh: "Iyya manre" (Saya sedang makan).'
  },
  {
    id: 'quiz-2',
    type: 'mcq',
    difficulty: 'easy',
    languageId: 'jav',
    question: 'Apa ungkapan "Terima kasih" yang sopan dalam Bahasa Jawa?',
    word: 'Matur Nuwun',
    translation: 'Terima kasih',
    options: ['Sugeng Enjang', 'Matur Nuwun', 'Nyuwun Sewu', 'Pripun Kabare'],
    explanation: '"Matur Nuwun" adalah ucapan terima kasih santun dalam Bahasa Jawa.'
  },
  {
    id: 'quiz-3',
    type: 'mcq',
    difficulty: 'easy',
    languageId: 'sun',
    question: 'Kata "Hatur Nuhun" dalam Bahasa Sunda mempunyai arti...',
    word: 'Hatur Nuhun',
    translation: 'Terima kasih',
    options: ['Selamat Pagi', 'Terima kasih', 'Silakan Masuk', 'Minta Maaf'],
    explanation: '"Hatur Nuhun" berarti Terima kasih dalam bahasa Sunda Pasundan.'
  },
  {
    id: 'quiz-4',
    type: 'mcq',
    difficulty: 'easy',
    languageId: 'ban',
    question: 'Salam khas "Suksma" di pulau Bali berarti...',
    word: 'Suksma',
    translation: 'Terima kasih',
    options: ['Sampai Jumpa', 'Terima Kasih', 'Selamat Malam', 'Kabar Baik'],
    explanation: '"Matur Suksma" atau "Suksma" digunakan untuk mengucapkan Terima Kasih.'
  },

  // MEDIUM
  {
    id: 'quiz-5',
    type: 'scramble',
    difficulty: 'medium',
    languageId: 'bug',
    question: 'Susun huruf untuk membentuk kata "Terima Kasih" dalam Bahasa Bugis:',
    word: 'Kurru Sumange',
    translation: 'Terima kasih',
    scrambleLetters: ['K', 'U', 'R', 'R', 'U', ' ', 'S', 'U', 'M', 'A', 'N', 'G', 'E'],
    explanation: '"Kurru Sumange" adalah ucapan rasa syukur dan terima kasih tinggi khas Bugis.'
  },
  {
    id: 'quiz-6',
    type: 'fill_blank',
    difficulty: 'medium',
    languageId: 'mak',
    question: 'Isi kata yang kosong: "Kutaeng nga ___ coto Mangkasara." (Saya ingin makan coto Makassar)',
    word: 'Anre',
    translation: 'Anre',
    contextSentence: 'Kutaeng nga ___ coto Mangkasara.',
    options: ['Anre', 'Inung', 'Tinro', 'Baji'],
    explanation: '"Anre" berarti makan dalam bahasa Makassar.'
  },
  {
    id: 'quiz-7',
    type: 'guess',
    difficulty: 'medium',
    languageId: 'btk',
    question: 'Seruan hangat berjiwa semangat "Horas!" sering digunakan oleh penutur bahasa...',
    word: 'Horas',
    translation: 'Batak Toba',
    options: ['Minangkabau', 'Batak Toba', 'Dayak Ngaju', 'Aceh'],
    explanation: '"Horas" adalah ungkapan salam persaudaraan masyarakat Batak Toba.'
  },

  // HARD
  {
    id: 'quiz-8',
    type: 'mcq',
    difficulty: 'hard',
    languageId: 'mad',
    question: 'Apa ucapan "Terima kasih banyak" dalam Bahasa Madura?',
    word: 'Mator Sakalangkong',
    translation: 'Mator Sakalangkong',
    options: ['Mator Sakalangkong', 'Teureumong Gaseh', 'Kurre Sumanga', 'Terasang Kasih'],
    explanation: '"Mator Sakalangkong" berarti Terima kasih banyak dalam Bahasa Madura.'
  },
  {
    id: 'quiz-9',
    type: 'scramble',
    difficulty: 'hard',
    languageId: 'ace',
    question: 'Susun kata Bahasa Aceh untuk ucapan "Terima Kasih":',
    word: 'Teureumong Gaseh',
    translation: 'Teureumong Gaseh',
    scrambleLetters: ['T', 'E', 'U', 'R', 'E', 'U', 'M', 'O', 'N', 'G', ' ', 'G', 'A', 'S', 'E', 'H'],
    explanation: '"Teureumong Gaseh" adalah ungkapan terima kasih masyarakat Aceh.'
  }
];
