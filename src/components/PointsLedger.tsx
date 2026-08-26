import React, { useState } from 'react';
import {
  Coins,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  ShieldCheck,
  Calendar,
  Sparkles,
  Award,
  Clock,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, PointTransaction, TransactionType } from '../types';
import { storage } from '../lib/storage';

interface PointsLedgerProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
}

const DAILY_REWARDS_TABLE = [
  { day: 1, points: 10 },
  { day: 2, points: 15 },
  { day: 3, points: 20 },
  { day: 4, points: 30 },
  { day: 5, points: 40 },
  { day: 6, points: 60 },
  { day: 7, points: 100 },
];

export const PointsLedger: React.FC<PointsLedgerProps> = ({ currentUser, onNavigate }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  const transactions = storage.getUserTransactions(currentUser.id);

  const filteredTx = transactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    return tx.type === filterType;
  });

  const handleClaim = () => {
    const res = storage.claimDailyReward(currentUser.id);
    setClaimMsg(res.message);
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Wallet Bento Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-2">
              <Coins className="w-4 h-4" />
              <span>IG POINTS WALLET</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {currentUser.points.toLocaleString('id-ID')}{' '}
              <span className="text-amber-300 text-xl sm:text-2xl font-bold">Points</span>
            </p>
            <p className="text-xs text-slate-300 mt-2">
              Mata uang internal pertukaran engagement organik. Dapatkan gratis dengan mengerjakan task!
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cari Task Baru</span>
            </button>

            <button
              onClick={() => onNavigate('referral')}
              className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 transition flex items-center space-x-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Undang Teman (+100 Pts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Reward 7-Day Streak Calendar Bento Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Daily Login Reward & Streak</h2>
              <p className="text-[11px] text-slate-400">
                Streak Anda: <b className="text-amber-300">{currentUser.dailyStreak} Hari Berturut-turut</b>
              </p>
            </div>
          </div>

          <button
            id="btn-claim-daily-ledger"
            onClick={handleClaim}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>Klaim Reward Hari Ini</span>
          </button>
        </div>

        {claimMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
            <span>{claimMsg}</span>
            <button onClick={() => setClaimMsg(null)} className="text-[10px] underline font-bold cursor-pointer">
              Tutup
            </button>
          </div>
        )}

        {/* 7 Days Reward Cards Bento Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
          {DAILY_REWARDS_TABLE.map((item) => {
            const isReached = item.day <= currentUser.dailyStreak;
            const isToday = item.day === currentUser.dailyStreak;
            return (
              <div
                key={item.day}
                className={`p-3.5 rounded-2xl text-center border transition flex flex-col justify-between ${
                  isToday
                    ? 'bg-amber-500/10 border-amber-500/80 shadow-lg ring-1 ring-amber-500/40'
                    : isReached
                    ? 'bg-purple-950/20 border-purple-500/30'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Hari {item.day}
                </span>
                <span className="text-lg font-black text-amber-300 my-1">
                  +{item.points}
                </span>
                <span className="text-[10px] text-slate-400">
                  {item.day === 7 ? '🎉 Max Bonus' : 'IG Points'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immutable Point Transaction Ledger Bento Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Buku Kas Mutasi Poin (Ledger)</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['ALL', 'EARN', 'SPEND', 'BONUS', 'REFERRAL', 'ADMIN_ADJUSTMENT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                  filterType === type
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {filteredTx.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada catatan mutasi poin sesuai filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Waktu & Tanggal</th>
                  <th className="pb-3">Tipe</th>
                  <th className="pb-3">Deskripsi Transaksi</th>
                  <th className="pb-3 text-right">Jumlah Poin</th>
                  <th className="pb-3 text-right">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTx.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(tx.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            tx.type === 'EARN'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tx.type === 'SPEND'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : tx.type === 'REFERRAL'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-200 font-medium max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td
                        className={`py-3.5 text-right font-black text-xs ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPositive ? `+${tx.amount}` : tx.amount} Pts
                      </td>
                      <td className="py-3.5 text-right text-slate-400 font-mono">
                        {tx.balanceAfter.toLocaleString('id-ID')} Pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
