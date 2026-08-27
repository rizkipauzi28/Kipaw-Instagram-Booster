import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  UserCheck,
  Heart,
  Eye,
  Flame,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Instagram,
  Clock,
  ChevronRight,
  AlertCircle,
  Zap,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Campaign, Task, PointTransaction, SystemSettings } from '../types';
import { storage } from '../lib/storage';

interface DashboardProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
  onOpenCreateCampaign: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenCreateCampaign,
}) => {
  const [streakClaimMessage, setStreakClaimMessage] = useState<string | null>(null);

  const campaigns = storage.getUserCampaigns(currentUser.id);
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE');
  const availableTasks = storage.getAvailableTasks(currentUser.id).slice(0, 3);
  const recentTransactions = storage.getUserTransactions(currentUser.id).slice(0, 5);
  const userSubmissions = storage.getUserSubmissions(currentUser.id);
  const settings = storage.getSettings();

  // Real success rate calculation
  const approvedCount = userSubmissions.filter((s) => s.status === 'APPROVED').length;
  const totalSubmissions = userSubmissions.length;
  const successRate = totalSubmissions > 0 ? Math.round((approvedCount / totalSubmissions) * 100) : 100;

  const handleClaimDaily = () => {
    const res = storage.claimDailyReward(currentUser.id);
    setStreakClaimMessage(res.message);
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Announcement Banner if Active */}
      {settings.announcementActive && settings.announcementText && (
        <div className="p-4 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{settings.announcementText}</span>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-[11px] font-bold text-pink-400 hover:text-pink-300 underline shrink-0 ml-2"
          >
            Ambil Task Sekarang →
          </button>
        </div>
      )}

      {/* Bento Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 p-0.5 shadow-xl shadow-purple-900/30 shrink-0">
              <div className="w-full h-full rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center font-black text-xl text-white">
                {currentUser.avatarUrl || currentUser.instagramProfile?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl || currentUser.instagramProfile?.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentUser.displayName.charAt(0)
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Halo, {currentUser.displayName}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Active Member
                </span>
                {currentUser.isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    Administrator
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="flex items-center space-x-1 text-pink-400 font-semibold font-mono">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@{currentUser.instagramProfile?.username || currentUser.username}</span>
                </span>
                <span>•</span>
                <span className="text-slate-400">Niche: <strong className="text-slate-200">{currentUser.instagramProfile?.niche || 'Personal'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Top Actions */}
          <div className="flex items-center gap-3">
            <button
              id="btn-create-campaign-dash"
              onClick={onOpenCreateCampaign}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>

            <button
              onClick={() => onNavigate('tasks')}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-slate-950/60 hover:bg-slate-900 text-slate-200 font-semibold text-xs border border-slate-800 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Task Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bento Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento Tile 1: IG Points */}
        <div
          onClick={() => onNavigate('points')}
          className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 cursor-pointer shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-300 group-hover:translate-x-0.5 transition flex items-center gap-1">
              Rincian <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">
            {currentUser.points.toLocaleString('id-ID')}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">IG Points Saldo</p>
        </div>

        {/* Bento Tile 2: Tasks Completed */}
        <div
          onClick={() => onNavigate('tasks')}
          className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-300 group-hover:translate-x-0.5 transition flex items-center gap-1">
              Kerjakan <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">
            {currentUser.tasksCompletedCount}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Tasks Completed</p>
        </div>

        {/* Bento Tile 3: Followers Earned */}
        <div
          onClick={() => onNavigate('campaigns')}
          className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-pink-500/40 transition-all duration-300 cursor-pointer shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-pink-300 group-hover:translate-x-0.5 transition flex items-center gap-1">
              Campaigns <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">
            {currentUser.followersEarnedCount}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Followers Earned</p>
        </div>

        {/* Bento Tile 4: Likes & Views Earned */}
        <div
          onClick={() => onNavigate('campaigns')}
          className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-rose-500/40 transition-all duration-300 cursor-pointer shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-rose-300 group-hover:translate-x-0.5 transition flex items-center gap-1">
              Postingan <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">
            {currentUser.likesEarnedCount + currentUser.viewsEarnedCount}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Likes & Views Earned</p>
        </div>
      </div>

      {/* Secondary Bento Grid Trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Streak Bento Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Daily Login Streak</p>
              <p className="text-base font-black text-amber-300">
                {currentUser.dailyStreak} Hari Berturut-turut
              </p>
            </div>
          </div>
          <button
            onClick={handleClaimDaily}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Klaim Bonus
          </button>
        </div>

        {/* Success Rate Bento Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Task Success Rate</p>
              <p className="text-base font-black text-emerald-400">{successRate}% Terverifikasi</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Valid
          </span>
        </div>

        {/* Active Campaigns Count Bento Card */}
        <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Campaigns Aktif</p>
              <p className="text-base font-black text-purple-300">{activeCampaigns.length} Sedang Berjalan</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('campaigns')}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold underline"
          >
            Lihat
          </button>
        </div>
      </div>

      {streakClaimMessage && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <span>{streakClaimMessage}</span>
          <button
            onClick={() => setStreakClaimMessage(null)}
            className="text-[10px] underline font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Large Bento Grid Layout: Active Campaigns Tracker & Recommended Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Campaigns Tracker Bento Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-white">Campaigns Saya</h2>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs font-bold text-pink-400 hover:text-pink-300"
            >
              Kelola Semua ({campaigns.length}) →
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="py-10 text-center text-slate-500 space-y-3">
              <p className="text-xs">Anda belum memiliki campaign engagement aktif.</p>
              <button
                onClick={onOpenCreateCampaign}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs transition"
              >
                Buat Campaign Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {campaigns.slice(0, 3).map((cmp) => {
                const percent = Math.min(100, Math.round((cmp.completedCount / cmp.targetCount) * 100));
                return (
                  <div
                    key={cmp.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2.5 hover:border-slate-700/80 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white truncate max-w-[200px]">
                            {cmp.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                            {cmp.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-pink-400 font-mono mt-0.5">
                          Target: @{cmp.targetInstagramUsername}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          cmp.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cmp.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                        <span>Progress Real</span>
                        <span className="text-white font-bold">
                          {cmp.completedCount} / {cmp.targetCount} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Tasks Bento Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-white">Rekomendasi Task</h2>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              Lihat Marketplace →
            </button>
          </div>

          <div className="space-y-3">
            {availableTasks.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs">
                Tidak ada task baru saat ini.
              </div>
            ) : (
              availableTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between gap-3 hover:border-purple-500/30 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white truncate">{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                        {t.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                      <span className="font-mono text-pink-300">@{t.targetUsername}</span>
                      <span>•</span>
                      <span className="text-slate-400">{t.niche}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{t.estimatedTimeSeconds}s</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/30">
                      +{t.rewardPoints} Pts
                    </span>
                    <button
                      onClick={() => onNavigate('tasks')}
                      className="p-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white transition cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Point Ledger Bento Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-base text-white">Riwayat IG Points Terbaru</h2>
          </div>
          <button
            onClick={() => onNavigate('points')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            Lihat Buku Kas Poin Lengkap →
          </button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">Belum ada transaksi poin.</div>
          ) : (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                      tx.amount > 0
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {tx.type}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-200">{tx.description}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(tx.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-black text-sm ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Pts
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
