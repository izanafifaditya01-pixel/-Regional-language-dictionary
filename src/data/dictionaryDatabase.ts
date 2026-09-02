import { WordEntry } from '../types';
import { SULTRA_COMPREHENSIVE_VOCABULARY } from './sultraVocabulary';

export const BASE_DICTIONARY_DATABASE: WordEntry[] = [
  ...SULTRA_COMPREHENSIVE_VOCABULARY
];

export const DICTIONARY_DATABASE: WordEntry[] = [
  ...BASE_DICTIONARY_DATABASE
];
