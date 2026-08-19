import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DictionaryView } from './components/DictionaryView';
import { TranslatorView } from './components/TranslatorView';
import { LearnHub } from './components/LearnHub';
import { QuizView } from './components/QuizView';
import { AITutorChat } from './components/AITutorChat';
import { UserProfileView } from './components/UserProfileView';
import { WordDetailModal } from './components/WordDetailModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

import { WordEntry, Language, UserProfile } from './types';
import { LANGUAGES_DATA } from './data/languagesData';
import { DICTIONARY_DATABASE } from './data/dictionaryDatabase';
import {
  loadUserProfile,
  saveUserProfile,
  addXpToProfile,
  toggleBookmarkInProfile,
  addHistoryToProfile
} from './utils/userStorage';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dictionary' | 'translate' | 'learn' | 'quiz' | 'ai' | 'profile'>('dictionary');

  // Languages State (Default: Indonesia -> Bugis)
  const [sourceLang, setSourceLang] = useState<Language>(
    LANGUAGES_DATA.find(l => l.id === 'ind') || LANGUAGES_DATA[0]
  );
  const [targetLang, setTargetLang] = useState<Language>(
    LANGUAGES_DATA.find(l => l.id === 'bug') || LANGUAGES_DATA[1]
  );

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());

  // Modals & Selections
  const [selectedWordForDetail, setSelectedWordForDetail] = useState<WordEntry | null>(null);
  const [languageModalType, setLanguageModalType] = useState<'source' | 'target' | null>(null);
  const [aiPromptWord, setAiPromptWord] = useState<WordEntry | null>(null);

  // Word of the Day (Spotlight)
  const wordOfTheDay = DICTIONARY_DATABASE.find(w => w.isWordOfTheDay) || DICTIONARY_DATABASE[0];

  // Save profile changes to localStorage
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Handle swapping languages
  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  // Handle language selection from modal
  const handleSelectLanguage = (lang: Language) => {
    if (languageModalType === 'source') {
      setSourceLang(lang);
    } else if (languageModalType === 'target') {
      setTargetLang(lang);
    }
  };

  // Handle adding XP and level-ups
  const handleAddXp = (amount: number) => {
    const { updatedProfile } = addXpToProfile(userProfile, amount);
    setUserProfile(updatedProfile);
  };

  // Handle toggling bookmark
  const handleToggleBookmark = (wordId: string) => {
    const updated = toggleBookmarkInProfile(userProfile, wordId);
    setUserProfile(updated);
  };

  // Handle selecting word detail & recording search history
  const handleSelectWordDetail = (word: WordEntry) => {
    setSelectedWordForDetail(word);
    const updated = addHistoryToProfile(userProfile, {
      wordId: word.id,
      word: word.word,
      translation: word.translation,
      sourceLangId: sourceLang.id,
      targetLangId: targetLang.id
    });
    setUserProfile(updated);
  };

  // Quick selection from hero popular pills
  const handleQuickSearchSelect = (langId: string) => {
    const found = LANGUAGES_DATA.find(l => l.id === langId);
    if (found) {
      setTargetLang(found);
      setActiveTab('dictionary');
    }
  };

  // Ask AI Tutor about a specific word
  const handleAskAiAboutWord = (word: WordEntry) => {
    setAiPromptWord(word);
    setActiveTab('ai');
  };

  // Clear user search history
  const handleClearHistory = () => {
    const updated: UserProfile = {
      ...userProfile,
      history: []
    };
    setUserProfile(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-green-100 selection:text-green-900">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
      />

      {/* Hero Spotlight Section (Only on Dictionary & Learn Tabs) */}
      {(activeTab === 'dictionary' || activeTab === 'learn') && (
        <HeroSection
          wordOfTheDay={wordOfTheDay}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSwapLanguages={handleSwapLanguages}
          onOpenLanguageModal={type => setLanguageModalType(type)}
          onSelectWordDetail={handleSelectWordDetail}
          onQuickSearchSelect={handleQuickSearchSelect}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'dictionary' && (
          <DictionaryView
            sourceLang={sourceLang}
            targetLang={targetLang}
            bookmarks={userProfile.bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSelectWordDetail={handleSelectWordDetail}
            onOpenLanguageModal={type => setLanguageModalType(type)}
          />
        )}

        {activeTab === 'translate' && (
          <TranslatorView
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSelectLanguage={(type, lang) => {
              if (type === 'source') setSourceLang(lang);
              else setTargetLang(lang);
            }}
            onSwapLanguages={handleSwapLanguages}
            bookmarks={userProfile.bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSelectWordDetail={handleSelectWordDetail}
          />
        )}

        {activeTab === 'learn' && (
          <LearnHub
            targetLang={targetLang}
            onAddXp={handleAddXp}
            onSelectWordDetail={handleSelectWordDetail}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            targetLang={targetLang}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'ai' && (
          <AITutorChat
            selectedLanguage={targetLang}
            initialPromptWord={aiPromptWord}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfileView
            userProfile={userProfile}
            targetLang={targetLang}
            onSelectWordDetail={handleSelectWordDetail}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Word Detail Modal */}
      {selectedWordForDetail && (
        <WordDetailModal
          word={selectedWordForDetail}
          targetLang={targetLang}
          isBookmarked={userProfile.bookmarks.includes(selectedWordForDetail.id)}
          onClose={() => setSelectedWordForDetail(null)}
          onToggleBookmark={handleToggleBookmark}
          onAskAiAboutWord={handleAskAiAboutWord}
        />
      )}

      {/* Language Selector Modal */}
      {languageModalType && (
        <LanguageSelectorModal
          type={languageModalType}
          selectedLangId={languageModalType === 'source' ? sourceLang.id : targetLang.id}
          onSelectLanguage={handleSelectLanguage}
          onClose={() => setLanguageModalType(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300">
            Kamus Bahasa Nusantara — Leksika AI
          </p>
          <p>
            Platform Edukasi Digital & Misi Pelestarian Bahasa Daerah Republik Indonesia 🇮🇩
          </p>
        </div>
      </footer>

    </div>
  );
}
