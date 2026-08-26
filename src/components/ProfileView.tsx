import React, { useState } from 'react';
import {
  User as UserIcon,
  Instagram,
  Tag,
  ShieldCheck,
  Calendar,
  Coins,
  CheckCircle2,
  ExternalLink,
  Save,
  Lock,
  Flame,
  Users,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { User, NicheType } from '../types';
import { storage } from '../lib/storage';

interface ProfileViewProps {
  currentUser: User;
  onLogout?: () => void;
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

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onLogout }) => {
  const [igUsername, setIgUsername] = useState(currentUser.instagramProfile?.username || '');
  const [profileUrl, setProfileUrl] = useState(
    currentUser.instagramProfile?.profileUrl || `https://instagram.com/${currentUser.username}`
  );
  const [niche, setNiche] = useState<NicheType>(
    currentUser.instagramProfile?.niche || 'Personal'
  );
  const [savedMsg, setSavedMsg] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateInstagramProfile(currentUser.id, {
      username: igUsername,
      profileUrl,
      niche,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsChangingPass(true);
    const res = storage.changePassword(currentUser.id, currentPassword, newPassword);
    setIsChangingPass(false);

    if (!res.success) {
      setPasswordError(res.error || 'Gagal mengubah kata sandi.');
    } else {
      setPasswordSuccess('Kata sandi berhasil diubah! Gunakan kata sandi baru ini saat login berikutnya.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Profile Bento Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 p-1 shadow-xl shrink-0">
          <div className="w-full h-full rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center font-bold text-3xl text-white">
            {currentUser.instagramProfile?.avatarUrl ? (
              <img
                src={currentUser.instagramProfile.avatarUrl}
                alt={currentUser.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser.displayName.charAt(0)
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.displayName}</h1>
              <span className="px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                {currentUser.role}
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                title="Keluar dari akun ini"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>
          <p className="text-xs text-slate-400">Email: {currentUser.email}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Bergabung {new Date(currentUser.createdAt).toLocaleDateString('id-ID')}</span>
            </span>

            <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center space-x-1.5 font-bold">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{currentUser.dailyStreak} Hari Streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. Instagram Profile Settings Bento Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-6">
        <div className="flex items-center space-x-2 text-pink-400 font-bold text-base pb-3 border-b border-slate-800/80">
          <Instagram className="w-5 h-5" />
          <span>Pengaturan Akun Instagram Terhubung</span>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Data profil Instagram berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Username Akun Instagram Anda
            </label>
            <div className="relative">
              <span className="text-slate-500 absolute left-3.5 top-2.5 font-mono">@</span>
              <input
                type="text"
                required
                value={igUsername}
                onChange={(e) => {
                  setIgUsername(e.target.value);
                  setProfileUrl(`https://instagram.com/${e.target.value.replace('@', '')}`);
                }}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Akun ini yang akan menerima followers dan likes saat membuat campaign.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Tautan Profil Instagram
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                required
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs"
              />
              <button
                type="button"
                onClick={() => window.open(profileUrl, '_blank')}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 cursor-pointer"
                title="Buka URL Profil"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kategori Niche Akun
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheType)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-emerald-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>KIPAW IG BOOSTER tidak pernah menyimpan password atau kredensial rahasia Instagram Anda.</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil Instagram</span>
          </button>
        </form>
      </div>

      {/* 2. Security & Change Login Password Bento Card (For Both Admin & User) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <KeyRound className="w-5 h-5" />
            <span>Keamanan & Ubah Kata Sandi Akun</span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            Role: {currentUser.role}
          </span>
        </div>

        {passwordSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          {/* Current Password */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kata Sandi Lama / Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi lama akun Anda"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentUser.role === 'ADMIN' ? 'Default admin password: admin123' : 'Default user password: password123'}
            </p>
          </div>

          {/* New Password */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                placeholder="Minimal 6 karakter kombinasi aman"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="Ketik ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                newPassword.length >= 6 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
              }`}>
                {newPassword.length >= 6 ? '✓' : '•'}
              </div>
              <span>Panjang kata sandi minimal 6 karakter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                newPassword && newPassword === confirmPassword ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
              }`}>
                {newPassword && newPassword === confirmPassword ? '✓' : '•'}
              </div>
              <span>Konfirmasi kata sandi cocok</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isChangingPass ? 'Memproses...' : 'Perbarui Kata Sandi'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
