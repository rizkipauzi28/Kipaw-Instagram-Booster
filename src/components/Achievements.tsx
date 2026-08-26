import React from 'react';
import { Award, Lock, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { storage } from '../lib/storage';
import { User } from '../types';

interface AchievementsProps {
  currentUser: User;
}

export const Achievements: React.FC<AchievementsProps> = ({ currentUser }) => {
  const achievements = storage.getAchievementsWithStatus(currentUser.id);
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bento Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>Badges & Milestones</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Pencapaian Komunitas ({unlockedCount}/{achievements.length} Terbuka)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          Raih lencana eksklusif dengan berkontribusi aktif menyelesaikan task dan memperluas jaringan Instagram Anda.
        </p>

        {/* Progress Bar */}
        <div className="pt-2 max-w-md">
          <div className="w-full h-3 rounded-full bg-slate-950/80 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Bento Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-6 rounded-3xl backdrop-blur-md border transition-all duration-300 flex flex-col justify-between shadow-xl relative ${
              ach.isUnlocked
                ? 'bg-slate-900/40 border-purple-500/40 hover:border-purple-400/60'
                : 'bg-slate-950/40 border-slate-800/60 opacity-65'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{ach.icon}</span>
                {ach.isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terbuka</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Terkunci</span>
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-white mb-1">{ach.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              {ach.isUnlocked ? (
                <span className="text-purple-300 font-medium">
                  Terbuka pada {new Date(ach.unlockedAt || '').toLocaleDateString('id-ID')}
                </span>
              ) : (
                <span>
                  Syarat:{' '}
                  {ach.requiredTasks ? `${ach.requiredTasks} Tasks Selesai` : ''}
                  {ach.requiredPoints ? `${ach.requiredPoints} IG Points` : ''}
                  {ach.requiredStreak ? `${ach.requiredStreak} Hari Streak` : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
