import React, { useState, useRef } from 'react';
import { Sparkles, Trophy, Award, RotateCw, X, Flame } from 'lucide-react';
import { 
  playWheelTickSound, 
  playVictorySound, 
  playClaimXpSound 
} from '../../utils/soundEffects';

interface DailyWheelModalProps {
  onClaimReward: (xpAmount: number, description: string) => void;
  onClose: () => void;
  canSpin: boolean;
}

interface WheelSlice {
  label: string;
  sublabel: string;
  xp: number;
  color: string;
  textColor: string;
}

const WHEEL_SLICES: WheelSlice[] = [
  { label: '+25 XP', sublabel: 'Bonus Belajar', xp: 25, color: '#10b981', textColor: '#ffffff' },
  { label: '+50 XP', sublabel: 'Petualang Kata', xp: 50, color: '#f59e0b', textColor: '#ffffff' },
  { label: '+15 XP', sublabel: 'Kosakata Baru', xp: 15, color: '#059669', textColor: '#ffffff' },
  { label: '+100 XP', sublabel: 'JACKPOT NUSANTARA', xp: 100, color: '#e11d48', textColor: '#ffffff' },
  { label: '+30 XP', sublabel: 'Streak Bonus', xp: 30, color: '#3b82f6', textColor: '#ffffff' },
  { label: '+75 XP', sublabel: 'Pendekar Bahasa', xp: 75, color: '#8b5cf6', textColor: '#ffffff' },
  { label: '+20 XP', sublabel: 'Kuis Harian', xp: 20, color: '#14b8a6', textColor: '#ffffff' },
  { label: '+40 XP', sublabel: 'Bintang Nusantara', xp: 40, color: '#d97706', textColor: '#ffffff' },
];

export const DailyWheelModal: React.FC<DailyWheelModalProps> = ({
  onClaimReward,
  onClose,
  canSpin
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [wonPrize, setWonPrize] = useState<WheelSlice | null>(null);

  const numSlices = WHEEL_SLICES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpinWheel = () => {
    if (isSpinning || !canSpin) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Pick random slice index (0 to 7)
    const winningIdx = Math.floor(Math.random() * numSlices);
    const winningSlice = WHEEL_SLICES[winningIdx];

    // Calculate rotation: at least 5 full rotations + offset to the center of winning slice
    // Top pointer is at 0/360 degrees (top center)
    const extraRounds = 5 + Math.floor(Math.random() * 3);
    const targetSliceDegree = 360 - (winningIdx * sliceAngle + sliceAngle / 2);
    const totalRotation = rotationDegrees + (extraRounds * 360) + targetSliceDegree;

    setRotationDegrees(totalRotation);

    // Periodic wheel tick sounds
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playWheelTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonPrize(winningSlice);
      playVictorySound();
      onClaimReward(winningSlice.xp, winningSlice.sublabel);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-7 text-center space-y-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Banner */}
        <div className="space-y-1 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Roda Keberuntungan Harian</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            Putar Roda Nusantara
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Putar 1x gratis setiap hari untuk memenangkan bonus XP dan hadiah belajar!
          </p>
        </div>

        {/* Wheel Canvas / SVG */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          
          {/* Pointer Marker at the Top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-rose-600 drop-shadow-md" />

          {/* Rotating Wheel Body */}
          <div
            className="w-64 h-64 rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden relative transition-transform duration-[3800ms] ease-out"
            style={{ transform: `rotate(${rotationDegrees}deg)` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {WHEEL_SLICES.map((slice, i) => {
                const angle = (360 / numSlices);
                const startAngle = i * angle - 90;
                const endAngle = (i + 1) * angle - 90;

                const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + angle / 2;
                const textX = 100 + 65 * Math.cos((Math.PI * midAngle) / 180);
                const textY = 100 + 65 * Math.sin((Math.PI * midAngle) / 180);

                return (
                  <g key={i}>
                    <path d={pathData} fill={slice.color} stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={textX}
                      y={textY}
                      fill={slice.textColor}
                      fontSize="10"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {slice.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Wheel Center Hub */}
            <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full border-4 border-slate-800 shadow-md flex items-center justify-center text-xs font-black text-slate-900">
              LN
            </div>
          </div>
        </div>

        {/* Prize Notification Box */}
        {wonPrize && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 animate-in zoom-in-95 duration-200">
            <h4 className="font-black text-emerald-950 text-base">
              🎉 Selamat! Anda Memenangkan: {wonPrize.label}
            </h4>
            <p className="text-xs text-emerald-800 font-bold">
              {wonPrize.sublabel} (+{wonPrize.xp} XP telah dikreditkan ke profil Anda)
            </p>
          </div>
        )}

        {/* Spin Button */}
        <div className="pt-2">
          <button
            onClick={handleSpinWheel}
            disabled={isSpinning || !canSpin}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              !canSpin
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : isSpinning
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-102 active:scale-98'
            }`}
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning
                ? 'Sedang Memutar Roda...'
                : canSpin
                ? 'Putar Roda Sekarang!'
                : 'Sudah Diputar Hari Ini (Kembali Besok)'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
