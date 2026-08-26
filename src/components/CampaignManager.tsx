import React, { useState } from 'react';
import {
  PlusCircle,
  Coins,
  Sparkles,
  Instagram,
  Heart,
  UserCheck,
  MessageSquare,
  Eye,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  Layers,
  Play,
  Pause,
  Trash2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Campaign, CampaignType, NicheType } from '../types';
import { storage } from '../lib/storage';

interface CampaignManagerProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

const NICHES: NicheType[] = [
  'Fashion',
  'Gaming',
  'Kuliner',
  'Beauty',
  'Education',
  'Business',
  'Technology',
  'Travel',
  'Personal',
  'Other',
];

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  currentUser,
  onNavigate,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const [campaignType, setCampaignType] = useState<CampaignType>('FOLLOWERS');
  const [targetUsername, setTargetUsername] = useState(currentUser.instagramProfile?.username || '');
  const [targetUrl, setTargetUrl] = useState(currentUser.instagramProfile?.profileUrl || '');
  const [targetCount, setTargetCount] = useState<number>(20);
  const [commentGuide, setCommentGuide] = useState('');
  const [niche, setNiche] = useState<NicheType>(currentUser.instagramProfile?.niche || 'Personal');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalCampaign, setDeleteModalCampaign] = useState<Campaign | null>(null);

  const settings = storage.getSettings();
  const myCampaigns = storage.getUserCampaigns(currentUser.id);

  // Dynamic cost calculation based on admin settings
  const getCostPerAction = (type: CampaignType): number => {
    switch (type) {
      case 'FOLLOWERS':
        return settings.followReward;
      case 'LIKES':
        return settings.likeReward;
      case 'COMMENTS':
        return settings.commentReward;
      case 'STORY_VIEWS':
        return settings.storyViewReward;
      case 'PROFILE_VISITS':
        return settings.profileVisitReward;
    }
  };

  const costPerAction = getCostPerAction(campaignType);
  const totalCost = targetCount * costPerAction;
  const hasEnoughPoints = currentUser.points >= totalCost;

  const handleTypeChange = (type: CampaignType) => {
    setCampaignType(type);
    if (type === 'FOLLOWERS' || type === 'PROFILE_VISITS') {
      const username = currentUser.instagramProfile?.username || targetUsername;
      setTargetUrl(`https://instagram.com/${username}`);
    } else if (type === 'LIKES' || type === 'COMMENTS') {
      setTargetUrl('https://www.instagram.com/p/XXXXXXXX/');
    } else if (type === 'STORY_VIEWS') {
      const username = currentUser.instagramProfile?.username || targetUsername;
      setTargetUrl(`https://instagram.com/stories/${username}`);
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = storage.createCampaign({
      userId: currentUser.id,
      type: campaignType,
      targetInstagramUsername: targetUsername,
      targetUrl,
      targetCount,
      commentGuide: campaignType === 'COMMENTS' ? commentGuide : undefined,
      niche,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Gagal membuat campaign.');
      return;
    }

    setIsCreateModalOpen(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleToggleStatus = (campaign: Campaign) => {
    const nextStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    storage.adminSetCampaignStatus(campaign.id, nextStatus);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bento Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white">Campaign Dashboard</h1>
            <span className="px-3 py-0.5 rounded-full bg-pink-500/10 text-pink-300 text-xs font-bold border border-pink-500/20">
              {myCampaigns.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pantau perkembangan followers, likes, dan views organik dari pengguna nyata.
          </p>
        </div>

        <button
          id="btn-open-create-campaign-modal"
          onClick={() => {
            setErrorMsg('');
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Campaign Baru</span>
        </button>
      </div>

      {/* Campaigns Bento List */}
      {myCampaigns.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Belum Ada Campaign Aktif</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Mulai buat campaign pertama Anda untuk mendapatkan followers asli, likes postingan, atau views Instagram dari pengguna komunitas.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition cursor-pointer"
          >
            Buat Campaign Sekarang (+{costPerAction} Pts / Action)
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myCampaigns.map((cmp) => {
            const percent = Math.min(100, Math.round((cmp.completedCount / cmp.targetCount) * 100));
            const remaining = Math.max(0, cmp.targetCount - cmp.completedCount);
            return (
              <div
                key={cmp.id}
                className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-purple-500/40 shadow-xl space-y-4 transition-all duration-300"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        {cmp.type}
                      </span>
                      <span className="text-[11px] text-slate-500">{cmp.niche}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{cmp.title}</h3>
                    <p className="text-xs font-mono text-purple-400 mt-0.5">
                      Target: @{cmp.targetInstagramUsername}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      cmp.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : cmp.status === 'COMPLETED'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cmp.status}
                  </span>
                </div>

                {/* Live Progress Bar */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Tindakan Selesai & Terverifikasi:</span>
                    <span className="text-white font-extrabold text-sm">
                      {cmp.completedCount} / {cmp.targetCount}{' '}
                      <span className="text-pink-400 font-bold">({percent}%)</span>
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Sisa: {remaining} Action</span>
                    <span>Total Biaya: {cmp.totalBudget} IG Points</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-500">
                    Dibuat {new Date(cmp.createdAt).toLocaleDateString('id-ID')}
                  </span>

                  <div className="flex items-center space-x-2">
                    {cmp.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleToggleStatus(cmp)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                      >
                        {cmp.status === 'ACTIVE' ? (
                          <>
                            <Pause className="w-3.5 h-3.5 text-amber-400" />
                            <span>Jeda</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Lanjutkan</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteModalCampaign(cmp)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-semibold transition cursor-pointer"
                      title="Hapus campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Buat Boost Campaign</h2>
                <p className="text-xs text-slate-400">
                  Dapatkan exposure organik dari anggota komunitas nyata
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              {/* Campaign Type Select Grid */}
              <div>
                <label className="block font-semibold text-slate-300 mb-2">
                  Pilih Jenis Engagement:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'FOLLOWERS', label: 'Followers', cost: settings.followReward, icon: UserCheck },
                    { id: 'LIKES', label: 'Likes Post', cost: settings.likeReward, icon: Heart },
                    { id: 'COMMENTS', label: 'Comments', cost: settings.commentReward, icon: MessageSquare },
                    { id: 'STORY_VIEWS', label: 'Story Views', cost: settings.storyViewReward, icon: Eye },
                    { id: 'PROFILE_VISITS', label: 'Profile Visits', cost: settings.profileVisitReward, icon: Instagram },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = campaignType === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleTypeChange(item.id as CampaignType)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                          isSel
                            ? 'bg-purple-950/60 border-pink-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isSel ? 'text-pink-400' : 'text-slate-500'}`} />
                        <span className="font-bold text-xs text-slate-200">{item.label}</span>
                        <span className="text-[10px] text-amber-300 mt-1 font-mono">
                          {item.cost} Pts/act
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Username */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Target Instagram Username <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <span className="text-slate-500 absolute left-3 top-2.5 font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    placeholder="tokosaya"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs"
                  />
                </div>
              </div>

              {/* Target URL */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Target URL (Profil / Postingan / Reel) <span className="text-pink-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs"
                />
              </div>

              {/* Comment Guide (if comment type) */}
              {campaignType === 'COMMENTS' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Panduan Komentar yang Diinginkan
                  </label>
                  <textarea
                    rows={2}
                    value={commentGuide}
                    onChange={(e) => setCommentGuide(e.target.value)}
                    placeholder="Contoh: Tulis komentar positif tentang produk dan tanyakan varian warna (no spam)."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs"
                  />
                </div>
              )}

              {/* Target Quantity & Niche */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Jumlah Target Engagement
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    value={targetCount}
                    onChange={(e) => setTargetCount(Math.max(5, parseInt(e.target.value) || 5))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Minimal 5</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kategori Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as NicheType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Biaya per Tindakan:</span>
                  <span className="font-bold text-white">{costPerAction} IG Points</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Target Engagement:</span>
                  <span className="font-bold text-white">{targetCount} Akun Nyata</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-800">
                  <span className="text-amber-300">Total Budget Poin:</span>
                  <span className="text-amber-300">{totalCost.toLocaleString('id-ID')} IG Points</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Saldo Anda Saat Ini:</span>
                  <span className={hasEnoughPoints ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {currentUser.points.toLocaleString('id-ID')} Points
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/3 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !hasEnoughPoints}
                  className={`w-2/3 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition ${
                    hasEnoughPoints
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-purple-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {hasEnoughPoints
                      ? isSubmitting
                        ? 'Memproses...'
                        : 'Luncurkan Campaign'
                      : 'Poin Tidak Cukup'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {!hasEnoughPoints && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      onNavigate('tasks');
                    }}
                    className="text-xs text-pink-400 hover:underline font-semibold"
                  >
                    Kumpulkan Poin di Task Center Sekarang →
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Delete Campaign Confirmation Modal */}
      {deleteModalCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center space-x-2 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Hapus Campaign</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-bold text-[10px] border border-pink-500/20">
                  {deleteModalCampaign.type}
                </span>
                <span className="text-[10px] text-slate-400">{deleteModalCampaign.niche}</span>
              </div>
              <p className="font-semibold text-slate-200 line-clamp-2">{deleteModalCampaign.title}</p>
              <p className="text-[11px] font-mono text-purple-400">Target: @{deleteModalCampaign.targetInstagramUsername}</p>
              
              <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                <span>
                  Selesai: {deleteModalCampaign.completedCount} / {deleteModalCampaign.targetCount}
                </span>
                <span className="font-bold text-emerald-400">
                  {deleteModalCampaign.status === 'COMPLETED'
                    ? 'Selesai 100%'
                    : `Refund: ${(deleteModalCampaign.targetCount - deleteModalCampaign.completedCount) * deleteModalCampaign.costPerAction} Pts`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {deleteModalCampaign.status !== 'COMPLETED' && deleteModalCampaign.targetCount > deleteModalCampaign.completedCount
                ? `Poin sisa aksi yang belum dikerjakan (${(deleteModalCampaign.targetCount - deleteModalCampaign.completedCount) * deleteModalCampaign.costPerAction} IG Points) akan otomatis dikembalikan ke saldo Anda.`
                : 'Apakah Anda yakin ingin menghapus campaign ini dari daftar?'}
            </p>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalCampaign(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  storage.deleteCampaign(deleteModalCampaign.id, currentUser.id);
                  setDeleteModalCampaign(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-tr from-red-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-red-600/20 cursor-pointer transition flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
