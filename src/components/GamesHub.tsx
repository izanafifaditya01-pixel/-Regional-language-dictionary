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
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#14532D]">
                Arena Permainan Edukasi · Leksika Nusantara
              </span>

              {/* Sound & Spin Wheel Quick Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSound}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EFECE4] hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer whitespace-nowrap"
                  title="Aktifkan / Matikan Efek Suara"
                >
                  {soundOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#14532D]" />
                      <span>Suara: Aktif</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                      <span>Suara: Bisu</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowWheelModal(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    canSpinWheel
                      ? 'bg-[#14532D] hover:bg-[#166534] text-white'
                      : 'bg-[#EFECE4] text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{canSpinWheel ? 'Putar Roda Harian' : 'Roda Hadiah'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Permainan Kosakata & Tantangan Interaktif
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                Asah daya ingat linguistik melalui <strong>Sambung Kata Kilat</strong>, teka-teki <strong>Susun Kata</strong>, <strong>Memory Card Match</strong>, <strong>Katla 5 Huruf</strong>, hingga <strong>Tebak Suara</strong> untuk mengumpulkan poin pengalaman.
              </p>
            </div>
          </div>

          {/* Daily Quests / Misi Harian Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#14532D]" />
                <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Misi Harian & Tantangan XP
                </h3>
              </div>
              <span className="text-xs font-medium text-stone-500">
                Diperbarui Setiap Hari
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
              {dailyQuests.map(quest => (
                <div
                  key={quest.id}
                  className="p-4 rounded-xl border border-stone-200/80 bg-[#F8F6F1] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {quest.title}
                      </span>
                      <span className="text-xs font-mono font-semibold text-amber-800 tabular-nums shrink-0">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-stone-200/70">
                    {quest.isClaimed ? (
                      <span className="text-xs font-semibold text-[#14532D] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Sudah Diklaim
                      </span>
                    ) : quest.progress >= quest.target ? (
                      <button
                        onClick={() => handleClaimQuest(quest.id, quest.xpReward)}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Klaim +{quest.xpReward} XP</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-stone-500">
                        Belum selesai · Mainkan gim terkait
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {gameCatalog.map(game => {
              const IconComp = game.icon;

              return (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#14532D]/50 transition-all cursor-pointer group flex flex-col justify-between p-6 space-y-4"
                  id={`game-card-${game.id}`}
                >
                  <div className="space-y-4">
                    
                    {/* Game Header: Icon & Unboxed Metadata */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#EFECE4] text-[#14532D] group-hover:bg-[#14532D] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <IconComp className="w-6 h-6" />
                      </div>

                      <div className="text-right text-[11px] font-medium text-stone-500 tabular-nums">
                        <span className="block font-semibold text-stone-700">{game.badge}</span>
                        <span className="font-mono text-[#14532D]">{game.xpPotential}</span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#14532D] transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs font-mono text-stone-500 mt-0.5">
                        {game.subtitle}
                      </p>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                  </div>

                  {/* Footer & High Score */}
                  <div className="pt-4 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="tabular-nums">
                        Rekor: <strong className="text-stone-900 font-mono">{game.highScore > 0 ? game.highScore : '—'}</strong>
                      </span>
                      <span>
                        {game.difficulty}
                      </span>
                    </div>

                    <div className="w-full py-2.5 bg-[#EFECE4] group-hover:bg-[#14532D] text-stone-800 group-hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap">
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
