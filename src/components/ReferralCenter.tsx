import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  Users,
  ShieldAlert,
  ShieldCheck,
  Share2,
  Sparkles,
  ArrowRight,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, ReferralRecord } from '../types';
import { storage } from '../lib/storage';

interface ReferralCenterProps {
  currentUser: User;
}

export const ReferralCenter: React.FC<ReferralCenterProps> = ({ currentUser }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referrals = storage.getUserReferrals(currentUser.id);
  const totalEarnedFromRefs = referrals.reduce((sum, r) => sum + r.rewardPoints, 0);

  const referralLink = `${window.location.origin}?ref=${currentUser.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    confetti({ particleCount: 30, spread: 40 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bento Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>Referral Program</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Undang Teman & Dapatkan +100 IG Points
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ajak kreator, teman, atau pemilik bisnis lain untuk bertukar engagement di KIPAW IG BOOSTER. Anda mendapatkan{' '}
            <span className="text-amber-300 font-bold">+100 Points</span> dan teman Anda mendapatkan{' '}
            <span className="text-pink-300 font-bold">+50 Points</span> bonus!
          </p>
        </div>

        {/* Share Boxes Bento */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 relative z-10">
          {/* Referral Code Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400">Kode Referral Anda:</span>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
              <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                {currentUser.referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
              </button>
            </div>
          </div>

          {/* Referral Share Link Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400">Tautan Undangan Langsung:</span>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-300 truncate max-w-[200px] font-mono">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Stats Summary Bento */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{referrals.length}</p>
            <p className="text-xs text-slate-400 font-semibold">Total Teman Diundang</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-300">+{totalEarnedFromRefs}</p>
            <p className="text-xs text-slate-400 font-semibold">Total Points Referral Didapat</p>
          </div>
        </div>
      </div>

      {/* Anti-Abuse Protection Notice Bento */}
      <div className="p-5 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400 leading-relaxed shadow-xl">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-200">Sistem Keamanan Anti-Abuse & Multi-Akun</p>
          <p className="mt-1 text-slate-400">
            KIPAW IG BOOSTER menggunakan deteksi perangkat privacy-friendly dan rate limiting. Pendaftaran akun kloning/duplikat pada perangkat atau jaringan yang sama tidak akan mendapatkan reward poin dan dapat mengakibatkan pembekuan akun.
          </p>
        </div>
      </div>

      {/* Referral History Table Bento */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white">Daftar Teman Yang Bergabung</h2>
          <span className="text-xs text-slate-500">{referrals.length} Riwayat</span>
        </div>

        <div className="overflow-x-auto">
          {referrals.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Belum ada teman yang bergabung menggunakan kode Anda. Bagikan kode sekarang!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Username Pengguna</th>
                  <th className="pb-3">Tanggal Bergabung</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 font-semibold text-slate-200">@{ref.referredUsername}</td>
                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {new Date(ref.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-black text-amber-300">
                      +{ref.rewardPoints} Pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
