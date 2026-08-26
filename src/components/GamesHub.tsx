import React, { useState } from 'react';
import { 
  Gamepad2, 
  Zap, 
  Shuffle, 
  Layers, 
  Sparkles, 
  Headphones, 
  Trophy, 
  Award, 
  RotateCw, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Star, 
  Flame, 
  Calendar,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Language, UserProfile, DailyQuest } from '../types';
import { SpeedWordGame } from './games/SpeedWordGame';
import { WordScrambleGame } from './games/WordScrambleGame';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { WordleNusantaraGame } from './games/WordleNusantaraGame';
import { AudioGuessGame } from './games/AudioGuessGame';
import { DailyWheelModal } from './games/DailyWheelModal';
import { isSoundEnabled, setSoundEnabled, playClaimXpSound } from '../utils/soundEffects';

interface GamesHubProps {
  targetLang: Language;
  userProfile: UserProfile;
  onAddXp: (amount: number) => void;
  onRecordGameScore: (gameId: string, score: number) => void;
  onClaimQuest: (questId: string, xpReward: number) => void;
  onRecordWheelSpin: () => void;
}

type ActiveGame = 'speed' | 'scramble' | 'memory' | 'wordle' | 'audio' | null;

export const GamesHub: React.FC<GamesHubProps> = ({
  targetLang,
  userProfile,
  onAddXp,
  onRecordGameScore,
  onClaimQuest,
  onRecordWheelSpin
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [showWheelModal, setShowWheelModal] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());

  // Check if daily wheel spin is available (not spun today)
  const todayStr = new Date().toISOString().split('T')[0];
  const canSpinWheel = userProfile.lastWheelSpinDate !== todayStr;

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleWheelRewardClaim = (xp: number, desc: string) => {
    onAddXp(xp);
    onRecordWheelSpin();
  };

  const handleClaimQuest = (questId: string, xpReward: number) => {
    playClaimXpSound();
    onAddXp(xpReward);
    onClaimQuest(questId, xpReward);
  };

  const claimedQuests = userProfile.claimedDailyQuests || [];
  const highScores = userProfile.gameHighScores || {};

  // List of Daily Quests
  const dailyQuests: DailyQuest[] = [
    {
      id: 'quest-speed',
      title: 'Tantangan Sambung Kata',
      description: 'Mainkan Sambung Kata Kilat dan raih skor minimal 100 poin',
      xpReward: 30,
      progress: (highScores['speed'] || 0) >= 100 ? 1 : 0,
      target: 1,
      isClaimed: claimedQuests.includes('quest-speed'),
      iconName: 'Zap'
    },
    {
      id: 'quest-scramble',
      title: 'Susun Kata Daerah',
      description: 'Selesaikan susunan teka-teki kata acak nusantara',
      xpReward: 40,
      progress: (highScores['scramble'] || 0) >= 15 ? 1 : 0,
      target: 1,
      isClaimed: claimedQuests.includes('quest-scramble'),
      iconName: 'Shuffle'
    },
    {
      id: 'quest-memory',
      title: 'Kekuatan Ingatan',
      description: 'Cocokkan pasangan kartu kosakata daerah di Memory Match',
      xpReward: 35,
      progress: (highScores['memory'] || 0) >= 1 ? 1 : 0,
      target: 1,
      isClaimed: claimedQuests.includes('quest-memory'),
      iconName: 'Layers'
    }
  ];

  // Game Cards Configuration
  const gameCatalog = [
    {
      id: 'speed' as const,
      title: 'Sambung Kata Kilat',
      subtitle: 'Speed Word Match (45s)',
      description: 'Tantangan adu cepat menebak arti kosakata dalam 45 detik dengan combo multiplier hingga 4x.',
      badge: 'Favorit Komunitas',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-600',
      difficulty: 'Cepat & Intensif',
      highScore: highScores['speed'] || 0,
      xpPotential: '+50-150 XP'
    },
    {
      id: 'scramble' as const,
      title: 'Susun Kata Daerah',
      subtitle: 'Tile Word Anagram Puzzle',
      description: 'Teka-teki menyusun balok huruf acak menjadi kosakata asli daerah yang tepat beserta petunjuk fonetik.',
      badge: 'Mengasah Otak',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      icon: Shuffle,
      gradient: 'from-green-600 to-emerald-700',
      difficulty: 'Tersedia 3 Tingkat',
      highScore: highScores['scramble'] || 0,
      xpPotential: '+15-40 XP/Kata'
    },
    {
      id: 'memory' as const,
      title: 'Pencocokan Kartu Ingatan',
      subtitle: '3D Memory Card Match',
      description: 'Buka kartu dan temukan pasangan antara kosakata daerah dan artinya. Raih bintang 3 dengan langkah minimal!',
      badge: 'Visual & Seru',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      icon: Layers,
      gradient: 'from-blue-600 to-indigo-700',
      difficulty: '6-16 Kartu',
      highScore: highScores['memory'] || 0,
      xpPotential: '+15-50 XP'
    },
    {
      id: 'wordle' as const,
      title: 'Katla Nusantara (5 Huruf)',
      subtitle: 'Mystery Regional Word Guesser',
      description: 'Tebak kata misteri 5 huruf khas daerah dalam 6 kesempatan dengan petunjuk warna ubin dan keyboard interaktif.',
      badge: 'Tantangan Harian',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      icon: Sparkles,
      gradient: 'from-purple-600 to-fuchsia-700',
      difficulty: 'Sedang',
      highScore: highScores['wordle'] || 0,
      xpPotential: '+35-55 XP'
    },
    {
      id: 'audio' as const,
      title: 'Tebak Suara & Pelafalan',
      subtitle: 'Audio Dialect Listening Quiz',
      description: 'Dengarkan suara penutur asli dialek daerah dan tebak arti maknanya. Uji ketajaman telinga linguistik Anda!',
      badge: 'Audio Interaktif',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      icon: Headphones,
      gradient: 'from-rose-500 to-pink-600',
      difficulty: 'Semua Tingkat',
      highScore: highScores['audio'] || 0,
      xpPotential: '+20 XP/Soal'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* If a game is actively playing */}
      {activeGame === 'speed' && (
        <SpeedWordGame
          currentLang={targetLang}
          onAddXp={onAddXp}
          onRecordHighScore={score => onRecordGameScore('speed', score)}
          highScore={highScores['speed'] || 0}
          onExit={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'scramble' && (
        <WordScrambleGame
          currentLang={targetLang}
          onAddXp={onAddXp}
          onExit={() => {
            onRecordGameScore('scramble', (highScores['scramble'] || 0) + 1);
            setActiveGame(null);
          }}
        />
      )}

      {activeGame === 'memory' && (
        <MemoryMatchGame
          currentLang={targetLang}
          onAddXp={onAddXp}
          onExit={() => {
            onRecordGameScore('memory', (highScores['memory'] || 0) + 1);
            setActiveGame(null);
          }}
        />
      )}

      {activeGame === 'wordle' && (
        <WordleNusantaraGame
          currentLang={targetLang}
          onAddXp={onAddXp}
          onExit={() => {
            onRecordGameScore('wordle', (highScores['wordle'] || 0) + 1);
            setActiveGame(null);
          }}
        />
      )}

      {activeGame === 'audio' && (
        <AudioGuessGame
          currentLang={targetLang}
          onAddXp={onAddXp}
          onExit={() => {
            onRecordGameScore('audio', (highScores['audio'] || 0) + 1);
            setActiveGame(null);
          }}
        />
      )}

      {/* Main Arcade Hub View (When no game is active) */}
      {!activeGame && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-50 rounded-full opacity-60 pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Arena Permainan Edukasi Nusantara</span>
              </div>

              {/* Sound & Spin Wheel Quick Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSound}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Aktifkan / Matikan Efek Suara"
                >
                  {soundOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-green-700" />
                      <span>Suara: Nyala</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Suara: Bisu</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowWheelModal(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-xs cursor-pointer ${
                    canSpinWheel
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{canSpinWheel ? '🎁 Putar Roda Harian!' : 'Roda Hadiah'}</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Arena Permainan & Kuis Interaktif
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
                Belajar bahasa daerah kini jauh lebih seru! Mainkan <strong>Sambung Kata Kilat</strong>, teka-teki <strong>Susun Kata</strong>, <strong>Memory Card Match</strong>, <strong>Katla 5 Huruf</strong>, hingga tantangan <strong>Tebak Suara</strong> untuk mengumpulkan XP dan menaikkan level profil Anda.
              </p>
            </div>
          </div>

          {/* Daily Quests / Misi Harian Section */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-700" />
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Misi Harian & Tantangan XP
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Reset Setiap Hari
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dailyQuests.map(quest => (
                <div
                  key={quest.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">
                        {quest.title}
                      </span>
                      <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    {quest.isClaimed ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Sudah Diklaim
                      </span>
                    ) : quest.progress >= quest.target ? (
                      <button
                        onClick={() => handleClaimQuest(quest.id, quest.xpReward)}
                        className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all animate-bounce cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Klaim +{quest.xpReward} XP!</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Belum Selesai (Mainkan game untuk membuka)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {gameCatalog.map(game => {
              const IconComp = game.icon;

              return (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-green-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between overflow-hidden p-6 space-y-4"
                  id={`game-card-${game.id}`}
                >
                  <div className="space-y-4">
                    
                    {/* Game Header: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-7 h-7" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${game.badgeColor}`}>
                          {game.badge}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {game.xpPotential}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-green-700 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs font-mono text-green-800 font-semibold">
                        {game.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {game.description}
                      </p>
                    </div>

                  </div>

                  {/* Footer & High Score */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">
                        Rekor Anda: <strong className="text-slate-900">{game.highScore > 0 ? game.highScore : '-'}</strong>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {game.difficulty}
                      </span>
                    </div>

                    <div className="w-full py-2.5 bg-slate-100 group-hover:bg-green-700 text-slate-700 group-hover:text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors">
                      <span>Mainkan Sekarang</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Daily Wheel Modal */}
      {showWheelModal && (
        <DailyWheelModal
          onClaimReward={handleWheelRewardClaim}
          onClose={() => setShowWheelModal(false)}
          canSpin={canSpinWheel}
        />
      )}

    </div>
  );
};
