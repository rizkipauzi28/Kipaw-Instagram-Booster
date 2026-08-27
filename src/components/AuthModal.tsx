import React, { useState, useEffect } from 'react';
import {
  X,
  Instagram,
  Mail,
  Lock,
  User as UserIcon,
  Tag,
  ShieldCheck,
  ArrowRight,
  Gift,
  Eye,
  EyeOff
} from 'lucide-react';
import { NicheType } from '../types';
import { storage } from '../lib/storage';
import { KipawLogo } from './KipawLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [niche, setNiche] = useState<NicheType>('Personal');
  const [referralCode, setReferralCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear inputs and hide password whenever modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setUsername('');
      setDisplayName('');
      setInstagramUsername('');
      setReferralCode('');
      setErrorMsg('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setUsername('');
    setDisplayName('');
    setInstagramUsername('');
    setReferralCode('');
    setErrorMsg('');
    setShowPassword(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (mode === 'register') {
      if (!email || !username || !instagramUsername) {
        setErrorMsg('Harap lengkapi seluruh kolom wajib.');
        setIsSubmitting(false);
        return;
      }

      if (password && password.length < 6) {
        setErrorMsg('Kata sandi minimal harus 6 karakter.');
        setIsSubmitting(false);
        return;
      }

      const res = storage.register({
        email,
        username,
        displayName: displayName || username,
        password: password || 'password123',
        instagramUsername,
        niche,
        referralCodeInput: referralCode,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Gagal mendaftar.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onClose();
    } else {
      if (!username) {
        setErrorMsg('Harap masukkan Username atau Email Anda.');
        setIsSubmitting(false);
        return;
      }

      const res = storage.login(username, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal masuk.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <KipawLogo size="md" />
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'register' ? 'Daftar KIPAW IG BOOSTER' : 'Masuk ke Akun Anda'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'register'
                ? 'Dapatkan 50 IG Points bonus untuk pendaftaran pertama!'
                : 'Lanjutkan bertukar engagement organik dengan komunitas'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-950/60 p-1 mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Baru (+50 Points)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Masuk Akun
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs leading-relaxed space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-red-400 font-bold">⚠️</span>
              <p className="flex-1">{errorMsg}</p>
            </div>
            {mode === 'login' && username && (
              <div className="pt-2 border-t border-red-800/40 flex items-center justify-between">
                <span className="text-[11px] text-red-200">Belum punya akun?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    if (!email && username.includes('@')) {
                      setEmail(username);
                    }
                    if (!instagramUsername && !username.includes('@')) {
                      setInstagramUsername(username);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-bold transition cursor-pointer"
                >
                  Daftar Sekarang →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              {/* Display Name */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Tampilan</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Alamat Email <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* Username */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Username Platform <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <span className="text-slate-500 absolute left-3 top-2.5 font-mono">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'register' ? 'username_anda' : 'username atau email'}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
              />
            </div>
          </div>

          {/* Password (for safety demo) */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kata Sandi / Password <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {mode === 'register'
                ? 'Buat kata sandi untuk login akun (minimal 6 karakter).'
                : 'Masukkan kata sandi akun Anda.'}
            </p>
          </div>

          {/* Instagram Info Setup for Register */}
          {mode === 'register' && (
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-3">
              <div className="flex items-center space-x-2 text-pink-400 font-bold">
                <Instagram className="w-4 h-4" />
                <span>Hubungkan Profil Instagram Anda</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Username Instagram Asli <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <span className="text-slate-500 absolute left-3 top-2.5 font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    placeholder="akun_instagram_anda"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Kategori / Niche Akun</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value as NicheType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-pink-500 text-xs"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Kode Undangan / Referral (Opsional)
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Contoh: IGB-RZK28"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Kami TIDAK PERNAH meminta password atau login Instagram Anda.</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{mode === 'register' ? 'Selesaikan Pendaftaran' : 'Masuk ke Akun'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
