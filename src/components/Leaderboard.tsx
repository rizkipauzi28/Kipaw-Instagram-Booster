import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Medal,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  UserCheck,
  Instagram,
  Coins
} from 'lucide-react';
import { storage } from '../lib/storage';
import { User } from '../types';

export const Leaderboard: React.FC = () => {
  const [rankingTab, setRankingTab] = useState<'EARNERS' | 'CONTRIBUTORS' | 'CAMPAIGNS'>('EARNERS');

  const allUsers = storage.getAllUsers().filter((u) => !u.isBanned);

  // Sorting
  const sortedUsers = [...allUsers].sort((a, b) => {
    if (rankingTab === 'EARNERS') {
      return b.points - a.points;
    } else if (rankingTab === 'CONTRIBUTORS') {
      return b.tasksCompletedCount - a.tasksCompletedCount;
    } else {
      return b.followersEarnedCount + b.likesEarnedCount - (a.followersEarnedCount + a.likesEarnedCount);
    }
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bento Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-3 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Hall of Fame & Rankings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Peringkat Komunitas KIPAW
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Kreator dan anggota paling aktif yang saling membantu dan memperluas jangkauan Instagram di Indonesia.
        </p>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 pt-3">
          {[
            { id: 'EARNERS', label: 'Top Points Earner', icon: Coins },
            { id: 'CONTRIBUTORS', label: 'Top Task Contributors', icon: Sparkles },
            { id: 'CAMPAIGNS', label: 'Top Growth Champions', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = rankingTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRankingTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {sortedUsers.slice(0, 3).map((user, index) => {
          const rank = index + 1;
          const medals = ['👑 1st Rank', '🥈 2nd Rank', '🥉 3rd Rank'];
          const borders = [
            'border-amber-500/40 bg-amber-500/5',
            'border-slate-600/40 bg-slate-800/10',
            'border-orange-500/40 bg-orange-500/5',
          ];

          return (
            <div
              key={user.id}
              className={`p-6 rounded-3xl backdrop-blur-md border ${borders[index]} shadow-xl text-center space-y-3 relative overflow-hidden`}
            >
              <span className="text-xs font-black text-amber-300 block">{medals[index]}</span>
              <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center font-bold text-xl text-white">
                  {user.instagramProfile?.avatarUrl ? (
                    <img
                      src={user.instagramProfile.avatarUrl}
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.displayName.charAt(0)
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">{user.displayName}</h3>
                <p className="text-xs font-mono text-pink-400">
                  @{user.instagramProfile?.username || user.username}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {user.instagramProfile?.niche || 'Personal'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                {rankingTab === 'EARNERS' && (
                  <span className="font-black text-amber-300">
                    {user.points.toLocaleString('id-ID')} IG Points
                  </span>
                )}
                {rankingTab === 'CONTRIBUTORS' && (
                  <span className="font-black text-emerald-400">
                    {user.tasksCompletedCount} Tasks Selesai
                  </span>
                )}
                {rankingTab === 'CAMPAIGNS' && (
                  <span className="font-black text-purple-300">
                    +{user.followersEarnedCount + user.likesEarnedCount} Engagement
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Bento Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">Peringkat Komunitas Lengkap</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3">Rank</th>
                <th className="pb-3">User & Instagram</th>
                <th className="pb-3">Niche</th>
                <th className="pb-3 text-center">Tasks</th>
                <th className="pb-3 text-right">IG Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-slate-400 text-xs">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-white">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{user.displayName}</p>
                        <p className="text-[11px] font-mono text-pink-400">
                          @{user.instagramProfile?.username || user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-400">{user.instagramProfile?.niche || 'Personal'}</td>
                  <td className="py-3.5 text-center font-semibold text-slate-300">
                    {user.tasksCompletedCount}
                  </td>
                  <td className="py-3.5 text-right font-black text-amber-300">
                    {user.points.toLocaleString('id-ID')} Pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
