import { QuizQuestion, WordEntry, Language } from '../types';
import { QUIZ_DATABASE } from '../data/quizDatabase';
import { DICTIONARY_DATABASE } from '../data/dictionaryDatabase';
import { LANGUAGES_DATA } from '../data/languagesData';

/**
 * Fisher-Yates array shuffler
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Dynamically generates a randomized set of quiz questions every time the user plays.
 * Questions and multiple choice options will always be shuffled.
 */
export function generateRandomQuiz(
  difficulty: 'easy' | 'medium' | 'hard',
  selectedLanguageId?: string,
  totalQuestions: number = 6
): QuizQuestion[] {
  const generatedList: QuizQuestion[] = [];

  // 1. Get static pre-curated questions matching criteria
  let curated = QUIZ_DATABASE.filter(q => q.difficulty === difficulty);
  if (selectedLanguageId && selectedLanguageId !== 'all' && selectedLanguageId !== 'ind') {
    const langCurated = curated.filter(q => q.languageId === selectedLanguageId);
    if (langCurated.length > 0) {
      curated = langCurated;
    }
  }

  // 2. Generate dynamic questions from dictionary database
  let dictPool = [...DICTIONARY_DATABASE];
  if (selectedLanguageId && selectedLanguageId !== 'all' && selectedLanguageId !== 'ind') {
    const langDict = dictPool.filter(w => w.targetLangId === selectedLanguageId);
    if (langDict.length > 0) {
      dictPool = langDict;
    }
  }

  const shuffledDict = shuffleArray(dictPool);
  const otherWords = DICTIONARY_DATABASE;

  shuffledDict.forEach((entry, idx) => {
    const lang = LANGUAGES_DATA.find(l => l.id === entry.targetLangId) || LANGUAGES_DATA[1];
    
    // Pick 3 random distractor words from different entries
    const distractors = shuffleArray(
      otherWords.filter(w => w.word !== entry.word && w.translation !== entry.translation)
    ).slice(0, 3);

    if (difficulty === 'easy') {
      // Type 1: MCQ - What does regional word mean in Indonesian?
      const options = shuffleArray([
        entry.word,
        distractors[0]?.word || 'Berjalan',
        distractors[1]?.word || 'Minum',
        distractors[2]?.word || 'Senang'
      ]);

      generatedList.push({
        id: `dyn-easy-${entry.id}-${Date.now()}-${idx}`,
        type: 'mcq',
        difficulty: 'easy',
        languageId: entry.targetLangId,
        question: `Apa arti kata "${entry.translation}" dalam ${lang.name}?`,
        word: entry.translation,
        translation: entry.word,
        options,
        contextSentence: entry.exampleSentence,
        explanation: `Dalam ${lang.name}, "${entry.translation}" berarti "${entry.word}". ${entry.culturalContext || ''}`
      });

      // Type 2: Reverse MCQ - How to say Indonesian word in regional language?
      if (idx % 2 === 0) {
        const transOptions = shuffleArray([
          entry.translation,
          distractors[0]?.translation || 'Namu',
          distractors[1]?.translation || 'Mole',
          distractors[2]?.translation || 'Lao'
        ]);

        generatedList.push({
          id: `dyn-easy-rev-${entry.id}-${Date.now()}-${idx}`,
          type: 'mcq',
          difficulty: 'easy',
          languageId: entry.targetLangId,
          question: `Bagaimana mengucapkan "${entry.word}" dalam ${lang.name}?`,
          word: entry.word,
          translation: entry.translation,
          options: transOptions,
          contextSentence: entry.exampleSentence,
          explanation: `Kosakata untuk "${entry.word}" dalam ${lang.name} adalah "${entry.translation}".`
        });
      }
    } else if (difficulty === 'medium') {
      // Type 3: Fill in the blank with context sentence
      if (entry.exampleSentence && entry.exampleSentence.toLowerCase().includes(entry.translation.toLowerCase())) {
        const regex = new RegExp(entry.translation, 'gi');
        const blankedSentence = entry.exampleSentence.replace(regex, '_____');

        const options = shuffleArray([
          entry.translation,
          distractors[0]?.translation || 'Melo',
          distractors[1]?.translation || 'Kasi',
          distractors[2]?.translation || 'Salama'
        ]);

        generatedList.push({
          id: `dyn-med-blank-${entry.id}-${Date.now()}-${idx}`,
          type: 'fill_blank',
          difficulty: 'medium',
          languageId: entry.targetLangId,
          question: `Lengkapi kalimat ${lang.name} yang rumpang:`,
          contextSentence: `"${blankedSentence}" (Arti: ${entry.exampleTranslation})`,
          word: entry.translation,
          translation: entry.translation,
          options,
          explanation: `Kata yang tepat adalah "${entry.translation}". Kalimat lengkapnya: "${entry.exampleSentence}".`
        });
      } else {
        // Fallback to word scramble
        const letters = entry.translation.toUpperCase().split('');
        const scrambled = shuffleArray(letters);

        generatedList.push({
          id: `dyn-med-scramble-${entry.id}-${Date.now()}-${idx}`,
          type: 'scramble',
          difficulty: 'medium',
          languageId: entry.targetLangId,
          question: `Susun huruf kata ${lang.name} yang berarti "${entry.word}":`,
          word: entry.translation,
          translation: entry.word,
          scrambleLetters: scrambled,
          explanation: `Susunan huruf yang benar adalah "${entry.translation}" (${entry.phonetic}), yang berarti "${entry.word}".`
        });
      }
    } else {
      // Difficulty: HARD
      // Type 4: Hard scramble or dialect guess
      if (idx % 2 === 0) {
        const letters = entry.translation.toUpperCase().split('');
        const scrambled = shuffleArray(letters);

        generatedList.push({
          id: `dyn-hard-scramble-${entry.id}-${Date.now()}-${idx}`,
          type: 'scramble',
          difficulty: 'hard',
          languageId: entry.targetLangId,
          question: `[Tantangan Sulit] Susun huruf kata "${entry.translation}" (${lang.name}) untuk arti "${entry.word}":`,
          word: entry.translation,
          translation: entry.word,
          scrambleLetters: scrambled,
          explanation: `Kata "${entry.translation}" dilafalkan "${entry.phonetic}". ${entry.culturalContext || ''}`
        });
      } else {
        const langOptions = shuffleArray([
          lang.name,
          'Bahasa Bugis',
          'Bahasa Sunda',
          'Bahasa Minangkabau',
          'Bahasa Banjar',
          'Bahasa Bali'
        ]).slice(0, 4);

        if (!langOptions.includes(lang.name)) {
          langOptions[0] = lang.name;
        }

        generatedList.push({
          id: `dyn-hard-guess-${entry.id}-${Date.now()}-${idx}`,
          type: 'guess',
          difficulty: 'hard',
          languageId: entry.targetLangId,
          question: `Ungkapan atau kata "${entry.translation}" (artinya: ${entry.word}) berasal dari bahasa daerah mana?`,
          word: entry.translation,
          translation: lang.name,
          options: shuffleArray(langOptions),
          contextSentence: entry.culturalContext || `Contoh: "${entry.exampleSentence}"`,
          explanation: `"${entry.translation}" adalah kosakata asli ${lang.name} (${lang.province}).`
        });
      }
    }
  });

  // Combine curated and dynamic, shuffle thoroughly
  const allPool = shuffleArray([...curated, ...generatedList]);

  // Ensure options in each question are shuffled
  const finalized = allPool.slice(0, totalQuestions).map(q => {
    if (q.options) {
      return {
        ...q,
        options: shuffleArray(q.options)
      };
    }
    return q;
  });

  return finalized;
}
